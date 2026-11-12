package com.rigel.user.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminUserDto {
    private Integer id;
    private String name;
    private String email_id;
    private String mobile_no;
    private Integer status; // 1 = ACTIVE, 2 = INACTIVE, 3 = DELETED
    private String role;
    private String disabledReason;
    private Timestamp created_at;

    // Admin info
    private Integer ownerId;
    private String adminName;
    private String adminEmail;
    private Integer adminStatus; // 1 = ACTIVE, 2 = INACTIVE
}

