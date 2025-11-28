package com.unlockit.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class MarketInsightResponse {

    @JsonProperty("combinations")
    private List<SegmentCombination> combinations;

    @JsonProperty("totalTransactionCount")
    private int totalTransactionCount;

    public static class SegmentCombination {
        @JsonProperty("bedroom")
        private String bedroom;

        @JsonProperty("livingArea")
        private String livingArea;

        @JsonProperty("yearBuilt")
        private String yearBuilt;

        @JsonProperty("propertyType")
        private String propertyType;

        @JsonProperty("minPrice")
        private double minPrice;

        @JsonProperty("avgPrice")
        private double avgPrice;

        @JsonProperty("maxPrice")
        private double maxPrice;

        @JsonProperty("minDaysOnMarket")
        private Integer minDaysOnMarket;

        @JsonProperty("avgDaysOnMarket")
        private Integer avgDaysOnMarket;

        @JsonProperty("maxDaysOnMarket")
        private Integer maxDaysOnMarket;

        @JsonProperty("transactionCount")
        private int transactionCount;

        @JsonProperty("transactions")
        private List<Transaction> transactions;

        public SegmentCombination() {}

        // Getters and setters
        public String getBedroom() { return bedroom; }
        public void setBedroom(String bedroom) { this.bedroom = bedroom; }

        public String getLivingArea() { return livingArea; }
        public void setLivingArea(String livingArea) { this.livingArea = livingArea; }

        public String getYearBuilt() { return yearBuilt; }
        public void setYearBuilt(String yearBuilt) { this.yearBuilt = yearBuilt; }

        public String getPropertyType() { return propertyType; }
        public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

        public double getMinPrice() { return minPrice; }
        public void setMinPrice(double minPrice) { this.minPrice = minPrice; }

        public double getAvgPrice() { return avgPrice; }
        public void setAvgPrice(double avgPrice) { this.avgPrice = avgPrice; }

        public double getMaxPrice() { return maxPrice; }
        public void setMaxPrice(double maxPrice) { this.maxPrice = maxPrice; }

        public Integer getMinDaysOnMarket() { return minDaysOnMarket; }
        public void setMinDaysOnMarket(Integer minDaysOnMarket) { this.minDaysOnMarket = minDaysOnMarket; }

        public Integer getAvgDaysOnMarket() { return avgDaysOnMarket; }
        public void setAvgDaysOnMarket(Integer avgDaysOnMarket) { this.avgDaysOnMarket = avgDaysOnMarket; }

        public Integer getMaxDaysOnMarket() { return maxDaysOnMarket; }
        public void setMaxDaysOnMarket(Integer maxDaysOnMarket) { this.maxDaysOnMarket = maxDaysOnMarket; }

        public int getTransactionCount() { return transactionCount; }
        public void setTransactionCount(int transactionCount) { this.transactionCount = transactionCount; }

        public List<Transaction> getTransactions() { return transactions; }
        public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
    }

    public static class Transaction {
        @JsonProperty("address")
        private String address;

        @JsonProperty("price")
        private double price;

        @JsonProperty("bedrooms")
        private int bedrooms;

        @JsonProperty("sqft")
        private int sqft;

        @JsonProperty("trustScoreRange")
        private String trustScoreRange; // e.g., "80-100" instead of exact score

        @JsonProperty("date")
        private String date;

        public Transaction() {}

        // Getters and setters
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }

        public int getBedrooms() { return bedrooms; }
        public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }

        public int getSqft() { return sqft; }
        public void setSqft(int sqft) { this.sqft = sqft; }

        public String getTrustScoreRange() { return trustScoreRange; }
        public void setTrustScoreRange(String trustScoreRange) { this.trustScoreRange = trustScoreRange; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
    }

    public MarketInsightResponse() {}

    public MarketInsightResponse(List<SegmentCombination> combinations, int totalTransactionCount) {
        this.combinations = combinations;
        this.totalTransactionCount = totalTransactionCount;
    }

    public List<SegmentCombination> getCombinations() {
        return combinations;
    }

    public void setCombinations(List<SegmentCombination> combinations) {
        this.combinations = combinations;
    }

    public int getTotalTransactionCount() {
        return totalTransactionCount;
    }

    public void setTotalTransactionCount(int totalTransactionCount) {
        this.totalTransactionCount = totalTransactionCount;
    }
}
