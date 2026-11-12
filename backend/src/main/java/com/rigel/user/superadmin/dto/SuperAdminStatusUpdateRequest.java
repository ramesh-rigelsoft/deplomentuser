package com.rigel.user.superadmin.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SuperAdminStatusUpdateRequest {
    private Object status; // can be Integer (1, 2) or Boolean (true, false) or String ("ACTIVE", "INACTIVE")
    private Boolean active; // alternative boolean flag for plans
    private String reason;

    public Boolean isEffectiveActive() {
        if (active != null) {
            return active;
        }
        if (status instanceof Boolean) {
            return (Boolean) status;
        }
        if (status instanceof Number) {
            return ((Number) status).intValue() == 1;
        }
        if (status instanceof String) {
            String s = ((String) status).trim().toUpperCase();
            return s.equals("1") || s.equals("ACTIVE") || s.equals("TRUE");
        }
        return false;
    }

    public Integer getStatusAsInteger() {
        if (status instanceof Number) {
            return ((Number) status).intValue();
        }
        if (status instanceof Boolean) {
            return (Boolean) status ? 1 : 2;
        }
        if (status instanceof String) {
            String s = ((String) status).trim().toUpperCase();
            return (s.equals("1") || s.equals("ACTIVE") || s.equals("TRUE")) ? 1 : 2;
        }
        if (active != null) {
            return active ? 1 : 2;
        }
        return 1;
    }
}

