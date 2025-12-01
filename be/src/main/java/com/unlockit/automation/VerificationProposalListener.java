package com.unlockit.automation;

import com.daml.ledger.api.v2.StateServiceGrpc;
import com.daml.ledger.api.v2.StateServiceOuterClass;
import com.daml.ledger.api.v2.UpdateServiceGrpc;
import com.daml.ledger.api.v2.UpdateServiceOuterClass;
import com.daml.ledger.javaapi.data.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import retvn.transaction.VerificationProposal;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

@ApplicationScoped
public class VerificationProposalListener {

    private static final Logger LOG = Logger.getLogger(VerificationProposalListener.class);

    @ConfigProperty(name = "canton.grpc.host")
    String grpcHost;

    @ConfigProperty(name = "canton.grpc.port")
    int grpcPort;

    @ConfigProperty(name = "canton.api.operator-party-id")
    String operatorPartyId;

    @Inject
    VerificationProposalProcessor processor;

    private ManagedChannel channel;

    void onStart(@Observes StartupEvent ev) {
        LOG.infof("Starting VerificationProposalListener - connecting to Canton gRPC at %s:%d", grpcHost, grpcPort);

        channel = ManagedChannelBuilder
                .forAddress(grpcHost, grpcPort)
                .maxInboundMessageSize(10485760)
                .usePlaintext()
                .build();

        startEventStream();
    }

    void onStop(@Observes ShutdownEvent ev) {
        LOG.info("Shutting down VerificationProposalListener");
        if (channel != null && !channel.isShutdown()) {
            channel.shutdown();
        }
    }

    private void startEventStream() {
        try {
            StateServiceGrpc.StateServiceBlockingStub stateService = StateServiceGrpc.newBlockingStub(channel);

            long ledgerEnd = stateService
                    .getLedgerEnd(StateServiceOuterClass.GetLedgerEndRequest.newBuilder().build())
                    .getOffset();

            LOG.infof("Ledger end offset: %d", ledgerEnd);

            Optional<Set<String>> partyFilter = Optional.of(Collections.singleton(operatorPartyId));
            var contractFilter = VerificationProposal.contractFilter();

            GetUpdatesRequest getUpdatesRequest = new GetUpdatesRequest(
                    ledgerEnd,
                    Optional.empty(),
                    contractFilter.updateFormat(partyFilter)
            );

            UpdateServiceGrpc.UpdateServiceStub updateService = UpdateServiceGrpc.newStub(channel);

            LOG.info("Starting to stream VerificationProposal events...");

            updateService.getUpdates(
                    getUpdatesRequest.toProto(),
                    new StreamObserver<>() {
                        @Override
                        public void onNext(UpdateServiceOuterClass.GetUpdatesResponse response) {
                            try {
                                GetUpdatesResponse updatesResponse = GetUpdatesResponse.fromProto(response);
                                processUpdate(updatesResponse);
                            } catch (Exception e) {
                                LOG.errorf(e, "Error processing update: %s", e.getMessage());
                            }
                        }

                        @Override
                        public void onError(Throwable throwable) {
                            LOG.errorf(throwable, "ERROR in event stream: %s", throwable.getMessage());
                        }

                        @Override
                        public void onCompleted() {
                            LOG.info("Event stream completed");
                        }
                    }
            );

            LOG.info("Event stream started successfully");

        } catch (Exception e) {
            LOG.errorf(e, "Failed to start event stream: %s", e.getMessage());
        }
    }

    private void processUpdate(GetUpdatesResponse response) {
        response.getTransaction().ifPresent(transaction -> {
            LOG.debugf("Received transaction with %d events", transaction.getEvents().size());

            for (Event event : transaction.getEvents()) {
                if (event instanceof CreatedEvent) {
                    CreatedEvent createdEvent = (CreatedEvent) event;
                    LOG.debugf("Created event - Template: %s", createdEvent.getTemplateId());

                    try {
                        VerificationProposal.Contract contract =
                                VerificationProposal.Contract.fromCreatedEvent(createdEvent);

                        LOG.infof("New VerificationProposal created! Contract ID: %s, Verifier: %s",
                                contract.id.contractId,
                                contract.data.verifier);

                        processProposal(contract);

                    } catch (Exception e) {
                        LOG.debugf("Event is not a VerificationProposal: %s", e.getMessage());
                    }
                }
            }
        });
    }

    private void processProposal(VerificationProposal.Contract contract) {
        // Auto-accept all verification proposals from verified users
        LOG.infof("Auto-accepting VerificationProposal from verifier: %s", contract.data.verifier);
        processor.acceptProposal(contract);
    }
}
