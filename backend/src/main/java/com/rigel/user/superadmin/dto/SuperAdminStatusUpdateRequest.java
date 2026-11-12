package com.rigel.user.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminStatusUpdateRequest {
    private Integer status; // 1 for active, 2 for inactive
    private Boolean active; // alternative boolean flag for plans
    private String reason;
}

