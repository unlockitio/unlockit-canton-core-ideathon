package com.unlockit.automation;

import com.daml.ledger.api.v2.CommandServiceGrpc;
import com.daml.ledger.javaapi.data.*;
import com.daml.ledger.javaapi.data.codegen.Update;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unlockit.api.client.CantonApiClient;
import com.unlockit.api.dto.CantonActiveContractsRequest;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;
import retvn.marketinsight.PaidMarketInsightOrder;
import retvn.marketinsight.QueryParams;
import retvn.transaction.TransactionData;

import java.time.Instant;
import java.util.*;

@ApplicationScoped
public class PaidMarketInsightOrderProcessor {

    private static final Logger LOG = Logger.getLogger(PaidMarketInsightOrderProcessor.class);

    @ConfigProperty(name = "canton.grpc.host")
    String grpcHost;

    @ConfigProperty(name = "canton.grpc.port")
    int grpcPort;

    @ConfigProperty(name = "canton.grpc.app-id")
    String appId;

    @ConfigProperty(name = "canton.api.package-id")
    String packageId;

    @ConfigProperty(name = "canton.api.operator-party-id")
    String operatorPartyId;

    @Inject
    @RestClient
    CantonApiClient cantonApiClient;

    @Inject
    ObjectMapper objectMapper;

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

    public void fulfillOrder(PaidMarketInsightOrder.Contract paidOrderContract, String bearerToken) {
        try {
            LOG.infof("Fulfilling order for buyer: %s", paidOrderContract.data.buyer);

            // Step 1: Query all TransactionData contracts using Canton JSON API
            List<TransactionData.Contract> allTransactions = queryAllTransactionData(bearerToken);
            LOG.infof("Found %d total transactions on ledger", allTransactions.size());

            // Step 2: Filter transactions based on QueryParams
            Instant fulfilledAt = Instant.now();
            List<TransactionData.Contract> filteredTransactions = filterTransactionsByQueryParams(
                    allTransactions,
                    paidOrderContract.data.queryParams,
                    fulfilledAt
            );
            LOG.infof("Filtered to %d transactions matching query params", filteredTransactions.size());

            // Step 3: Extract ContractIds
            List<TransactionData.ContractId> filteredCids = new ArrayList<>();
            for (TransactionData.Contract tx : filteredTransactions) {
                filteredCids.add(tx.id);
            }

            // Step 4: Exercise FulfillOrder choice
            var update = paidOrderContract.id.exerciseFulfillOrder(
                    filteredCids,
                    fulfilledAt,
                    paidOrderContract.id
            );

            submitCommand(update);

            LOG.infof("Successfully fulfilled order for buyer: %s with %d transactions",
                    paidOrderContract.data.buyer, filteredCids.size());

        } catch (Exception e) {
            LOG.errorf(e, "Failed to fulfill order: %s", e.getMessage());
        }
    }

    private List<TransactionData.Contract> queryAllTransactionData(String bearerToken) {
        try {
            // Build template ID: <PACKAGE_ID>:RETVN.Transaction:TransactionData
            String templateId = packageId + ":RETVN.Transaction:TransactionData";

            LOG.infof("Querying Canton for template: %s, operator party: %s", templateId, operatorPartyId);

            String authHeader = "Bearer " + bearerToken;

            // Get ledger end offset
            String offset = getLedgerEndOffset(authHeader);
            LOG.infof("Using ledger offset: %s", offset);

            // Build request using operator party ID
            CantonActiveContractsRequest request = buildActiveContractsRequest(operatorPartyId, templateId, offset);

            // Call Canton API
            List<Object> response = cantonApiClient.getActiveContracts(authHeader, request);
            LOG.infof("Received %d contracts from Canton API", response.size());

            // Parse response into TransactionData.Contract objects
            List<TransactionData.Contract> contracts = new ArrayList<>();
            for (Object item : response) {
                try {
                    if (item instanceof Map) {
                        Map<?, ?> itemMap = (Map<?, ?>) item;
                        Object contractEntry = itemMap.get("contractEntry");
                        if (contractEntry instanceof Map) {
                            Map<?, ?> entryMap = (Map<?, ?>) contractEntry;
                            Object jsActiveContract = entryMap.get("JsActiveContract");
                            if (jsActiveContract instanceof Map) {
                                Map<?, ?> activeMap = (Map<?, ?>) jsActiveContract;
                                Object createdEvent = activeMap.get("createdEvent");
                                if (createdEvent instanceof Map) {
                                    Map<?, ?> eventMap = (Map<?, ?>) createdEvent;

                                    // Convert to JSON and deserialize using generated code
                                    String json = objectMapper.writeValueAsString(eventMap);
                                    var createdEventProto = objectMapper.readValue(json, com.daml.ledger.javaapi.data.CreatedEvent.class);

                                    TransactionData.Contract contract = TransactionData.Contract.fromCreatedEvent(createdEventProto);
                                    contracts.add(contract);
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    LOG.warnf("Failed to parse TransactionData contract: %s", e.getMessage());
                }
            }

            LOG.infof("Extracted %d TransactionData contracts", contracts.size());
            return contracts;

        } catch (Exception e) {
            LOG.errorf(e, "Failed to query TransactionData contracts: %s", e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<TransactionData.Contract> filterTransactionsByQueryParams(
            List<TransactionData.Contract> transactions,
            QueryParams queryParams,
            Instant fulfilledAt
    ) {
        return transactions.stream()
                .filter(tx -> matchesQualityLevel(tx, queryParams))
                .filter(tx -> matchesTimeRange(tx, queryParams, fulfilledAt))
                .filter(tx -> matchesPostalCode(tx, queryParams))
                .filter(tx -> matchesSegment(tx, queryParams))
                .toList();
    }

    private boolean matchesQualityLevel(TransactionData.Contract tx, QueryParams params) {
        String qualityLevel = params.qualityLevel;
        int trustScore = tx.data.trustScore.intValue();

        return switch (qualityLevel) {
            case "basic" -> true;
            case "verified" -> trustScore >= 50;
            case "premium" -> trustScore >= 80;
            default -> true;
        };
    }

    private boolean matchesTimeRange(TransactionData.Contract tx, QueryParams params, Instant fulfilledAt) {
        String timeRange = params.timeRange;
        Instant transactionDate = tx.data.transactionDate;

        return switch (timeRange) {
            case "recent" -> transactionDate.isAfter(fulfilledAt.minusSeconds(31L * 24 * 60 * 60));  // 31 days
            case "year" -> transactionDate.isAfter(fulfilledAt.minusSeconds(366L * 24 * 60 * 60));  // 366 days
            case "historic" -> true;  // No time filter
            default -> true;
        };
    }

    private boolean matchesPostalCode(TransactionData.Contract tx, QueryParams params) {
        if (params.postalCode.isEmpty()) {
            return true;
        }
        return tx.data.postalCode.equals(params.postalCode.get());
    }

    private boolean matchesSegment(TransactionData.Contract tx, QueryParams params) {
        // If all segment filters are empty, match all
        if (params.bedrooms.isEmpty() && params.livingArea.isEmpty() &&
            params.yearBuilt.isEmpty() && params.propertyType.isEmpty()) {
            return true;
        }

        boolean bedroomsMatch = params.bedrooms.isEmpty() || matchesBedrooms(tx, params.bedrooms);
        boolean livingAreaMatch = params.livingArea.isEmpty() || matchesLivingArea(tx, params.livingArea);
        boolean yearBuiltMatch = params.yearBuilt.isEmpty() || matchesYearBuilt(tx, params.yearBuilt);
        boolean propertyTypeMatch = params.propertyType.isEmpty() || matchesPropertyType(tx, params.propertyType);

        return bedroomsMatch && livingAreaMatch && yearBuiltMatch && propertyTypeMatch;
    }

    private boolean matchesBedrooms(TransactionData.Contract tx, List<String> bedroomFilters) {
        if (tx.data.bedroomsTotal.isEmpty()) {
            return false;
        }

        long bedrooms = tx.data.bedroomsTotal.get();

        for (String filter : bedroomFilters) {
            if (filter.equals("Studio") && bedrooms == 0) return true;
            if (filter.equals("5+") && bedrooms >= 5) return true;
            try {
                long filterValue = Long.parseLong(filter);
                if (bedrooms == filterValue) return true;
            } catch (NumberFormatException ignored) {}
        }
        return false;
    }

    private boolean matchesLivingArea(TransactionData.Contract tx, List<String> areaFilters) {
        if (tx.data.livingAreaSqft.isEmpty()) {
            return false;
        }

        long sqft = tx.data.livingAreaSqft.get();

        for (String filter : areaFilters) {
            if (filter.startsWith("<")) {
                try {
                    long maxSqft = Long.parseLong(filter.substring(1));
                    if (sqft < maxSqft) return true;
                } catch (NumberFormatException ignored) {}
            } else if (filter.endsWith("+")) {
                try {
                    long minSqft = Long.parseLong(filter.substring(0, filter.length() - 1));
                    if (sqft >= minSqft) return true;
                } catch (NumberFormatException ignored) {}
            } else if (filter.contains("-")) {
                String[] parts = filter.split("-");
                if (parts.length == 2) {
                    try {
                        long minSqft = Long.parseLong(parts[0]);
                        long maxSqft = Long.parseLong(parts[1]);
                        if (sqft >= minSqft && sqft < maxSqft) return true;
                    } catch (NumberFormatException ignored) {}
                }
            }
        }
        return false;
    }

    private boolean matchesYearBuilt(TransactionData.Contract tx, List<String> yearFilters) {
        if (tx.data.yearBuilt.isEmpty()) {
            return false;
        }

        long year = tx.data.yearBuilt.get();

        for (String filter : yearFilters) {
            switch (filter) {
                case "Pre-1950":
                    if (year < 1950) return true;
                    break;
                case "1950s-1970s":
                    if (year >= 1950 && year < 1980) return true;
                    break;
                case "1980s-1990s":
                    if (year >= 1980 && year < 2000) return true;
                    break;
                case "2000s-2010s":
                    if (year >= 2000 && year < 2020) return true;
                    break;
                case "2020+":
                    if (year >= 2020) return true;
                    break;
            }
        }
        return false;
    }

    private boolean matchesPropertyType(TransactionData.Contract tx, List<String> propertyTypes) {
        String txPropertyType = tx.data.propertyType.toString();
        return propertyTypes.contains(txPropertyType);
    }

    private String getLedgerEndOffset(String authHeader) {
        try {
            Object response = cantonApiClient.getLedgerEnd(authHeader);
            if (response instanceof Map) {
                Map<?, ?> responseMap = (Map<?, ?>) response;
                Object offset = responseMap.get("offset");
                if (offset != null) {
                    return offset.toString();
                }
            }
            LOG.warn("Could not extract offset from ledger-end response, using '0'");
            return "0";
        } catch (Exception e) {
            LOG.warnf(e, "Error getting ledger end, using default offset '0'");
            return "0";
        }
    }

    private String buildTemplateId(String module, String template) {
        if (packageId != null && !packageId.isBlank()) {
            return packageId + ":" + module + ":" + template;
        }
        throw new IllegalStateException("Package ID not configured");
    }

    private CantonActiveContractsRequest buildActiveContractsRequest(String partyId, String templateId, String offset) {
        var templateFilterValue = new CantonActiveContractsRequest.FilterConfig.PartyFilter
            .TemplateFilterWrapper.IdentifierFilter.TemplateFilter.TemplateFilterValue(templateId, true);

        var templateFilter = new CantonActiveContractsRequest.FilterConfig.PartyFilter
            .TemplateFilterWrapper.IdentifierFilter.TemplateFilter(templateFilterValue);

        var identifierFilter = new CantonActiveContractsRequest.FilterConfig.PartyFilter
            .TemplateFilterWrapper.IdentifierFilter(templateFilter);

        var templateFilterWrapper = new CantonActiveContractsRequest.FilterConfig.PartyFilter
            .TemplateFilterWrapper(identifierFilter);

        var partyFilter = new CantonActiveContractsRequest.FilterConfig.PartyFilter(
            List.of(templateFilterWrapper)
        );

        var filterConfig = new CantonActiveContractsRequest.FilterConfig(
            Map.of(partyId, partyFilter)
        );

        return new CantonActiveContractsRequest(filterConfig, true, offset);
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
