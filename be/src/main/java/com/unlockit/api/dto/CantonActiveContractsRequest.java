package com.unlockit.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class CantonActiveContractsRequest {

    @JsonProperty("filter")
    private FilterConfig filter;

    @JsonProperty("verbose")
    private boolean verbose = false;

    @JsonProperty("activeAtOffset")
    private String activeAtOffset = "0";

    public static class FilterConfig {
        @JsonProperty("filtersByParty")
        private Map<String, PartyFilter> filtersByParty;

        public static class PartyFilter {
            @JsonProperty("cumulative")
            private java.util.List<TemplateFilterWrapper> cumulative;

            public static class TemplateFilterWrapper {
                @JsonProperty("identifierFilter")
                private IdentifierFilter identifierFilter;

                public static class IdentifierFilter {
                    @JsonProperty("TemplateFilter")
                    private TemplateFilter templateFilter;

                    public static class TemplateFilter {
                        @JsonProperty("value")
                        private TemplateFilterValue value;

                        public static class TemplateFilterValue {
                            @JsonProperty("templateId")
                            private String templateId;

                            @JsonProperty("includeCreatedEventBlob")
                            private boolean includeCreatedEventBlob = true;

                            public TemplateFilterValue() {}

                            public TemplateFilterValue(String templateId, boolean includeCreatedEventBlob) {
                                this.templateId = templateId;
                                this.includeCreatedEventBlob = includeCreatedEventBlob;
                            }

                            public String getTemplateId() {
                                return templateId;
                            }

                            public void setTemplateId(String templateId) {
                                this.templateId = templateId;
                            }

                            public boolean isIncludeCreatedEventBlob() {
                                return includeCreatedEventBlob;
                            }

                            public void setIncludeCreatedEventBlob(boolean includeCreatedEventBlob) {
                                this.includeCreatedEventBlob = includeCreatedEventBlob;
                            }
                        }

                        public TemplateFilter() {}

                        public TemplateFilter(TemplateFilterValue value) {
                            this.value = value;
                        }

                        public TemplateFilterValue getValue() {
                            return value;
                        }

                        public void setValue(TemplateFilterValue value) {
                            this.value = value;
                        }
                    }

                    public IdentifierFilter() {}

                    public IdentifierFilter(TemplateFilter templateFilter) {
                        this.templateFilter = templateFilter;
                    }

                    public TemplateFilter getTemplateFilter() {
                        return templateFilter;
                    }

                    public void setTemplateFilter(TemplateFilter templateFilter) {
                        this.templateFilter = templateFilter;
                    }
                }

                public TemplateFilterWrapper() {}

                public TemplateFilterWrapper(IdentifierFilter identifierFilter) {
                    this.identifierFilter = identifierFilter;
                }

                public IdentifierFilter getIdentifierFilter() {
                    return identifierFilter;
                }

                public void setIdentifierFilter(IdentifierFilter identifierFilter) {
                    this.identifierFilter = identifierFilter;
                }
            }

            public PartyFilter() {}

            public PartyFilter(java.util.List<TemplateFilterWrapper> cumulative) {
                this.cumulative = cumulative;
            }

            public java.util.List<TemplateFilterWrapper> getCumulative() {
                return cumulative;
            }

            public void setCumulative(java.util.List<TemplateFilterWrapper> cumulative) {
                this.cumulative = cumulative;
            }
        }

        public FilterConfig() {}

        public FilterConfig(Map<String, PartyFilter> filtersByParty) {
            this.filtersByParty = filtersByParty;
        }

        public Map<String, PartyFilter> getFiltersByParty() {
            return filtersByParty;
        }

        public void setFiltersByParty(Map<String, PartyFilter> filtersByParty) {
            this.filtersByParty = filtersByParty;
        }
    }

    public CantonActiveContractsRequest() {}

    public CantonActiveContractsRequest(FilterConfig filter, boolean verbose, String activeAtOffset) {
        this.filter = filter;
        this.verbose = verbose;
        this.activeAtOffset = activeAtOffset;
    }

    public FilterConfig getFilter() {
        return filter;
    }

    public void setFilter(FilterConfig filter) {
        this.filter = filter;
    }

    public boolean isVerbose() {
        return verbose;
    }

    public void setVerbose(boolean verbose) {
        this.verbose = verbose;
    }

    public String getActiveAtOffset() {
        return activeAtOffset;
    }

    public void setActiveAtOffset(String activeAtOffset) {
        this.activeAtOffset = activeAtOffset;
    }
}
