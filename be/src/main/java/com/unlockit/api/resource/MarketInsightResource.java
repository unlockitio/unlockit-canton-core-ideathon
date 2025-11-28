package com.unlockit.api.resource;

import com.unlockit.api.dto.MarketInsightRequest;
import com.unlockit.api.dto.MarketInsightResponse;
import com.unlockit.api.service.MarketInsightService;
import com.unlockit.api.service.UserAccountService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.Map;

@Path("/api/market-insights")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MarketInsightResource {

    private static final Logger LOG = Logger.getLogger(MarketInsightResource.class);

    @Inject
    MarketInsightService marketInsightService;

    @Inject
    UserAccountService userAccountService;

    @POST
    public Response getMarketInsights(
        @HeaderParam("Authorization") String authorization,
        MarketInsightRequest request
    ) {
        LOG.debugf("Received market insight request for postal code: %s", request.getPostalCode());

        // Validate Authorization header
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            LOG.warn("Missing or invalid Authorization header");
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(Map.of("error", "Missing or invalid Authorization header"))
                .build();
        }

        // Extract token
        String token = authorization.substring(7).replaceAll("\\s+", "");

        // Validate token format
        if (!userAccountService.validateTokenFormat(token)) {
            LOG.warn("Invalid JWT token format");
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(Map.of("error", "Invalid JWT token format"))
                .build();
        }

        // Validate request
        if (request.getPostalCode() == null || request.getPostalCode().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("error", "Postal code is required"))
                .build();
        }

        try {
            // Query Canton and calculate insights
            MarketInsightResponse response = marketInsightService.getMarketInsights(token, request);

            LOG.infof("Successfully generated insights: %d combinations, %d total transactions",
                response.getCombinations().size(), response.getTotalTransactionCount());

            return Response.ok(response).build();
        } catch (Exception e) {
            LOG.errorf(e, "Error generating market insights: %s", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of(
                    "error", "Error generating market insights",
                    "message", e.getMessage()
                ))
                .build();
        }
    }
}
