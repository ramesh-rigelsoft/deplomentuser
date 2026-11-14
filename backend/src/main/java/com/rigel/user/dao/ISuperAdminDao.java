package com.rigel.user.dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.rigel.user.model.PaymentTransaction;
import com.rigel.user.model.PaymentWebhookEvent;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.SuperAdmin;
import com.rigel.user.model.SuperAdminAuditLog;
import com.rigel.user.model.User;
import com.rigel.user.model.UserSubscription;

public interface ISuperAdminDao {

    SuperAdmin findByUsername(String username);

    SuperAdmin findByEmail(String email);

    SuperAdmin saveSuperAdmin(SuperAdmin admin);

    List<SubscriptionPlan> getAllPlans(String search, Boolean status);

    SubscriptionPlan getPlanById(int id);

    SubscriptionPlan getPlanByCode(String code);

    SubscriptionPlan savePlan(SubscriptionPlan plan);

    void deletePlan(int id);

    List<User> getAllOwners(String search);

    User getOwnerById(int ownerId);

    List<User> getChildUsersByOwnerId(int ownerId);

    long countChildUsers(int ownerId);

    List<UserSubscription> getSubscriptionsByOwnerId(int ownerId);

    List<UserSubscription> getAllSubscriptions(String search, String status, LocalDateTime start, LocalDateTime end);

    Map<String, Object> getSalesMetrics(LocalDateTime start, LocalDateTime end);

    List<Map<String, Object>> getSalesTimeline(String granularity, LocalDateTime start, LocalDateTime end);

    List<Map<String, Object>> getPlanPopularity();

    PaymentTransaction savePaymentTransaction(PaymentTransaction tx);

    PaymentTransaction findPaymentTransactionByOrderId(String orderId);

    PaymentTransaction findPaymentTransactionByPaymentId(String paymentId);

    List<PaymentTransaction> getAllPaymentTransactions(String search, String status, LocalDateTime start, LocalDateTime end);

    PaymentWebhookEvent saveWebhookEvent(PaymentWebhookEvent event);

    PaymentWebhookEvent findWebhookEventById(String eventId);

    SuperAdminAuditLog saveAuditLog(SuperAdminAuditLog log);

    List<SuperAdminAuditLog> getAuditLogs(int limit);

    List<UserSubscription> getQueuedSubscriptionsToActivate(LocalDateTime now);

    List<UserSubscription> getExpiredActiveSubscriptions(LocalDateTime now);
}
