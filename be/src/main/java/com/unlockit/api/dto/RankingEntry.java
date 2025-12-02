package com.unlockit.api.dto;

/**
 * Public ranking entry - only contains non-sensitive information
 */
public class RankingEntry {
    private String name;
    private int reputation;
    private int reputationCap;
    private String role;

    public RankingEntry() {
    }

    public RankingEntry(String name, int reputation, int reputationCap, String role) {
        this.name = name;
        this.reputation = reputation;
        this.reputationCap = reputationCap;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getReputation() {
        return reputation;
    }

    public void setReputation(int reputation) {
        this.reputation = reputation;
    }

    public int getReputationCap() {
        return reputationCap;
    }

    public void setReputationCap(int reputationCap) {
        this.reputationCap = reputationCap;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
