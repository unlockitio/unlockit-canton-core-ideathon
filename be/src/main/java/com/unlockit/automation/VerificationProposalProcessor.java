package com.unlockit.automation;

import com.daml.ledger.api.v2.CommandServiceGrpc;
import com.daml.ledger.javaapi.data.*;
import com.daml.ledger.javaapi.data.codegen.Update;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;
import retvn.transaction.VerificationProposal;

import java.util.UUID;

@ApplicationScoped
public class VerificationProposalProcessor {

    private static final Logger LOG = Logger.getLogger(VerificationProposalProcessor.class);

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

    public void acceptProposal(VerificationProposal.Contract contract) {
        try {
            LOG.infof("Executing AcceptVerification choice for verifier: %s", contract.data.verifier);

            var update = contract.id.exerciseAcceptVerification();
            submitCommand(update);

            LOG.infof("Successfully submitted AcceptVerification for verifier: %s", contract.data.verifier);

        } catch (Exception e) {
            LOG.errorf(e, "Failed to accept verification proposal: %s", e.getMessage());
        }
    }

    public void rejectProposal(VerificationProposal.Contract contract, String reason) {
        try {
            LOG.infof("Executing RejectVerification choice for verifier: %s with reason: %s",
                    contract.data.verifier, reason);

            var update = contract.id.exerciseRejectVerification(reason);
            submitCommand(update);

            LOG.infof("Successfully submitted RejectVerification for verifier: %s", contract.data.verifier);

        } catch (Exception e) {
            LOG.errorf(e, "Failed to reject verification proposal: %s", e.getMessage());
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
