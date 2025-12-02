package com.unlockit.api.resource;

import com.unlockit.api.dto.RankingEntry;
import com.unlockit.api.service.UserAccountService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Map;

@Path("/api/rankings")
@Produces(MediaType.APPLICATION_JSON)
public class RankingsResource {

    private static final Logger LOG = Logger.getLogger(RankingsResource.class);

    @Inject
    UserAccountService userAccountService;

    /**
     * Public endpoint to get rankings of non-citizen users
     * No authentication required - returns only public information
     *
     * @return List of ranking entries (name, reputation, role) sorted by reputation descending
     */
    @GET
    public Response getRankings() {
        LOG.info("Received public rankings request");

        try {
            // Get rankings (service handles filtering and sorting)
            List<RankingEntry> rankings = userAccountService.getPublicRankings();
            
            LOG.infof("Successfully retrieved %d ranking entries", rankings.size());

            return Response.ok(rankings).build();
        } catch (Exception e) {
            LOG.errorf(e, "Error getting rankings: %s", e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of(
                    "error", "Error retrieving rankings",
                    "message", e.getMessage()
                ))
                .build();
        }
    }
}
