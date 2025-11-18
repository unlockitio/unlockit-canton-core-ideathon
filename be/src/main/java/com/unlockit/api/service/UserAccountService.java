package com.unlockit.api.service;

import com.unlockit.api.client.CantonApiClient;
import com.unlockit.api.dto.CantonActiveContractsRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class UserAccountService {

    private static final Logger LOG = Logger.getLogger(UserAccountService.class);

    @Inject
    @RestClient
    CantonApiClient cantonApiClient;

    @ConfigProperty(name = "canton.api.package-id", defaultValue = "")
    String packageId;

    /**
     * Get UserAccount contracts for a specific party
     *
     * @param bearerToken The JWT bearer token (must be valid format)
     * @param partyId The party ID to query contracts for
     * @return List of UserAccount contracts
     */
    public List<Object> getUserAccounts(String bearerToken, String partyId) {
        // Build template ID: <PACKAGE_ID>:RETVN.Role:UserAccount
        String templateId = buildTemplateId("RETVN.Role", "UserAccount");

        LOG.infof("Querying Canton for template: %s, party: %s", templateId, partyId);

        // Build request
        CantonActiveContractsRequest request = buildActiveContractsRequest(partyId, templateId);

        // Call Canton API with Bearer token
        return cantonApiClient.getActiveContracts("Bearer " + bearerToken, request);
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

    private CantonActiveContractsRequest buildActiveContractsRequest(String partyId, String templateId) {
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

        return new CantonActiveContractsRequest(filterConfig, false, "0");
    }
}
