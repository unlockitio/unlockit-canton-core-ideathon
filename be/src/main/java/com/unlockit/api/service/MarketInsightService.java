package com.unlockit.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unlockit.api.client.CantonApiClient;
import com.unlockit.api.dto.CantonActiveContractsRequest;
import com.unlockit.api.dto.MarketInsightRequest;
import com.unlockit.api.dto.MarketInsightResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
public class MarketInsightService {

    private static final Logger LOG = Logger.getLogger(MarketInsightService.class);

    @Inject
    @RestClient
    CantonApiClient cantonApiClient;

    @Inject
    ObjectMapper objectMapper;

    @ConfigProperty(name = "canton.api.package-id", defaultValue = "")
    String packageId;

    @ConfigProperty(name = "canton.api.operator-party-id", defaultValue = "")
    String operatorPartyId;

    public MarketInsightResponse getMarketInsights(String bearerToken, MarketInsightRequest request) {
        if (operatorPartyId == null || operatorPartyId.isBlank()) {
            throw new IllegalStateException("Operator party ID not configured");
        }

        // Build template ID for TransactionData
        String templateId = buildTemplateId("RETVN.Transaction", "TransactionData");
        LOG.infof("Querying Canton for template: %s", templateId);

        String authHeader = "Bearer " + bearerToken;
        String offset = getLedgerEndOffset(authHeader);

        // Query all TransactionData contracts
        CantonActiveContractsRequest cantonRequest = buildActiveContractsRequest(operatorPartyId, templateId, offset);
        List<Object> contracts = cantonApiClient.getActiveContracts(authHeader, cantonRequest);

        LOG.infof("Retrieved %d TransactionData contracts from Canton", contracts.size());

        // Parse and filter contracts
        List<TransactionDataContract> transactions = parseContracts(contracts);
        List<TransactionDataContract> filtered = filterTransactions(transactions, request);

        LOG.infof("Filtered to %d transactions matching criteria", filtered.size());

        // Group by segment combinations and calculate statistics
        return calculateInsights(filtered, request);
    }

    private List<TransactionDataContract> parseContracts(List<Object> contracts) {
        List<TransactionDataContract> result = new ArrayList<>();

        for (Object contract : contracts) {
            try {
                if (contract instanceof Map) {
                    Map<?, ?> contractMap = (Map<?, ?>) contract;
                    Object createdEvent = contractMap.get("createdEvent");

                    if (createdEvent instanceof Map) {
                        Map<?, ?> eventMap = (Map<?, ?>) createdEvent;
                        Object payload = eventMap.get("payload");

                        if (payload instanceof Map) {
                            Map<?, ?> payloadMap = (Map<?, ?>) payload;
                            TransactionDataContract tx = parseTransactionData(payloadMap);
                            if (tx != null) {
                                result.add(tx);
                            }
                        }
                    }
                }
            } catch (Exception e) {
                LOG.warnf("Failed to parse contract: %s", e.getMessage());
            }
        }

        return result;
    }

    private TransactionDataContract parseTransactionData(Map<?, ?> payload) {
        try {
            TransactionDataContract tx = new TransactionDataContract();
            tx.postalCode = getString(payload, "postalCode");
            tx.propertyAddress = getString(payload, "propertyAddress");
            tx.salePrice = getDouble(payload, "salePrice");
            tx.trustScore = getDouble(payload, "trustScore");
            tx.bedroomsTotal = getOptionalInt(payload, "bedroomsTotal");
            tx.livingAreaSqft = getOptionalInt(payload, "livingAreaSqft");
            tx.yearBuilt = getOptionalInt(payload, "yearBuilt");
            tx.propertyType = getString(payload, "propertyType");
            tx.daysOnMarket = getOptionalInt(payload, "daysOnMarket");
            tx.transactionDate = getString(payload, "transactionDate");

            return tx;
        } catch (Exception e) {
            LOG.warnf("Failed to parse transaction data: %s", e.getMessage());
            return null;
        }
    }

    private List<TransactionDataContract> filterTransactions(List<TransactionDataContract> transactions, MarketInsightRequest request) {
        return transactions.stream()
            .filter(tx -> filterByPostalCode(tx, request.getPostalCode()))
            .filter(tx -> filterByQualityLevel(tx, request.getQualityLevel()))
            .filter(tx -> filterByTimeRange(tx, request.getTimeRange()))
            .collect(Collectors.toList());
    }

    private boolean filterByPostalCode(TransactionDataContract tx, String postalCode) {
        return postalCode == null || postalCode.equals(tx.postalCode);
    }

    private boolean filterByQualityLevel(TransactionDataContract tx, String qualityLevel) {
        if (qualityLevel == null) return true;

        switch (qualityLevel) {
            case "basic": return true; // All transactions
            case "verified": return tx.trustScore >= 50.0;
            case "premium": return tx.trustScore >= 80.0;
            default: return true;
        }
    }

    private boolean filterByTimeRange(TransactionDataContract tx, String timeRange) {
        if (timeRange == null || tx.transactionDate == null) return true;

        try {
            // Parse transaction date (ISO format from DAML)
            Instant txInstant = Instant.parse(tx.transactionDate);
            LocalDate txDate = txInstant.atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate now = LocalDate.now();

            switch (timeRange) {
                case "recent": // Last 30 days
                    return txDate.isAfter(now.minusDays(30));
                case "year": // Last 12 months
                    return txDate.isAfter(now.minusYears(1));
                case "historic": // All time
                default:
                    return true;
            }
        } catch (Exception e) {
            LOG.warnf("Failed to parse transaction date: %s", e.getMessage());
            return true;
        }
    }

    private MarketInsightResponse calculateInsights(List<TransactionDataContract> transactions, MarketInsightRequest request) {
        // Generate segment combinations
        List<String> bedrooms = request.getBedrooms() != null && !request.getBedrooms().isEmpty()
            ? request.getBedrooms() : Arrays.asList((String) null);
        List<String> livingAreas = request.getLivingArea() != null && !request.getLivingArea().isEmpty()
            ? request.getLivingArea() : Arrays.asList((String) null);
        List<String> yearBuilts = request.getYearBuilt() != null && !request.getYearBuilt().isEmpty()
            ? request.getYearBuilt() : Arrays.asList((String) null);
        List<String> propertyTypes = request.getPropertyType() != null && !request.getPropertyType().isEmpty()
            ? request.getPropertyType() : Arrays.asList((String) null);

        List<MarketInsightResponse.SegmentCombination> combinations = new ArrayList<>();
        int totalCount = 0;

        for (String bedroom : bedrooms) {
            for (String livingArea : livingAreas) {
                for (String yearBuilt : yearBuilts) {
                    for (String propertyType : propertyTypes) {
                        List<TransactionDataContract> segmentTxs = filterBySegment(
                            transactions, bedroom, livingArea, yearBuilt, propertyType
                        );

                        if (!segmentTxs.isEmpty()) {
                            MarketInsightResponse.SegmentCombination combo = calculateSegmentStats(
                                segmentTxs, bedroom, livingArea, yearBuilt, propertyType, request.getDataScope()
                            );
                            combinations.add(combo);
                            totalCount += segmentTxs.size();
                        }
                    }
                }
            }
        }

        return new MarketInsightResponse(combinations, totalCount);
    }

    private List<TransactionDataContract> filterBySegment(
        List<TransactionDataContract> transactions,
        String bedroom, String livingArea, String yearBuilt, String propertyType
    ) {
        return transactions.stream()
            .filter(tx -> matchesBedroom(tx, bedroom))
            .filter(tx -> matchesLivingArea(tx, livingArea))
            .filter(tx -> matchesYearBuilt(tx, yearBuilt))
            .filter(tx -> matchesPropertyType(tx, propertyType))
            .collect(Collectors.toList());
    }

    private boolean matchesBedroom(TransactionDataContract tx, String bedroom) {
        if (bedroom == null || tx.bedroomsTotal == null) return true;

        if (bedroom.equals("Studio")) return tx.bedroomsTotal == 0;
        if (bedroom.equals("5+")) return tx.bedroomsTotal >= 5;

        try {
            int bedCount = Integer.parseInt(bedroom);
            return tx.bedroomsTotal == bedCount;
        } catch (NumberFormatException e) {
            return true;
        }
    }

    private boolean matchesLivingArea(TransactionDataContract tx, String livingArea) {
        if (livingArea == null || tx.livingAreaSqft == null) return true;

        try {
            if (livingArea.startsWith("<")) {
                int max = Integer.parseInt(livingArea.substring(1));
                return tx.livingAreaSqft < max;
            } else if (livingArea.endsWith("+")) {
                int min = Integer.parseInt(livingArea.substring(0, livingArea.length() - 1));
                return tx.livingAreaSqft >= min;
            } else if (livingArea.contains("-")) {
                String[] parts = livingArea.split("-");
                int min = Integer.parseInt(parts[0]);
                int max = Integer.parseInt(parts[1]);
                return tx.livingAreaSqft >= min && tx.livingAreaSqft < max;
            }
        } catch (Exception e) {
            return true;
        }

        return true;
    }

    private boolean matchesYearBuilt(TransactionDataContract tx, String yearBuilt) {
        if (yearBuilt == null || tx.yearBuilt == null) return true;

        try {
            if (yearBuilt.equals("Pre-1950")) return tx.yearBuilt < 1950;
            if (yearBuilt.equals("1950s-1970s")) return tx.yearBuilt >= 1950 && tx.yearBuilt < 1980;
            if (yearBuilt.equals("1980s-1990s")) return tx.yearBuilt >= 1980 && tx.yearBuilt < 2000;
            if (yearBuilt.equals("2000s-2010s")) return tx.yearBuilt >= 2000 && tx.yearBuilt < 2020;
            if (yearBuilt.equals("2020+")) return tx.yearBuilt >= 2020;
        } catch (Exception e) {
            return true;
        }

        return true;
    }

    private boolean matchesPropertyType(TransactionDataContract tx, String propertyType) {
        if (propertyType == null || tx.propertyType == null) return true;
        return tx.propertyType.equals(propertyType);
    }

    private MarketInsightResponse.SegmentCombination calculateSegmentStats(
        List<TransactionDataContract> transactions,
        String bedroom, String livingArea, String yearBuilt, String propertyType,
        String dataScope
    ) {
        MarketInsightResponse.SegmentCombination combo = new MarketInsightResponse.SegmentCombination();
        combo.setBedroom(bedroom);
        combo.setLivingArea(livingArea);
        combo.setYearBuilt(yearBuilt);
        combo.setPropertyType(propertyType);
        combo.setTransactionCount(transactions.size());

        // Calculate price statistics
        DoubleSummaryStatistics priceStats = transactions.stream()
            .mapToDouble(tx -> tx.salePrice)
            .summaryStatistics();

        combo.setMinPrice(priceStats.getMin());
        combo.setAvgPrice(priceStats.getAverage());
        combo.setMaxPrice(priceStats.getMax());

        // Calculate days on market (if standard or detailed scope)
        if (!"basic".equals(dataScope)) {
            IntSummaryStatistics domStats = transactions.stream()
                .filter(tx -> tx.daysOnMarket != null)
                .mapToInt(tx -> tx.daysOnMarket)
                .summaryStatistics();

            if (domStats.getCount() > 0) {
                combo.setMinDaysOnMarket((int) domStats.getMin());
                combo.setAvgDaysOnMarket((int) domStats.getAverage());
                combo.setMaxDaysOnMarket((int) domStats.getMax());
            }
        }

        // Include individual transactions (if detailed scope)
        if ("detailed".equals(dataScope)) {
            List<MarketInsightResponse.Transaction> txList = transactions.stream()
                .limit(10) // Limit to 10 transactions per segment
                .map(this::mapToResponseTransaction)
                .collect(Collectors.toList());
            combo.setTransactions(txList);
        }

        return combo;
    }

    private MarketInsightResponse.Transaction mapToResponseTransaction(TransactionDataContract tx) {
        MarketInsightResponse.Transaction responseTx = new MarketInsightResponse.Transaction();
        responseTx.setAddress(tx.propertyAddress);
        responseTx.setPrice(tx.salePrice);
        responseTx.setBedrooms(tx.bedroomsTotal != null ? tx.bedroomsTotal : 0);
        responseTx.setSqft(tx.livingAreaSqft != null ? tx.livingAreaSqft : 0);

        // Convert exact trust score to range
        responseTx.setTrustScoreRange(getTrustScoreRange(tx.trustScore));

        // Format date
        try {
            Instant instant = Instant.parse(tx.transactionDate);
            LocalDate date = instant.atZone(ZoneId.systemDefault()).toLocalDate();
            responseTx.setDate(date.toString());
        } catch (Exception e) {
            responseTx.setDate(tx.transactionDate);
        }

        return responseTx;
    }

    private String getTrustScoreRange(double trustScore) {
        if (trustScore >= 90) return "90-100";
        if (trustScore >= 80) return "80-90";
        if (trustScore >= 70) return "70-80";
        if (trustScore >= 60) return "60-70";
        if (trustScore >= 50) return "50-60";
        return "0-50";
    }

    // Helper methods
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

    private String getString(Map<?, ?> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : null;
    }

    private double getDouble(Map<?, ?> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        if (value instanceof String) {
            return Double.parseDouble((String) value);
        }
        return 0.0;
    }

    private Integer getOptionalInt(Map<?, ?> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    // Inner class to hold parsed transaction data
    private static class TransactionDataContract {
        String postalCode;
        String propertyAddress;
        double salePrice;
        double trustScore;
        Integer bedroomsTotal;
        Integer livingAreaSqft;
        Integer yearBuilt;
        String propertyType;
        Integer daysOnMarket;
        String transactionDate;
    }
}
