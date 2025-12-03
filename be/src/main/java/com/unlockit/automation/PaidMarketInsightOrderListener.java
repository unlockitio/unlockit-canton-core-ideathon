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
import retvn.marketinsight.PaidMarketInsightOrder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

@ApplicationScoped
public class PaidMarketInsightOrderListener {

    private static final Logger LOG = Logger.getLogger(PaidMarketInsightOrderListener.class);

    @ConfigProperty(name = "canton.grpc.host")
    String grpcHost;

    @ConfigProperty(name = "canton.grpc.port")
    int grpcPort;

    @ConfigProperty(name = "canton.api.operator-party-id")
    String operatorPartyId;

    @Inject
    PaidMarketInsightOrderProcessor processor;

    private ManagedChannel channel;

    void onStart(@Observes StartupEvent ev) {
        LOG.infof("Starting PaidMarketInsightOrderListener - connecting to Canton gRPC at %s:%d", grpcHost, grpcPort);

        channel = ManagedChannelBuilder
                .forAddress(grpcHost, grpcPort)
                .maxInboundMessageSize(10485760)
                .usePlaintext()
                .build();

        startEventStream();
    }

    void onStop(@Observes ShutdownEvent ev) {
        LOG.info("Shutting down PaidMarketInsightOrderListener");
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
            var contractFilter = PaidMarketInsightOrder.contractFilter();

            GetUpdatesRequest getUpdatesRequest = new GetUpdatesRequest(
                    ledgerEnd,
                    Optional.empty(),
                    contractFilter.updateFormat(partyFilter)
            );

            UpdateServiceGrpc.UpdateServiceStub updateService = UpdateServiceGrpc.newStub(channel);

            LOG.info("Starting to stream PaidMarketInsightOrder events...");

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
                        PaidMarketInsightOrder.Contract contract =
                                PaidMarketInsightOrder.Contract.fromCreatedEvent(createdEvent);

                        LOG.infof("New PaidMarketInsightOrder created! Contract ID: %s, Buyer: %s, Amount: %s",
                                contract.id.contractId,
                                contract.data.buyer,
                                contract.data.paidAmount);

                        fulfillOrder(contract);

                    } catch (Exception e) {
                        LOG.debugf("Event is not a PaidMarketInsightOrder: %s", e.getMessage());
                    }
                }
            }
        });
    }

    private void fulfillOrder(PaidMarketInsightOrder.Contract contract) {
        try {
            LOG.infof("Auto-fulfilling PaidMarketInsightOrder for buyer: %s", contract.data.buyer);

            // Generate JWT token for Canton API authentication
            String token = generateJwtToken(operatorPartyId);

            processor.fulfillOrder(contract, token);

        } catch (Exception e) {
            LOG.errorf(e, "Failed to fulfill order: %s", e.getMessage());
        }
    }

    private String generateJwtToken(String subject) {
        try {
            // Simple JWT generation matching the frontend logic
            String secret = "mydevsecretkeythatshouldbelongenough123";

            // Create header
            String header = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));

            // Create payload
            long now = Instant.now().getEpochSecond();
            long exp = now + 7200; // 2 hours
            String payload = String.format("{\"sub\":\"%s\",\"aud\":\"daml_ledger_api\",\"exp\":%d}", subject, exp);
            String encodedPayload = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(payload.getBytes(StandardCharsets.UTF_8));

            // Create signature
            String headerAndPayload = header + "." + encodedPayload;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] signatureBytes = mac.doFinal(headerAndPayload.getBytes(StandardCharsets.UTF_8));
            String signature = Base64.getUrlEncoder().withoutPadding().encodeToString(signatureBytes);

            return headerAndPayload + "." + signature;
        } catch (Exception e) {
            LOG.errorf(e, "Failed to generate JWT token: %s", e.getMessage());
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }
}
