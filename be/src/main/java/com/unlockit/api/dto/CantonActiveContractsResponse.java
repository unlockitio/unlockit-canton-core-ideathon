package com.unlockit.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class CantonActiveContractsResponse {

    @JsonProperty("result")
    private List<Object> result;

    public CantonActiveContractsResponse() {}

    public CantonActiveContractsResponse(List<Object> result) {
        this.result = result;
    }

    public List<Object> getResult() {
        return result;
    }

    public void setResult(List<Object> result) {
        this.result = result;
    }
}
