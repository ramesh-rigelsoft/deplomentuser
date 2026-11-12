package com.rigel.user.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminDashboardStatsDto {
    // Admin Cards
    private long totalAdmins;
    private long activeAdmins;
    private long inactiveAdmins;

    // User Cards
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;

    // Subscription Cards
    private long totalSubscriptions;
    private long activeSubscriptions;
    private long expiredSubscriptions;

    // Subscribers split
    private long monthlySubscribers;
    private long yearlySubscribers;

    // Revenue Cards
    private double monthlyRevenue;
    private double yearlyRevenue;
    private double totalRevenue;

    // Charts
    // Monthly subscriptions count trend
    private List<Map<String, Object>> monthlySubscriptionTrend;
    // Yearly subscriptions count trend
    private List<Map<String, Object>> yearlySubscriptionTrend;
    // Revenue by month
    private List<Map<String, Object>> monthlyRevenueTrend;
    // Plan-wise subscriber breakdown (e.g. Basic: 120, Pro: 85, ...)
    private List<Map<String, Object>> planWiseSubscribers;
}

