package com.unlockit.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class MarketInsightRequest {

    @JsonProperty("postalCode")
    private String postalCode;

    @JsonProperty("qualityLevel")
    private String qualityLevel; // basic, verified, premium

    @JsonProperty("dataScope")
    private String dataScope; // basic, standard, detailed

    @JsonProperty("timeRange")
    private String timeRange; // recent, year, historic

    @JsonProperty("bedrooms")
    private List<String> bedrooms;

    @JsonProperty("livingArea")
    private List<String> livingArea;

    @JsonProperty("yearBuilt")
    private List<String> yearBuilt;

    @JsonProperty("propertyType")
    private List<String> propertyType;

    public MarketInsightRequest() {}

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getQualityLevel() {
        return qualityLevel;
    }

    public void setQualityLevel(String qualityLevel) {
        this.qualityLevel = qualityLevel;
    }

    public String getDataScope() {
        return dataScope;
    }

    public void setDataScope(String dataScope) {
        this.dataScope = dataScope;
    }

    public String getTimeRange() {
        return timeRange;
    }

    public void setTimeRange(String timeRange) {
        this.timeRange = timeRange;
    }

    public List<String> getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(List<String> bedrooms) {
        this.bedrooms = bedrooms;
    }

    public List<String> getLivingArea() {
        return livingArea;
    }

    public void setLivingArea(List<String> livingArea) {
        this.livingArea = livingArea;
    }

    public List<String> getYearBuilt() {
        return yearBuilt;
    }

    public void setYearBuilt(List<String> yearBuilt) {
        this.yearBuilt = yearBuilt;
    }

    public List<String> getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(List<String> propertyType) {
        this.propertyType = propertyType;
    }
}
