package com.unlockit.api.resource;

import com.unlockit.api.service.UserAccountService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Map;

@Path("/api/user-accounts")
@Produces(MediaType.APPLICATION_JSON)
public class UserAccountResource {

    private static final Logger LOG = Logger.getLogger(UserAccountResource.class);

    @Inject
    UserAccountService userAccountService;

    /**
     * Get UserAccount contracts for the authenticated user
     *
     * @param authorization Bearer token from Authorization header
     * @return List of UserAccount contracts
     */
    @GET
    public Response getUserAccounts(@HeaderParam("Authorization") String authorization) {
        LOG.debug("Received request for user accounts");

        // Validate Authorization header
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            LOG.warn("Missing or invalid Authorization header");
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(Map.of("error", "Missing or invalid Authorization header"))
                .build();
        }

        // Extract token (remove "Bearer " prefix and strip ALL whitespace)
        String token = authorization.substring(7).replaceAll("\\s+", "");

        LOG.debugf("Extracted token (length: %d): %s", token.length(), token.substring(0, Math.min(20, token.length())) + "...");

        // Validate token format (structure only, not signature)
        if (!userAccountService.validateTokenFormat(token)) {
            LOG.warn("Invalid JWT token format");
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(Map.of("error", "Invalid JWT token format"))
                .build();
        }

        // Extract party ID from token
        String partyId = userAccountService.extractPartyId(token);
        if (partyId == null) {
            LOG.warn("Could not extract party ID from token");
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(Map.of("error", "Invalid token: missing subject claim"))
                .build();
        }

        LOG.infof("Querying UserAccount contracts for party: %s", partyId);

        try {
            // Call Canton API
            List<Object> contracts = userAccountService.getUserAccounts(token, partyId);

            LOG.infof("Successfully retrieved %d contracts", contracts != null ? contracts.size() : 0);

            // Return contracts directly (Canton returns array, not wrapped in "result")
            return Response.ok(contracts).build();
        } catch (Exception e) {
            LOG.errorf(e, "Error calling Canton API: %s", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of(
                    "error", "Error calling Canton API",
                    "message", e.getMessage()
                ))
                .build();
        }
    }
}
