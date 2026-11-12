package com.rigel.user.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminAdminDto {
    private Integer id;
    private String name;
    private String email_id;
    private String mobile_no;
    private String country_code;
    private Integer status; // 1 = ACTIVE, 2 = INACTIVE, 3 = DELETED
    private Timestamp created_at;

    // Subscription details
    private String subscriptionPlan;
    private String subscriptionCode;
    private String subscriptionType; // MONTHLY, YEARLY
    private String subscriptionStatus; // ACTIVE, EXPIRED, NONE
    private LocalDateTime subscriptionStartAt;
    private LocalDateTime subscriptionEndAt;
    private Double subscriptionAmount;

    // Users under this Admin
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
}

