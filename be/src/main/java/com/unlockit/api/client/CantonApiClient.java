package com.unlockit.api.client;

import com.unlockit.api.dto.CantonActiveContractsRequest;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;

@Path("/v2")
@RegisterRestClient(configKey = "canton-api")
public interface CantonApiClient {

    @POST
    @Path("/state/active-contracts")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    List<Object> getActiveContracts(
        @HeaderParam("Authorization") String authorization,
        CantonActiveContractsRequest request
    );

    @jakarta.ws.rs.GET
    @Path("/state/ledger-end")
    @Produces(MediaType.APPLICATION_JSON)
    Object getLedgerEnd(
        @HeaderParam("Authorization") String authorization
    );
}
