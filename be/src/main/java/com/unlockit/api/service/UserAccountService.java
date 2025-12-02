package com.unlockit.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unlockit.api.client.CantonApiClient;
import com.unlockit.api.dto.CantonActiveContractsRequest;
import com.unlockit.api.dto.RankingEntry;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
public class UserAccountService {

    private static final Logger LOG = Logger.getLogger(UserAccountService.class);

    @Inject
    @RestClient
    CantonApiClient cantonApiClient;

    @Inject
    ObjectMapper objectMapper;

    @ConfigProperty(name = "canton.api.package-id", defaultValue = "")
    String packageId;

    @ConfigProperty(name = "canton.api.operator-party-id", defaultValue = "")
    String operatorPartyId;

    /**
     * Get UserAccount contracts for the operator party
     * The JWT token is used for authentication only, not for party filtering
     *
     * @param bearerToken The JWT bearer token (must be valid format)
     * @return List of UserAccount contracts visible to the operator
     */
    public List<Object> getUserAccounts(String bearerToken) {
        if (operatorPartyId == null || operatorPartyId.isBlank()) {
            throw new IllegalStateException("Operator party ID not configured. Please set canton.api.operator-party-id in application.properties");
        }

        // Build template ID: <PACKAGE_ID>:RETVN.Role:UserAccount
        String templateId = buildTemplateId("RETVN.Role", "UserAccount");

        LOG.infof("Querying Canton for template: %s, operator party: %s", templateId, operatorPartyId);

        String authHeader = "Bearer " + bearerToken;

        // Get ledger end offset
        String offset = getLedgerEndOffset(authHeader);
        LOG.infof("Using ledger offset: %s", offset);

        // Build request using operator party ID
        CantonActiveContractsRequest request = buildActiveContractsRequest(operatorPartyId, templateId, offset);

        try {
            String requestJson = objectMapper.writeValueAsString(request);
            LOG.infof("Canton API request - Authorization: %s", authHeader);
            LOG.infof("Canton API request - Body: %s", requestJson);
        } catch (Exception e) {
            LOG.warnf("Failed to serialize request for logging: %s", e.getMessage());
        }

        // Call Canton API with Bearer token
        return cantonApiClient.getActiveContracts(authHeader, request);
    }

    private String getLedgerEndOffset(String authHeader) {
        try {
            Object response = cantonApiClient.getLedgerEnd(authHeader);
            LOG.infof("Ledger end response: %s", response);

            // Extract offset from response
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

    /**
     * Validate JWT token format (NOT signature or content)
     * Only checks that it looks like a valid JWT structure
     *
     * @param token The JWT token (without "Bearer " prefix)
     * @return true if token has valid JWT format
     */
    public boolean validateTokenFormat(String token) {
        if (token == null || token.isBlank()) {
            LOG.warn("Token is null or blank");
            return false;
        }

        // JWT must have 3 parts separated by dots: header.payload.signature
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            LOG.warnf("Token has %d parts, expected 3", parts.length);
            return false;
        }

        try {
            // Try to decode header and payload to verify they are valid Base64URL
            // Note: JWT uses base64url encoding (without padding)
            Base64.Decoder decoder = Base64.getUrlDecoder();

            String header = new String(decoder.decode(parts[0]));
            String payload = new String(decoder.decode(parts[1]));

            LOG.debugf("Successfully decoded JWT - Header: %s, Payload: %s", header, payload);

            // We don't validate the signature in this unrealistic API
            // We also don't validate the actual claims like aud, exp, sub
            // Just ensure it's structurally a JWT

            return true;
        } catch (IllegalArgumentException e) {
            LOG.warnf("Failed to decode JWT token: %s", e.getMessage());
            return false;
        }
    }

    /**
     * Extract party ID from JWT token's subject claim
     * NOTE: This is for demonstration - we're not validating the signature!
     *
     * @param token The JWT token
     * @return The subject claim (party ID)
     */
    public String extractPartyId(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }

            // Decode payload
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));

            // Simple JSON parsing to extract "sub" claim
            // In production, use a proper JSON library
            int subIndex = payload.indexOf("\"sub\":");
            if (subIndex == -1) {
                return null;
            }

            int startQuote = payload.indexOf("\"", subIndex + 6);
            int endQuote = payload.indexOf("\"", startQuote + 1);

            if (startQuote != -1 && endQuote != -1) {
                return payload.substring(startQuote + 1, endQuote);
            }

            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private String buildTemplateId(String module, String template) {
        if (packageId != null && !packageId.isBlank()) {
            return packageId + ":" + module + ":" + template;
        }
        // If package ID is not configured, we'll need to discover it
        // For now, return a placeholder that the Canton API might understand
        throw new IllegalStateException("Package ID not configured. Please set canton.api.package-id in application.properties");
    }

    private CantonActiveContractsRequest buildActiveContractsRequest(String partyId, String templateId, String offset) {
        // Build the nested structure for Canton API
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

    /**
     * Get public rankings of non-citizen users
     * This method doesn't require authentication - it uses operator credentials internally
     *
     * @return List of ranking entries sorted by reputation (descending)
     */
    public List<RankingEntry> getPublicRankings() {
        // Create a simple operator token for internal use
        // In production, this would use a proper service account token
        String operatorToken = createOperatorToken();

        // Get all user accounts
        List<Object> contracts = getUserAccounts(operatorToken);

        LOG.infof("Processing %d contracts for rankings", contracts != null ? contracts.size() : 0);

        if (contracts == null || contracts.isEmpty()) {
            return List.of();
        }

        // Extract and filter rankings
        List<RankingEntry> rankings = contracts.stream()
            .map(this::extractRankingEntry)
            .filter(Objects::nonNull)
            .filter(entry -> !"PrivateCitizen".equals(entry.getRole())) // Exclude citizens
            .sorted((a, b) -> Integer.compare(b.getReputation(), a.getReputation())) // Sort by reputation desc
            .collect(Collectors.toList());

        LOG.infof("Returning %d ranking entries", rankings.size());

        return rankings;
    }

    /**
     * Extract ranking entry from a contract object
     */
    private RankingEntry extractRankingEntry(Object contract) {
        try {
            if (!(contract instanceof Map)) {
                return null;
            }

            Map<?, ?> contractMap = (Map<?, ?>) contract;

            // Navigate to the actual contract data
            // Structure: contractEntry -> JsActiveContract -> createdEvent -> createArgument
            Object contractEntry = contractMap.get("contractEntry");
            if (!(contractEntry instanceof Map)) {
                return null;
            }

            Map<?, ?> contractEntryMap = (Map<?, ?>) contractEntry;
            Object jsActiveContract = contractEntryMap.get("JsActiveContract");
            if (!(jsActiveContract instanceof Map)) {
                return null;
            }

            Map<?, ?> jsActiveContractMap = (Map<?, ?>) jsActiveContract;
            Object createdEvent = jsActiveContractMap.get("createdEvent");
            if (!(createdEvent instanceof Map)) {
                return null;
            }

            Map<?, ?> createdEventMap = (Map<?, ?>) createdEvent;
            Object createArgument = createdEventMap.get("createArgument");
            if (!(createArgument instanceof Map)) {
                return null;
            }

            Map<?, ?> payloadMap = (Map<?, ?>) createArgument;

            // Extract user party ID and simplify it
            Object user = payloadMap.get("user");
            if (user == null) {
                return null;
            }

            String userName = extractSimplePartyName(user.toString());

            // Extract reputation (comes as String from Canton)
            Object reputation = payloadMap.get("reputation");
            int reputationValue = 0;
            if (reputation != null) {
                try {
                    if (reputation instanceof Number) {
                        reputationValue = ((Number) reputation).intValue();
                    } else {
                        reputationValue = Integer.parseInt(reputation.toString());
                    }
                } catch (NumberFormatException e) {
                    LOG.warnf("Failed to parse reputation value: %s", reputation);
                }
            }

            // Extract reputationCap (comes as String from Canton)
            Object reputationCap = payloadMap.get("reputationCap");
            int reputationCapValue = 100;
            if (reputationCap != null) {
                try {
                    if (reputationCap instanceof Number) {
                        reputationCapValue = ((Number) reputationCap).intValue();
                    } else {
                        reputationCapValue = Integer.parseInt(reputationCap.toString());
                    }
                } catch (NumberFormatException e) {
                    LOG.warnf("Failed to parse reputationCap value: %s", reputationCap);
                }
            }

            // Extract role
            Object role = payloadMap.get("role");
            String roleValue = "";
            if (role != null) {
                roleValue = role.toString();
            }

            return new RankingEntry(userName, reputationValue, reputationCapValue, roleValue);
        } catch (Exception e) {
            LOG.warnf(e, "Failed to extract ranking entry from contract: %s", e.getMessage());
            return null;
        }
    }

    /**
     * Extract simple party name from full party ID
     * Example: "alice::1220..." -> "alice"
     */
    private String extractSimplePartyName(String fullPartyId) {
        if (fullPartyId == null) {
            return "Unknown";
        }

        // Party format: "name::hash" or "name-hash::hash"
        // We want just the "name" part
        int colonIndex = fullPartyId.indexOf("::");
        if (colonIndex > 0) {
            String namePart = fullPartyId.substring(0, colonIndex);
            // Remove any hash suffix from the name part (e.g., "alice-abc123" -> "alice")
            int dashIndex = namePart.lastIndexOf('-');
            if (dashIndex > 0 && namePart.substring(dashIndex + 1).matches("[0-9a-f]+")) {
                return namePart.substring(0, dashIndex);
            }
            return namePart;
        }

        return fullPartyId;
    }

    /**
     * Create a simple operator token for internal API calls
     * This is a simplified approach - in production, use proper service accounts
     */
    private String createOperatorToken() {
        // Create a minimal JWT token for operator
        // Header: {"alg":"HS256","typ":"JWT"}
        // Payload: {"sub":"operator::...","aud":"canton-ledger-api","iss":"unlockit"}
        // We're just doing structure validation, not signature verification

        try {
            String header = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes());

            String payload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(String.format(
                    "{\"sub\":\"%s\",\"aud\":\"canton-ledger-api\",\"iss\":\"unlockit\"}",
                    operatorPartyId
                ).getBytes());

            String signature = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("fake-signature-for-demo".getBytes());

            return header + "." + payload + "." + signature;
        } catch (Exception e) {
            LOG.errorf(e, "Failed to create operator token");
            throw new RuntimeException("Failed to create operator token", e);
        }
    }
}
