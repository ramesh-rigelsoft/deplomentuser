package com.rigel.user.superadmin.service;

import com.rigel.user.model.UserSubscription;
import com.rigel.user.superadmin.dto.*;
import com.rigel.user.superadmin.model.SuperAdminAuditLog;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ISuperAdminService {

    Map<String, Object> login(SuperAdminLoginRequest loginRequest, HttpServletRequest request);

    SuperAdminDashboardStatsDto getDashboardStats(String filter, LocalDate fromDate, LocalDate toDate);

    List<SuperAdminPlanDto> getAllPlans();

    SuperAdminPlanDto getPlanById(int id);

    SuperAdminPlanDto createPlan(SuperAdminPlanDto planDto, HttpServletRequest request);

    SuperAdminPlanDto updatePlan(int id, SuperAdminPlanDto planDto, HttpServletRequest request);

    SuperAdminPlanDto togglePlanStatus(int id, boolean status, HttpServletRequest request);

    SuperAdminPageResponse<SuperAdminAdminDto> getAdmins(
            String search,
            String status,
            String planCode,
            String billingType,
            String subStatus,
            int page,
            int size
    );

    Map<String, Object> getAdminById(int id);

    SuperAdminAdminDto toggleAdminStatus(int id, int status, String reason, HttpServletRequest request);

    SuperAdminPageResponse<SuperAdminUserDto> getUsers(
            String search,
            Integer status,
            Integer adminId,
            int page,
            int size
    );

    SuperAdminPageResponse<SuperAdminSubscriptionDto> getSubscriptions(
            String search,
            String billingType,
            String subStatus,
            String payStatus,
            LocalDate fromDate,
            LocalDate toDate,
            int page,
            int size
    );

    Map<String, Object> getSubscriptionReport(LocalDate fromDate, LocalDate toDate);

    SuperAdminPageResponse<SuperAdminAuditLog> getAuditLogs(int page, int size);
}

