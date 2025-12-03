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
import retvn.marketinsight.PaymentPendingOrder;

import java.util.Collections;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

@ApplicationScoped
public class PaymentPendingOrderListener {

    private static final Logger LOG = Logger.getLogger(PaymentPendingOrderListener.class);

    @ConfigProperty(name = "canton.grpc.host")
    String grpcHost;

    @ConfigProperty(name = "canton.grpc.port")
    int grpcPort;

    @ConfigProperty(name = "canton.api.operator-party-id")
    String operatorPartyId;

    @Inject
    PaymentPendingOrderProcessor processor;

    private ManagedChannel channel;
    private final Random random = new Random();

    void onStart(@Observes StartupEvent ev) {
        LOG.infof("Starting PaymentPendingOrderListener - connecting to Canton gRPC at %s:%d", grpcHost, grpcPort);

        channel = ManagedChannelBuilder
                .forAddress(grpcHost, grpcPort)
                .maxInboundMessageSize(10485760)
                .usePlaintext()
                .build();

        startEventStream();
    }

    void onStop(@Observes ShutdownEvent ev) {
        LOG.info("Shutting down PaymentPendingOrderListener");
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
            var contractFilter = PaymentPendingOrder.contractFilter();

            GetUpdatesRequest getUpdatesRequest = new GetUpdatesRequest(
                    ledgerEnd,
                    Optional.empty(),
                    contractFilter.updateFormat(partyFilter)
            );

            UpdateServiceGrpc.UpdateServiceStub updateService = UpdateServiceGrpc.newStub(channel);

            LOG.info("Starting to stream PaymentPendingOrder events...");

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
                        PaymentPendingOrder.Contract contract =
                                PaymentPendingOrder.Contract.fromCreatedEvent(createdEvent);

                        LOG.infof("New PaymentPendingOrder created! Contract ID: %s, Buyer: %s, Amount: %s",
                                contract.id.contractId,
                                contract.data.buyer,
                                contract.data.paymentAmount);

                        processPayment(contract);

                    } catch (Exception e) {
                        LOG.debugf("Event is not a PaymentPendingOrder: %s", e.getMessage());
                    }
                }
            }
        });
    }

    private void processPayment(PaymentPendingOrder.Contract contract) {
        // 80% chance to confirm, 20% chance to reject
        boolean confirm = random.nextInt(100) < 80;

        if (confirm) {
            LOG.infof("Confirming payment for buyer: %s (80%% chance)", contract.data.buyer);
            processor.confirmPayment(contract);
        } else {
            String[] reasons = {
                    "Payment verification failed",
                    "Insufficient funds detected",
                    "Payment reference invalid",
                    "Bank declined the transaction",
                    "Payment timeout exceeded"
            };
            String reason = reasons[random.nextInt(reasons.length)];
            LOG.infof("Rejecting payment for buyer: %s - Reason: %s (20%% chance)",
                    contract.data.buyer, reason);
            processor.rejectPayment(contract, reason);
        }
    }
}
