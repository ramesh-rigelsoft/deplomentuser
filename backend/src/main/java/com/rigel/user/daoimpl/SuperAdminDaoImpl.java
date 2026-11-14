package com.rigel.user.daoimpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.ISuperAdminDao;
import com.rigel.user.model.PaymentTransaction;
import com.rigel.user.model.PaymentWebhookEvent;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.SuperAdmin;
import com.rigel.user.model.SuperAdminAuditLog;
import com.rigel.user.model.User;
import com.rigel.user.model.UserSubscription;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class SuperAdminDaoImpl implements ISuperAdminDao {

    @Autowired
    private EntityManager entityManager;

    @Override
    public SuperAdmin findByUsername(String username) {
        try {
            return entityManager.createQuery(
                    "SELECT sa FROM SuperAdmin sa WHERE sa.username = :username", SuperAdmin.class)
                    .setParameter("username", username)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public SuperAdmin findByEmail(String email) {
        try {
            return entityManager.createQuery(
                    "SELECT sa FROM SuperAdmin sa WHERE sa.email = :email", SuperAdmin.class)
                    .setParameter("email", email)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public SuperAdmin saveSuperAdmin(SuperAdmin admin) {
        if (admin.getId() > 0) {
            return entityManager.merge(admin);
        } else {
            entityManager.persist(admin);
            return admin;
        }
    }

    @Override
    public List<SubscriptionPlan> getAllPlans(String search, Boolean status) {
        StringBuilder jpql = new StringBuilder("SELECT p FROM SubscriptionPlan p WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (status != null) {
            jpql.append("AND p.status = :status ");
            params.put("status", status);
        }

        if (search != null && !search.trim().isEmpty()) {
            jpql.append("AND (LOWER(p.subscriptionName) LIKE :search OR LOWER(p.subscriptionCode) LIKE :search) ");
            params.put("search", "%" + search.trim().toLowerCase() + "%");
        }

        jpql.append("ORDER BY p.id DESC");
        TypedQuery<SubscriptionPlan> query = entityManager.createQuery(jpql.toString(), SubscriptionPlan.class);
        params.forEach(query::setParameter);
        return query.getResultList();
    }

    @Override
    public SubscriptionPlan getPlanById(int id) {
        return entityManager.find(SubscriptionPlan.class, id);
    }

    @Override
    public SubscriptionPlan getPlanByCode(String code) {
        try {
            return entityManager.createQuery(
                    "SELECT p FROM SubscriptionPlan p WHERE LOWER(p.subscriptionCode) = LOWER(:code)", SubscriptionPlan.class)
                    .setParameter("code", code.trim())
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public SubscriptionPlan savePlan(SubscriptionPlan plan) {
        if (plan.getId() > 0) {
            return entityManager.merge(plan);
        } else {
            entityManager.persist(plan);
            return plan;
        }
    }

    @Override
    public void deletePlan(int id) {
        SubscriptionPlan plan = entityManager.find(SubscriptionPlan.class, id);
        if (plan != null) {
            entityManager.remove(plan);
        }
    }

    @Override
    public List<User> getAllOwners(String search) {
        StringBuilder jpql = new StringBuilder("SELECT u FROM User u WHERE (LOWER(u.role) = 'admin' OR u.ownerId = u.id) ");
        Map<String, Object> params = new HashMap<>();

        if (search != null && !search.trim().isEmpty()) {
            jpql.append("AND (LOWER(u.name) LIKE :search OR LOWER(u.email_id) LIKE :search OR u.mobile_no LIKE :search OR LOWER(u.softwareKey) LIKE :search) ");
            params.put("search", "%" + search.trim().toLowerCase() + "%");
        }

        jpql.append("ORDER BY u.id DESC");
        TypedQuery<User> query = entityManager.createQuery(jpql.toString(), User.class);
        params.forEach(query::setParameter);
        return query.getResultList();
    }

    @Override
    public User getOwnerById(int ownerId) {
        return entityManager.find(User.class, ownerId);
    }

    @Override
    public List<User> getChildUsersByOwnerId(int ownerId) {
        return entityManager.createQuery(
                "SELECT u FROM User u WHERE u.ownerId = :ownerId AND u.id != :ownerId AND LOWER(u.role) <> 'admin' ORDER BY u.id DESC", User.class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    @Override
    public long countChildUsers(int ownerId) {
        try {
            return entityManager.createQuery(
                    "SELECT COUNT(u) FROM User u WHERE u.ownerId = :ownerId AND u.id != :ownerId AND LOWER(u.role) <> 'admin'", Long.class)
                    .setParameter("ownerId", ownerId)
                    .getSingleResult();
        } catch (Exception e) {
            return 0L;
        }
    }

    @Override
    public List<UserSubscription> getSubscriptionsByOwnerId(int ownerId) {
        return entityManager.createQuery(
                "SELECT us FROM UserSubscription us WHERE us.ownerId = :ownerId ORDER BY us.createdAt DESC", UserSubscription.class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    @Override
    public List<UserSubscription> getAllSubscriptions(String search, String status, LocalDateTime start, LocalDateTime end) {
        StringBuilder jpql = new StringBuilder("SELECT us FROM UserSubscription us WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (status != null && !status.trim().isEmpty()) {
            if ("ACTIVE".equalsIgnoreCase(status)) {
                jpql.append("AND us.status = true AND us.active = true ");
            } else if ("QUEUED".equalsIgnoreCase(status)) {
                jpql.append("AND us.isQueued = true ");
            } else if ("EXPIRED".equalsIgnoreCase(status)) {
                jpql.append("AND (us.status = false OR us.active = false) ");
            }
        }

        if (start != null) {
            jpql.append("AND us.createdAt >= :start ");
            params.put("start", start);
        }

        if (end != null) {
            jpql.append("AND us.createdAt <= :end ");
            params.put("end", end);
        }

        if (search != null && !search.trim().isEmpty()) {
            jpql.append("AND (LOWER(us.subscriptionName) LIKE :search OR LOWER(us.subscriptionCode) LIKE :search OR us.branchCode LIKE :search) ");
            params.put("search", "%" + search.trim().toLowerCase() + "%");
        }

        jpql.append("ORDER BY us.createdAt DESC");
        TypedQuery<UserSubscription> query = entityManager.createQuery(jpql.toString(), UserSubscription.class);
        params.forEach(query::setParameter);
        return query.getResultList();
    }

    @Override
    public Map<String, Object> getSalesMetrics(LocalDateTime start, LocalDateTime end) {
        Map<String, Object> metrics = new HashMap<>();

        StringBuilder jpql = new StringBuilder("SELECT COUNT(us), COALESCE(SUM(us.totalAmount), 0.0) FROM UserSubscription us WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (start != null) {
            jpql.append("AND us.createdAt >= :start ");
            params.put("start", start);
        }
        if (end != null) {
            jpql.append("AND us.createdAt <= :end ");
            params.put("end", end);
        }

        TypedQuery<Object[]> query = entityManager.createQuery(jpql.toString(), Object[].class);
        params.forEach(query::setParameter);

        try {
            Object[] result = query.getSingleResult();
            long count = ((Number) result[0]).longValue();
            double revenue = ((Number) result[1]).doubleValue();
            metrics.put("totalSalesCount", count);
            metrics.put("totalRevenue", revenue);
        } catch (Exception e) {
            metrics.put("totalSalesCount", 0L);
            metrics.put("totalRevenue", 0.0);
        }

        return metrics;
    }

    @Override
    public List<Map<String, Object>> getSalesTimeline(String granularity, LocalDateTime start, LocalDateTime end) {
        List<Map<String, Object>> timeline = new ArrayList<>();
        List<UserSubscription> list = getAllSubscriptions(null, null, start, end);

        Map<String, double[]> grouped = new HashMap<>(); // [count, revenue]

        for (UserSubscription sub : list) {
            if (sub.getCreatedAt() == null) continue;
            String key;
            LocalDateTime dt = sub.getCreatedAt();
            if ("yearly".equalsIgnoreCase(granularity)) {
                key = String.valueOf(dt.getYear());
            } else if ("monthly".equalsIgnoreCase(granularity)) {
                key = dt.getYear() + "-" + String.format("%02d", dt.getMonthValue());
            } else { // daily
                key = dt.toLocalDate().toString();
            }

            double[] val = grouped.computeIfAbsent(key, k -> new double[]{0, 0});
            val[0] += 1;
            val[1] += sub.getTotalAmount();
        }

        grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("label", entry.getKey());
                    item.put("count", (long) entry.getValue()[0]);
                    item.put("revenue", entry.getValue()[1]);
                    timeline.add(item);
                });

        return timeline;
    }

    @Override
    public List<Map<String, Object>> getPlanPopularity() {
        List<Map<String, Object>> popularity = new ArrayList<>();
        String jpql = "SELECT us.subscriptionName, COUNT(us), COALESCE(SUM(us.totalAmount), 0.0) FROM UserSubscription us GROUP BY us.subscriptionName";
        List<Object[]> rows = entityManager.createQuery(jpql, Object[].class).getResultList();

        for (Object[] row : rows) {
            Map<String, Object> item = new HashMap<>();
            item.put("planName", row[0] != null ? row[0] : "Standard");
            item.put("count", ((Number) row[1]).longValue());
            item.put("revenue", ((Number) row[2]).doubleValue());
            popularity.add(item);
        }

        return popularity;
    }

    @Override
    public PaymentTransaction savePaymentTransaction(PaymentTransaction tx) {
        tx.setUpdatedAt(LocalDateTime.now());
        if (tx.getCreatedAt() == null) {
            tx.setCreatedAt(LocalDateTime.now());
        }
        if (tx.getId() > 0) {
            return entityManager.merge(tx);
        } else {
            entityManager.persist(tx);
            return tx;
        }
    }

    @Override
    public PaymentTransaction findPaymentTransactionByOrderId(String orderId) {
        try {
            return entityManager.createQuery(
                    "SELECT pt FROM PaymentTransaction pt WHERE pt.orderId = :orderId", PaymentTransaction.class)
                    .setParameter("orderId", orderId)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public PaymentTransaction findPaymentTransactionByPaymentId(String paymentId) {
        try {
            return entityManager.createQuery(
                    "SELECT pt FROM PaymentTransaction pt WHERE pt.paymentId = :paymentId", PaymentTransaction.class)
                    .setParameter("paymentId", paymentId)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public List<PaymentTransaction> getAllPaymentTransactions(String search, String status, LocalDateTime start, LocalDateTime end) {
        StringBuilder jpql = new StringBuilder("SELECT pt FROM PaymentTransaction pt WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (status != null && !status.trim().isEmpty()) {
            jpql.append("AND pt.status = :status ");
            params.put("status", status.trim().toUpperCase());
        }

        if (start != null) {
            jpql.append("AND pt.createdAt >= :start ");
            params.put("start", start);
        }

        if (end != null) {
            jpql.append("AND pt.createdAt <= :end ");
            params.put("end", end);
        }

        if (search != null && !search.trim().isEmpty()) {
            jpql.append("AND (pt.orderId LIKE :search OR pt.paymentId LIKE :search OR pt.subscriptionCode LIKE :search) ");
            params.put("search", "%" + search.trim() + "%");
        }

        jpql.append("ORDER BY pt.createdAt DESC");
        TypedQuery<PaymentTransaction> query = entityManager.createQuery(jpql.toString(), PaymentTransaction.class);
        params.forEach(query::setParameter);
        return query.getResultList();
    }

    @Override
    public PaymentWebhookEvent saveWebhookEvent(PaymentWebhookEvent event) {
        if (event.getCreatedAt() == null) {
            event.setCreatedAt(LocalDateTime.now());
        }
        if (event.getId() > 0) {
            return entityManager.merge(event);
        } else {
            entityManager.persist(event);
            return event;
        }
    }

    @Override
    public PaymentWebhookEvent findWebhookEventById(String eventId) {
        try {
            return entityManager.createQuery(
                    "SELECT we FROM PaymentWebhookEvent we WHERE we.eventId = :eventId", PaymentWebhookEvent.class)
                    .setParameter("eventId", eventId)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public SuperAdminAuditLog saveAuditLog(SuperAdminAuditLog log) {
        if (log.getCreatedAt() == null) {
            log.setCreatedAt(LocalDateTime.now());
        }
        entityManager.persist(log);
        return log;
    }

    @Override
    public List<SuperAdminAuditLog> getAuditLogs(int limit) {
        return entityManager.createQuery(
                "SELECT al FROM SuperAdminAuditLog al ORDER BY al.createdAt DESC", SuperAdminAuditLog.class)
                .setMaxResults(limit > 0 ? limit : 50)
                .getResultList();
    }

    @Override
    public List<UserSubscription> getQueuedSubscriptionsToActivate(LocalDateTime now) {
        return entityManager.createQuery(
                "SELECT us FROM UserSubscription us WHERE us.isQueued = true AND us.status = true AND us.subscriptionStartAt <= :now",
                UserSubscription.class)
                .setParameter("now", now)
                .getResultList();
    }

    @Override
    public List<UserSubscription> getExpiredActiveSubscriptions(LocalDateTime now) {
        return entityManager.createQuery(
                "SELECT us FROM UserSubscription us WHERE us.active = true AND us.subscriptionEndAt IS NOT NULL AND us.subscriptionEndAt <= :now",
                UserSubscription.class)
                .setParameter("now", now)
                .getResultList();
    }
}
