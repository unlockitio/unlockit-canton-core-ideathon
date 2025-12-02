package com.unlockit.automation;

import com.daml.ledger.api.v2.CommandServiceGrpc;
import com.daml.ledger.javaapi.data.*;
import com.daml.ledger.javaapi.data.codegen.Update;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import retvn.marketinsight.PaymentPendingOrder;

import java.time.Instant;
import java.util.UUID;

@ApplicationScoped
public class PaymentPendingOrderProcessor {

    private static final Logger LOG = Logger.getLogger(PaymentPendingOrderProcessor.class);

    @ConfigProperty(name = "canton.grpc.host")
    String grpcHost;

    @ConfigProperty(name = "canton.grpc.port")
    int grpcPort;

    @ConfigProperty(name = "canton.grpc.app-id")
    String appId;

    @ConfigProperty(name = "canton.api.operator-party-id")
    String operatorPartyId;

    private ManagedChannel channel;

    private ManagedChannel getChannel() {
        if (channel == null || channel.isShutdown()) {
            channel = ManagedChannelBuilder
                    .forAddress(grpcHost, grpcPort)
                    .maxInboundMessageSize(10485760)
                    .usePlaintext()
                    .build();
        }
        return channel;
    }

    public void confirmPayment(PaymentPendingOrder.Contract contract) {
        try {
            LOG.infof("Executing ConfirmPayment choice for buyer: %s, amount: %s",
                    contract.data.buyer, contract.data.paymentAmount);

            Instant confirmedAt = Instant.now();
            var update = contract.id.exerciseConfirmPayment(confirmedAt);
            submitCommand(update);

            LOG.infof("Successfully confirmed payment for buyer: %s", contract.data.buyer);

        } catch (Exception e) {
            LOG.errorf(e, "Failed to confirm payment: %s", e.getMessage());
        }
    }

    public void rejectPayment(PaymentPendingOrder.Contract contract, String failureReason) {
        try {
            LOG.infof("Executing RejectPayment choice for buyer: %s, reason: %s",
                    contract.data.buyer, failureReason);

            Instant rejectedAt = Instant.now();
            var update = contract.id.exerciseRejectPayment(rejectedAt, failureReason);
            submitCommand(update);

            LOG.infof("Successfully rejected payment for buyer: %s", contract.data.buyer);

        } catch (Exception e) {
            LOG.errorf(e, "Failed to reject payment: %s", e.getMessage());
        }
    }

    private <T> void submitCommand(Update<T> update) {
        var updateSubmission = UpdateSubmission
                .create(appId, UUID.randomUUID().toString(), update)
                .withActAs(operatorPartyId);

        var request = new SubmitAndWaitForTransactionRequest(updateSubmission.toCommandsSubmission());

        CommandServiceGrpc.CommandServiceBlockingStub commandService =
                CommandServiceGrpc.newBlockingStub(getChannel());

        commandService.submitAndWaitForTransaction(request.toProto());
    }
}
