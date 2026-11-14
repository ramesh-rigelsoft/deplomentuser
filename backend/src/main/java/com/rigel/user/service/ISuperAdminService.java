package com.rigel.user.service;

import java.util.List;
import java.util.Map;

import com.rigel.user.model.PaymentTransaction;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.SuperAdminAuditLog;

import jakarta.servlet.http.HttpServletRequest;

public interface ISuperAdminService {

    Map<String, Object> login(String username, String password, HttpServletRequest request);

    Map<String, Object> getProfile(String username);

    Map<String, Object> getDashboardStats(String filterType, String startDate, String endDate);

    List<SubscriptionPlan> getAllPlans(String search, Boolean status);

    SubscriptionPlan getPlanById(int id);

    SubscriptionPlan createPlan(SubscriptionPlan plan, String adminUsername);

    SubscriptionPlan updatePlan(int id, SubscriptionPlan plan, String adminUsername);

    boolean togglePlanStatus(int id, boolean status, String adminUsername);

    Map<String, Object> getSalesReport(String filterType, String startDateStr, String endDateStr, String search);

    List<Map<String, Object>> getOwnersList(String search);

    Map<String, Object> getOwnerDetail(int ownerId);

    List<Map<String, Object>> getAllSubscriptions(String search, String status, String filterType, String startDate, String endDate);

    List<PaymentTransaction> getAllPayments(String search, String status, String startDate, String endDate);

    List<SuperAdminAuditLog> getAuditLogs(int limit);

    void processSubscriptionLifecycle();

    Map<String, Object> processRazorpayWebhook(String payload, String signature);
}
