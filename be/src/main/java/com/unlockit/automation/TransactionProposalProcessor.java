package com.unlockit.automation;

import com.daml.ledger.api.v2.CommandServiceGrpc;
import com.daml.ledger.javaapi.data.*;
import com.daml.ledger.javaapi.data.codegen.Exercised;
import com.daml.ledger.javaapi.data.codegen.Update;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import retvn.transaction.AcceptSubmission;
import retvn.transaction.RejectSubmission;
import retvn.transaction.TransactionData;
import retvn.transaction.TransactionSubmissionProposal;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class TransactionProposalProcessor {

    private static final Logger LOG = Logger.getLogger(TransactionProposalProcessor.class);

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

    public void acceptProposal(TransactionSubmissionProposal.Contract contract) {
        try {
            LOG.infof("Executing AcceptSubmission choice for transaction: %s", contract.data.transactionId);

            var update = contract.id.exerciseAcceptSubmission();
            submitCommand(update);

            LOG.infof("Successfully submitted AcceptSubmission for transaction: %s", contract.data.transactionId);

        } catch (Exception e) {
            LOG.errorf(e, "Failed to accept proposal: %s", e.getMessage());
        }
    }

    public void rejectProposal(TransactionSubmissionProposal.Contract contract, String reason) {
        try {
            LOG.infof("Executing RejectSubmission choice for transaction: %s with reason: %s",
                    contract.data.transactionId, reason);

            var update = contract.id.exerciseRejectSubmission(reason);
            submitCommand(update);

            LOG.infof("Successfully submitted RejectSubmission for transaction: %s", contract.data.transactionId);

        } catch (Exception e) {
            LOG.errorf(e, "Failed to reject proposal: %s", e.getMessage());
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
