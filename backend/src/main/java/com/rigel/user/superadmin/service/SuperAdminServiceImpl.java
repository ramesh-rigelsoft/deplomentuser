package com.rigel.user.superadmin.service;

import com.rigel.user.dao.ISubscriptionPlanDao;
import com.rigel.user.dao.IUserDao;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.User;
import com.rigel.user.model.UserSubscription;
import com.rigel.user.model.UserSubscriptionLog;
import com.rigel.user.security.JwtTokenUtil;
import com.rigel.user.security.JwtUser;
import com.rigel.user.superadmin.dto.*;
import com.rigel.user.superadmin.model.SuperAdminAuditLog;
import com.rigel.user.superadmin.repository.SuperAdminAuditLogRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class SuperAdminServiceImpl implements ISuperAdminService {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private IUserDao userDao;

    @Autowired
    private ISubscriptionPlanDao subscriptionPlanDao;

    @Autowired
    private SuperAdminAuditLogRepository auditLogRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private final PasswordEncoder passwordEncoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();

    @Override
    public Map<String, Object> login(SuperAdminLoginRequest loginRequest, HttpServletRequest request) {
        if (loginRequest == null || loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            throw new IllegalArgumentException("Username and password are required.");
        }

        String username = loginRequest.getUsername().trim();
        String password = loginRequest.getPassword().trim();
        List<User> users = entityManager.createQuery(
                "SELECT u FROM User u WHERE (LOWER(u.email_id) = :identifier OR LOWER(u.name) = :identifier) AND UPPER(u.role) = 'SUPER_ADMIN'",
                User.class
        ).setParameter("identifier", username.toLowerCase()).getResultList();

        if (users.isEmpty()) {
            throw new IllegalArgumentException("Invalid Super Admin credentials.");
        }

        User superAdmin = users.get(0);
        if (superAdmin.getStatus() != 1) {
            throw new IllegalStateException("Super Admin account is inactive.");
        }

        boolean passwordMatches = passwordEncoder.matches(password, superAdmin.getPassword())
                || password.equals(superAdmin.getPassword())
                || User.PASSWORD_ENCODER.matches(password, superAdmin.getPassword());

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid Super Admin credentials.");
        }

        List<SimpleGrantedAuthority> authorities = Arrays.asList(
                new SimpleGrantedAuthority("SUPER_ADMIN"),
                new SimpleGrantedAuthority("ROLE_SUPER_ADMIN")
        );

        JwtUser jwtUser = new JwtUser(
                superAdmin.getId(),
                superAdmin.getEmail_id() != null ? superAdmin.getEmail_id() : superAdmin.getName(),
                superAdmin.getPassword(),
                authorities,
                superAdmin.getStatus(),
                superAdmin.getLastPasswordResetDate()
        );

        String token = jwtTokenUtil.generateToken(jwtUser, request);

        // Record audit
        logAudit(superAdmin.getId(), superAdmin.getEmail_id(), "SUPER_ADMIN_LOGIN", "SUPER_ADMIN",
                String.valueOf(superAdmin.getId()), null, "SUCCESS", "Super Admin logged in", getClientIp(request));

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", "SUPER_ADMIN");
        response.put("id", superAdmin.getId());
        response.put("name", superAdmin.getName());
        response.put("email", superAdmin.getEmail_id());
        return response;
    }

    @Override
    public SuperAdminDashboardStatsDto getDashboardStats(String filter, LocalDate fromDate, LocalDate toDate) {
        // Date range calculation
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = LocalDateTime.now();

        if (filter != null) {
            LocalDate today = LocalDate.now();
            switch (filter.toUpperCase()) {
                case "TODAY":
                    startDateTime = today.atStartOfDay();
                    break;
                case "THIS_WEEK":
                    startDateTime = today.minusDays(today.getDayOfWeek().getValue() - 1).atStartOfDay();
                    break;
                case "THIS_MONTH":
                    startDateTime = today.withDayOfMonth(1).atStartOfDay();
                    break;
                case "THIS_YEAR":
                    startDateTime = today.withDayOfYear(1).atStartOfDay();
                    break;
                case "CUSTOM":
                    if (fromDate != null) {
                        startDateTime = fromDate.atStartOfDay();
                    }
                    if (toDate != null) {
                        endDateTime = toDate.atTime(LocalTime.MAX);
                    }
                    break;
                default:
                    break;
            }
        }

        // 1. Admins count (role='admin' or '1' or 'ADMIN')
        long totalAdmins = ((Number) entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.role IN ('admin', '1', 'ADMIN') AND u.role <> 'SUPER_ADMIN'"
        ).getSingleResult()).longValue();

        long activeAdmins = ((Number) entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.role IN ('admin', '1', 'ADMIN') AND u.status = 1 AND u.role <> 'SUPER_ADMIN'"
        ).getSingleResult()).longValue();

        long inactiveAdmins = ((Number) entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.role IN ('admin', '1', 'ADMIN') AND u.status <> 1 AND u.role <> 'SUPER_ADMIN'"
        ).getSingleResult()).longValue();

        // 2. Users count (role != admin/SUPER_ADMIN or ownerId != id)
        long totalUsers = ((Number) entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.role NOT IN ('admin', '1', 'ADMIN', 'SUPER_ADMIN')"
        ).getSingleResult()).longValue();

        long activeUsers = ((Number) entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.role NOT IN ('admin', '1', 'ADMIN', 'SUPER_ADMIN') AND u.status = 1"
        ).getSingleResult()).longValue();

        long inactiveUsers = ((Number) entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.role NOT IN ('admin', '1', 'ADMIN', 'SUPER_ADMIN') AND u.status <> 1"
        ).getSingleResult()).longValue();

        // 3. Subscriptions (from user_subscription)
        long totalSubscriptions = ((Number) entityManager.createQuery(
                "SELECT COUNT(us) FROM UserSubscription us"
        ).getSingleResult()).longValue();

        long activeSubscriptions = ((Number) entityManager.createQuery(
                "SELECT COUNT(us) FROM UserSubscription us WHERE us.status = true AND us.active = true"
        ).getSingleResult()).longValue();

        long expiredSubscriptions = Math.max(0, totalSubscriptions - activeSubscriptions);

        // Subscribers split (active subscriptions by type)
        long monthlySubscribers = ((Number) entityManager.createQuery(
                "SELECT COUNT(us) FROM UserSubscription us WHERE us.status = true AND UPPER(COALESCE(us.subscriptionType, '')) LIKE '%MONTH%'"
        ).getSingleResult()).longValue();

        long yearlySubscribers = ((Number) entityManager.createQuery(
                "SELECT COUNT(us) FROM UserSubscription us WHERE us.status = true AND UPPER(COALESCE(us.subscriptionType, '')) LIKE '%YEAR%'"
        ).getSingleResult()).longValue();

        // 4. Revenues
        LocalDate firstOfThisMonth = LocalDate.now().withDayOfMonth(1);
        LocalDateTime firstOfThisMonthDt = firstOfThisMonth.atStartOfDay();
        LocalDate firstOfThisYear = LocalDate.now().withDayOfYear(1);
        LocalDateTime firstOfThisYearDt = firstOfThisYear.atStartOfDay();

        Double monthlyRevObj = (Double) entityManager.createQuery(
                "SELECT SUM(us.totalAmount) FROM UserSubscription us WHERE us.createdAt >= :startDate"
        ).setParameter("startDate", firstOfThisMonthDt).getSingleResult();
        double monthlyRevenue = monthlyRevObj != null ? monthlyRevObj : 0.0;

        Double yearlyRevObj = (Double) entityManager.createQuery(
                "SELECT SUM(us.totalAmount) FROM UserSubscription us WHERE us.createdAt >= :startDate"
        ).setParameter("startDate", firstOfThisYearDt).getSingleResult();
        double yearlyRevenue = yearlyRevObj != null ? yearlyRevObj : 0.0;

        Double totalRevObj = (Double) entityManager.createQuery(
                "SELECT SUM(us.totalAmount) FROM UserSubscription us"
        ).getSingleResult();
        double totalRevenue = totalRevObj != null ? totalRevObj : 0.0;

        // 5. Monthly Subscriptions count trend (last 6-12 months)
        List<Map<String, Object>> monthlySubscriptionTrend = new ArrayList<>();
        List<Map<String, Object>> monthlyRevenueTrend = new ArrayList<>();

        for (int i = 11; i >= 0; i--) {
            LocalDate m = LocalDate.now().minusMonths(i);
            LocalDateTime mStart = m.withDayOfMonth(1).atStartOfDay();
            LocalDateTime mEnd = m.withDayOfMonth(m.lengthOfMonth()).atTime(LocalTime.MAX);
            String monthName = m.getMonth().name().substring(0, 3) + " " + m.getYear();

            long count = ((Number) entityManager.createQuery(
                    "SELECT COUNT(us) FROM UserSubscription us WHERE us.createdAt BETWEEN :mStart AND :mEnd"
            ).setParameter("mStart", mStart).setParameter("mEnd", mEnd).getSingleResult()).longValue();

            Double rev = (Double) entityManager.createQuery(
                    "SELECT SUM(us.totalAmount) FROM UserSubscription us WHERE us.createdAt BETWEEN :mStart AND :mEnd"
            ).setParameter("mStart", mStart).setParameter("mEnd", mEnd).getSingleResult();

            Map<String, Object> subPoint = new HashMap<>();
            subPoint.put("month", monthName);
            subPoint.put("count", count);
            monthlySubscriptionTrend.add(subPoint);

            Map<String, Object> revPoint = new HashMap<>();
            revPoint.put("month", monthName);
            revPoint.put("revenue", rev != null ? rev : 0.0);
            monthlyRevenueTrend.add(revPoint);
        }

        // 6. Yearly Subscriptions Trend (last 5 years)
        List<Map<String, Object>> yearlySubscriptionTrend = new ArrayList<>();
        int currentYear = LocalDate.now().getYear();
        for (int yr = currentYear - 4; yr <= currentYear; yr++) {
            LocalDateTime yStart = LocalDate.of(yr, 1, 1).atStartOfDay();
            LocalDateTime yEnd = LocalDate.of(yr, 12, 31).atTime(LocalTime.MAX);

            long count = ((Number) entityManager.createQuery(
                    "SELECT COUNT(us) FROM UserSubscription us WHERE us.createdAt BETWEEN :yStart AND :yEnd"
            ).setParameter("yStart", yStart).setParameter("yEnd", yEnd).getSingleResult()).longValue();

            Map<String, Object> yrPoint = new HashMap<>();
            yrPoint.put("year", String.valueOf(yr));
            yrPoint.put("count", count);
            yearlySubscriptionTrend.add(yrPoint);
        }

        // 7. Plan-wise subscribers
        @SuppressWarnings("unchecked")
        List<Object[]> planGroups = entityManager.createQuery(
                "SELECT COALESCE(us.subscriptionName, 'Unknown'), COUNT(us) FROM UserSubscription us WHERE us.status = true GROUP BY us.subscriptionName"
        ).getResultList();

        List<Map<String, Object>> planWiseSubscribers = new ArrayList<>();
        for (Object[] row : planGroups) {
            Map<String, Object> map = new HashMap<>();
            map.put("planName", row[0]);
            map.put("count", ((Number) row[1]).longValue());
            planWiseSubscribers.add(map);
        }

        return SuperAdminDashboardStatsDto.builder()
                .totalAdmins(totalAdmins)
                .activeAdmins(activeAdmins)
                .inactiveAdmins(inactiveAdmins)
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .totalSubscriptions(totalSubscriptions)
                .activeSubscriptions(activeSubscriptions)
                .expiredSubscriptions(expiredSubscriptions)
                .monthlySubscribers(monthlySubscribers)
                .yearlySubscribers(yearlySubscribers)
                .monthlyRevenue(monthlyRevenue)
                .yearlyRevenue(yearlyRevenue)
                .totalRevenue(totalRevenue)
                .monthlySubscriptionTrend(monthlySubscriptionTrend)
                .yearlySubscriptionTrend(yearlySubscriptionTrend)
                .monthlyRevenueTrend(monthlyRevenueTrend)
                .planWiseSubscribers(planWiseSubscribers)
                .build();
    }

    @Override
    public List<SuperAdminPlanDto> getAllPlans() {
        List<SubscriptionPlan> plans = entityManager.createQuery(
                "SELECT s FROM SubscriptionPlan s ORDER BY s.id ASC",
                SubscriptionPlan.class
        ).getResultList();

        return plans.stream().map(this::toPlanDto).collect(Collectors.toList());
    }

    @Override
    public SuperAdminPlanDto getPlanById(int id) {
        SubscriptionPlan plan = entityManager.find(SubscriptionPlan.class, id);
        if (plan == null) {
            throw new IllegalArgumentException("Plan not found with id: " + id);
        }
        return toPlanDto(plan);
    }

    @Override
    public SuperAdminPlanDto createPlan(SuperAdminPlanDto dto, HttpServletRequest request) {
        if (dto == null || dto.getSubscriptionName() == null || dto.getSubscriptionName().trim().isEmpty()) {
            throw new IllegalArgumentException("Plan name is mandatory.");
        }

        SubscriptionPlan plan = new SubscriptionPlan();
        applyDtoToPlan(dto, plan);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());
        if (plan.getSubscriptionCode() == null || plan.getSubscriptionCode().trim().isEmpty()) {
            plan.setSubscriptionCode("PLAN_" + System.currentTimeMillis());
        }

        SubscriptionPlan saved = entityManager.merge(plan);

        logAudit(null, null, "CREATE_PLAN", "PLAN", String.valueOf(saved.getId()), null,
                saved.getSubscriptionName(), "Created plan: " + saved.getSubscriptionName(), getClientIp(request));

        return toPlanDto(saved);
    }

    @Override
    public SuperAdminPlanDto updatePlan(int id, SuperAdminPlanDto dto, HttpServletRequest request) {
        SubscriptionPlan existing = entityManager.find(SubscriptionPlan.class, id);
        if (existing == null) {
            throw new IllegalArgumentException("Plan not found with id: " + id);
        }

        String oldValue = "Name: " + existing.getSubscriptionName() + ", Price: " + existing.getTotalAmount()
                + ", Billing: " + existing.getSubscriptionType() + ", Users: " + existing.getUserCount();

        applyDtoToPlan(dto, existing);
        existing.setUpdatedAt(LocalDateTime.now());

        SubscriptionPlan updated = entityManager.merge(existing);

        String newValue = "Name: " + updated.getSubscriptionName() + ", Price: " + updated.getTotalAmount()
                + ", Billing: " + updated.getSubscriptionType() + ", Users: " + updated.getUserCount();

        logAudit(null, null, "UPDATE_PLAN", "PLAN", String.valueOf(updated.getId()), oldValue,
                newValue, "Updated plan " + updated.getId(), getClientIp(request));

        return toPlanDto(updated);
    }

    @Override
    public SuperAdminPlanDto togglePlanStatus(int id, boolean status, HttpServletRequest request) {
        SubscriptionPlan existing = entityManager.find(SubscriptionPlan.class, id);
        if (existing == null) {
            throw new IllegalArgumentException("Plan not found with id: " + id);
        }

        boolean oldStatus = existing.isStatus();
        existing.setStatus(status);
        existing.setUpdatedAt(LocalDateTime.now());
        SubscriptionPlan updated = entityManager.merge(existing);

        logAudit(null, null, status ? "ACTIVATE_PLAN" : "DEACTIVATE_PLAN", "PLAN",
                String.valueOf(updated.getId()), String.valueOf(oldStatus), String.valueOf(status),
                "Plan status changed to " + (status ? "ACTIVE" : "INACTIVE"), getClientIp(request));

        return toPlanDto(updated);
    }

    @Override
    public SuperAdminPageResponse<SuperAdminAdminDto> getAdmins(
            String search,
            String status,
            String planCode,
            String billingType,
            String subStatus,
            int page,
            int size
    ) {
        StringBuilder jpql = new StringBuilder("SELECT u FROM User u WHERE u.role IN ('admin', '1', 'ADMIN') AND u.role <> 'SUPER_ADMIN' ");
        Map<String, Object> params = new HashMap<>();

        if (search != null && !search.trim().isEmpty()) {
            jpql.append("AND (LOWER(u.name) LIKE :search OR LOWER(u.email_id) LIKE :search OR u.mobile_no LIKE :search) ");
            params.put("search", "%" + search.trim().toLowerCase() + "%");
        }

        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            if ("ACTIVE".equalsIgnoreCase(status) || "1".equals(status)) {
                jpql.append("AND u.status = 1 ");
            } else if ("INACTIVE".equalsIgnoreCase(status) || "2".equals(status)) {
                jpql.append("AND u.status = 2 ");
            }
        }

        jpql.append("ORDER BY u.id DESC");

        TypedQuery<User> query = entityManager.createQuery(jpql.toString(), User.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        List<User> allAdmins = query.getResultList();

        // Map and apply post-filters for subscription properties
        List<SuperAdminAdminDto> dtoList = allAdmins.stream().map(this::toAdminDto).filter(adminDto -> {
            if (planCode != null && !planCode.trim().isEmpty() && !planCode.equalsIgnoreCase("ALL")) {
                if (adminDto.getSubscriptionCode() == null || !adminDto.getSubscriptionCode().equalsIgnoreCase(planCode.trim())) {
                    return false;
                }
            }
            if (billingType != null && !billingType.trim().isEmpty() && !billingType.equalsIgnoreCase("ALL")) {
                if (adminDto.getSubscriptionType() == null || !adminDto.getSubscriptionType().equalsIgnoreCase(billingType.trim())) {
                    return false;
                }
            }
            if (subStatus != null && !subStatus.trim().isEmpty() && !subStatus.equalsIgnoreCase("ALL")) {
                if (adminDto.getSubscriptionStatus() == null || !adminDto.getSubscriptionStatus().equalsIgnoreCase(subStatus.trim())) {
                    return false;
                }
            }
            return true;
        }).collect(Collectors.toList());

        long totalElements = dtoList.size();
        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 1;
        int fromIndex = Math.min(page * size, dtoList.size());
        int toIndex = Math.min(fromIndex + size, dtoList.size());
        List<SuperAdminAdminDto> pageContent = dtoList.subList(fromIndex, toIndex);

        return SuperAdminPageResponse.<SuperAdminAdminDto>builder()
                .content(pageContent)
                .pageNumber(page)
                .pageSize(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(page >= totalPages - 1)
                .build();
    }

    @Override
    public Map<String, Object> getAdminById(int id) {
        User admin = entityManager.find(User.class, id);
        if (admin == null) {
            throw new IllegalArgumentException("Admin not found with id: " + id);
        }

        SuperAdminAdminDto adminDto = toAdminDto(admin);

        // Fetch users belonging to this admin
        List<User> users = entityManager.createQuery(
                "SELECT u FROM User u WHERE u.ownerId = :ownerId AND u.id <> :ownerId ORDER BY u.id DESC",
                User.class
        ).setParameter("ownerId", id).getResultList();

        List<SuperAdminUserDto> userDtos = users.stream().map(u -> toUserDto(u, admin)).collect(Collectors.toList());

        // Fetch subscription history
        List<UserSubscription> subHistory = entityManager.createQuery(
                "SELECT us FROM UserSubscription us WHERE us.ownerId = :ownerId ORDER BY us.createdAt DESC",
                UserSubscription.class
        ).setParameter("ownerId", id).getResultList();

        List<SuperAdminSubscriptionDto> subDtos = subHistory.stream().map(us -> toSubscriptionDto(us, admin)).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("admin", adminDto);
        result.put("users", userDtos);
        result.put("subscriptionHistory", subDtos);
        return result;
    }

    @Override
    public SuperAdminAdminDto toggleAdminStatus(int id, int status, String reason, HttpServletRequest request) {
        User admin = entityManager.find(User.class, id);
        if (admin == null) {
            throw new IllegalArgumentException("Admin not found with id: " + id);
        }

        int oldStatus = admin.getStatus();
        admin.setStatus(status);
        entityManager.merge(admin);

        if (status == 2) {
            // ADMIN INACTIVE -> cascade to active child users
            int updatedUsers = entityManager.createQuery(
                    "UPDATE User u SET u.status = 2, u.disabledReason = 'ADMIN_INACTIVE' WHERE u.ownerId = :ownerId AND u.id <> :ownerId AND u.status = 1"
            ).setParameter("ownerId", id).executeUpdate();

            logAudit(null, null, "DEACTIVATE_ADMIN", "ADMIN", String.valueOf(id),
                    "Status: " + oldStatus, "Status: " + status + " (" + updatedUsers + " users disabled)",
                    reason != null ? reason : "Admin deactivated; child users disabled with ADMIN_INACTIVE",
                    getClientIp(request));
        } else if (status == 1) {
            // ADMIN REACTIVATION -> reactivate only users disabled by admin deactivation
            int restoredUsers = entityManager.createQuery(
                    "UPDATE User u SET u.status = 1, u.disabledReason = NULL WHERE u.ownerId = :ownerId AND u.id <> :ownerId AND u.disabledReason = 'ADMIN_INACTIVE'"
            ).setParameter("ownerId", id).executeUpdate();

            logAudit(null, null, "ACTIVATE_ADMIN", "ADMIN", String.valueOf(id),
                    "Status: " + oldStatus, "Status: " + status + " (" + restoredUsers + " users restored)",
                    reason != null ? reason : "Admin reactivated; restored ADMIN_INACTIVE users",
                    getClientIp(request));
        }

        return toAdminDto(admin);
    }

    @Override
    public SuperAdminPageResponse<SuperAdminUserDto> getUsers(
            String search,
            Integer status,
            Integer adminId,
            int page,
            int size
    ) {
        StringBuilder jpql = new StringBuilder(
                "SELECT u FROM User u WHERE u.role NOT IN ('SUPER_ADMIN') "
        );
        Map<String, Object> params = new HashMap<>();

        if (adminId != null && adminId > 0) {
            jpql.append("AND u.ownerId = :adminId AND u.id <> :adminId ");
            params.put("adminId", adminId);
        }

        if (status != null && status > 0) {
            jpql.append("AND u.status = :status ");
            params.put("status", status);
        }

        if (search != null && !search.trim().isEmpty()) {
            jpql.append("AND (LOWER(u.name) LIKE :search OR LOWER(u.email_id) LIKE :search OR u.mobile_no LIKE :search) ");
            params.put("search", "%" + search.trim().toLowerCase() + "%");
        }

        jpql.append("ORDER BY u.id DESC");

        TypedQuery<User> query = entityManager.createQuery(jpql.toString(), User.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        // Count query
        String countJpql = jpql.toString().replace("SELECT u FROM User u", "SELECT COUNT(u) FROM User u");
        int orderIndex = countJpql.lastIndexOf("ORDER BY");
        if (orderIndex > 0) {
            countJpql = countJpql.substring(0, orderIndex);
        }
        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql, Long.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            countQuery.setParameter(entry.getKey(), entry.getValue());
        }
        long totalElements = countQuery.getSingleResult();

        query.setFirstResult(page * size);
        query.setMaxResults(size);
        List<User> users = query.getResultList();

        // Fetch parent admins for mapping
        Set<Integer> ownerIds = users.stream().map(User::getOwnerId).filter(oid -> oid > 0).collect(Collectors.toSet());
        Map<Integer, User> adminMap = new HashMap<>();
        if (!ownerIds.isEmpty()) {
            List<User> admins = entityManager.createQuery("SELECT a FROM User a WHERE a.id IN :ids", User.class)
                    .setParameter("ids", ownerIds).getResultList();
            for (User a : admins) {
                adminMap.put(a.getId(), a);
            }
        }

        List<SuperAdminUserDto> dtoList = users.stream()
                .map(u -> toUserDto(u, adminMap.get(u.getOwnerId())))
                .collect(Collectors.toList());

        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 1;

        return SuperAdminPageResponse.<SuperAdminUserDto>builder()
                .content(dtoList)
                .pageNumber(page)
                .pageSize(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(page >= totalPages - 1)
                .build();
    }

    @Override
    public SuperAdminPageResponse<SuperAdminSubscriptionDto> getSubscriptions(
            String search,
            String billingType,
            String subStatus,
            String payStatus,
            LocalDate fromDate,
            LocalDate toDate,
            int page,
            int size
    ) {
        StringBuilder jpql = new StringBuilder("SELECT us FROM UserSubscription us WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (billingType != null && !billingType.trim().isEmpty() && !billingType.equalsIgnoreCase("ALL")) {
            jpql.append("AND UPPER(us.subscriptionType) LIKE :billingType ");
            params.put("billingType", "%" + billingType.trim().toUpperCase() + "%");
        }

        if (subStatus != null && !subStatus.trim().isEmpty() && !subStatus.equalsIgnoreCase("ALL")) {
            if ("ACTIVE".equalsIgnoreCase(subStatus)) {
                jpql.append("AND us.status = true AND us.active = true ");
            } else if ("EXPIRED".equalsIgnoreCase(subStatus)) {
                jpql.append("AND (us.status = false OR us.active = false) ");
            }
        }

        if (payStatus != null && !payStatus.trim().isEmpty() && !payStatus.equalsIgnoreCase("ALL")) {
            jpql.append("AND UPPER(COALESCE(us.paymentStatus, '')) = :payStatus ");
            params.put("payStatus", payStatus.trim().toUpperCase());
        }

        if (fromDate != null) {
            jpql.append("AND us.createdAt >= :fromDate ");
            params.put("fromDate", fromDate.atStartOfDay());
        }

        if (toDate != null) {
            jpql.append("AND us.createdAt <= :toDate ");
            params.put("toDate", toDate.atTime(LocalTime.MAX));
        }

        jpql.append("ORDER BY us.id DESC");

        TypedQuery<UserSubscription> query = entityManager.createQuery(jpql.toString(), UserSubscription.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        List<UserSubscription> allSubs = query.getResultList();

        // Get admin users
        Set<Integer> ownerIds = allSubs.stream().map(UserSubscription::getOwnerId).collect(Collectors.toSet());
        Map<Integer, User> adminMap = new HashMap<>();
        if (!ownerIds.isEmpty()) {
            List<User> admins = entityManager.createQuery("SELECT a FROM User a WHERE a.id IN :ids", User.class)
                    .setParameter("ids", ownerIds).getResultList();
            for (User a : admins) {
                adminMap.put(a.getId(), a);
            }
        }

        List<SuperAdminSubscriptionDto> dtoList = allSubs.stream()
                .map(us -> toSubscriptionDto(us, adminMap.get(us.getOwnerId())))
                .filter(sub -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String s = search.trim().toLowerCase();
                        boolean matchAdmin = sub.getAdminName() != null && sub.getAdminName().toLowerCase().contains(s);
                        boolean matchEmail = sub.getAdminEmail() != null && sub.getAdminEmail().toLowerCase().contains(s);
                        boolean matchPlan = sub.getSubscriptionName() != null && sub.getSubscriptionName().toLowerCase().contains(s);
                        boolean matchOrder = sub.getRazorpayOrderId() != null && sub.getRazorpayOrderId().toLowerCase().contains(s);
                        return matchAdmin || matchEmail || matchPlan || matchOrder;
                    }
                    return true;
                }).collect(Collectors.toList());

        long totalElements = dtoList.size();
        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 1;
        int fromIndex = Math.min(page * size, dtoList.size());
        int toIndex = Math.min(fromIndex + size, dtoList.size());
        List<SuperAdminSubscriptionDto> pageContent = dtoList.subList(fromIndex, toIndex);

        return SuperAdminPageResponse.<SuperAdminSubscriptionDto>builder()
                .content(pageContent)
                .pageNumber(page)
                .pageSize(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(page >= totalPages - 1)
                .build();
    }

    @Override
    public Map<String, Object> getSubscriptionReport(LocalDate fromDate, LocalDate toDate) {
        LocalDateTime startDt = fromDate != null ? fromDate.atStartOfDay() : LocalDate.of(2000, 1, 1).atStartOfDay();
        LocalDateTime endDt = toDate != null ? toDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        Double totalRev = (Double) entityManager.createQuery(
                "SELECT SUM(us.totalAmount) FROM UserSubscription us WHERE us.createdAt BETWEEN :startDt AND :endDt"
        ).setParameter("startDt", startDt).setParameter("endDt", endDt).getSingleResult();

        Double monthlyRev = (Double) entityManager.createQuery(
                "SELECT SUM(us.totalAmount) FROM UserSubscription us WHERE us.createdAt BETWEEN :startDt AND :endDt AND UPPER(COALESCE(us.subscriptionType, '')) LIKE '%MONTH%'"
        ).setParameter("startDt", startDt).setParameter("endDt", endDt).getSingleResult();

        Double yearlyRev = (Double) entityManager.createQuery(
                "SELECT SUM(us.totalAmount) FROM UserSubscription us WHERE us.createdAt BETWEEN :startDt AND :endDt AND UPPER(COALESCE(us.subscriptionType, '')) LIKE '%YEAR%'"
        ).setParameter("startDt", startDt).setParameter("endDt", endDt).getSingleResult();

        long totalSubs = ((Number) entityManager.createQuery(
                "SELECT COUNT(us) FROM UserSubscription us WHERE us.createdAt BETWEEN :startDt AND :endDt"
        ).setParameter("startDt", startDt).setParameter("endDt", endDt).getSingleResult()).longValue();

        long monthlySubs = ((Number) entityManager.createQuery(
                "SELECT COUNT(us) FROM UserSubscription us WHERE us.createdAt BETWEEN :startDt AND :endDt AND UPPER(COALESCE(us.subscriptionType, '')) LIKE '%MONTH%'"
        ).setParameter("startDt", startDt).setParameter("endDt", endDt).getSingleResult()).longValue();

        long yearlySubs = ((Number) entityManager.createQuery(
                "SELECT COUNT(us) FROM UserSubscription us WHERE us.createdAt BETWEEN :startDt AND :endDt AND UPPER(COALESCE(us.subscriptionType, '')) LIKE '%YEAR%'"
        ).setParameter("startDt", startDt).setParameter("endDt", endDt).getSingleResult()).longValue();

        Map<String, Object> report = new HashMap<>();
        report.put("totalRevenue", totalRev != null ? totalRev : 0.0);
        report.put("monthlyRevenue", monthlyRev != null ? monthlyRev : 0.0);
        report.put("yearlyRevenue", yearlyRev != null ? yearlyRev : 0.0);
        report.put("totalSubscriptions", totalSubs);
        report.put("monthlySubscriptions", monthlySubs);
        report.put("yearlySubscriptions", yearlySubs);
        return report;
    }

    @Override
    public SuperAdminPageResponse<SuperAdminAuditLog> getAuditLogs(int page, int size) {
        long totalElements = ((Number) entityManager.createQuery(
                "SELECT COUNT(a) FROM SuperAdminAuditLog a"
        ).getSingleResult()).longValue();

        TypedQuery<SuperAdminAuditLog> query = entityManager.createQuery(
                "SELECT a FROM SuperAdminAuditLog a ORDER BY a.createdAt DESC",
                SuperAdminAuditLog.class
        );
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        List<SuperAdminAuditLog> content = query.getResultList();

        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 1;

        return SuperAdminPageResponse.<SuperAdminAuditLog>builder()
                .content(content)
                .pageNumber(page)
                .pageSize(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(page >= totalPages - 1)
                .build();
    }

    // ================= HELPER METHODS =================

    private void logAudit(Integer adminId, String adminEmail, String action, String targetType,
                          String targetId, String oldValue, String newValue, String remarks, String ip) {
        try {
            SuperAdminAuditLog log = SuperAdminAuditLog.builder()
                    .superAdminId(adminId)
                    .superAdminEmail(adminEmail)
                    .action(action)
                    .targetType(targetType)
                    .targetId(targetId)
                    .oldValue(oldValue)
                    .newValue(newValue)
                    .remarks(remarks)
                    .ipAddress(ip)
                    .createdAt(LocalDateTime.now())
                    .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Failed to write audit log: " + e.getMessage());
        }
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private SuperAdminPlanDto toPlanDto(SubscriptionPlan plan) {
        long activeSubscribers = 0;
        long totalSubscribers = 0;
        try {
            activeSubscribers = ((Number) entityManager.createQuery(
                    "SELECT COUNT(us) FROM UserSubscription us WHERE us.subscriptionCode = :code AND us.status = true"
            ).setParameter("code", plan.getSubscriptionCode()).getSingleResult()).longValue();

            totalSubscribers = ((Number) entityManager.createQuery(
                    "SELECT COUNT(us) FROM UserSubscription us WHERE us.subscriptionCode = :code"
            ).setParameter("code", plan.getSubscriptionCode()).getSingleResult()).longValue();
        } catch (Exception ignored) {
        }

        return SuperAdminPlanDto.builder()
                .id(plan.getId())
                .subscriptionName(plan.getSubscriptionName())
                .description(plan.getDescription())
                .subscriptionCode(plan.getSubscriptionCode())
                .subscriptionType(plan.getSubscriptionType())
                .amountPerMonth(plan.getAmountPerMonth())
                .month(plan.getMonth())
                .gst(plan.getGst())
                .totalAmount(plan.getTotalAmount())
                .proof(plan.getProof())
                .isMultipleBranch(plan.isMultipleBranch())
                .perBranchUser(plan.getPerBranchUser())
                .branchCount(plan.getBranchCount())
                .isMultipleUser(plan.isMultipleUser())
                .userCount(plan.getUserCount())
                .status(plan.isStatus())
                .permissions(plan.getPermissions())
                .isRepaireAllow(plan.isRepaireAllow())
                .isSalesAllow(plan.isSalesAllow())
                .isEmployeeAllow(plan.isEmployeeAllow())
                .perDayRepaireCount(plan.getPerDayRepaireCount())
                .perDayMobileSmartDevicesSalesCount(plan.getPerDayMobileSmartDevicesSalesCount())
                .perDayComputerLaptopSalesCount(plan.getPerDayComputerLaptopSalesCount())
                .perDayNormalTypeSalesCount(plan.getPerDayNormalTypeSalesCount())
                .isReplaceItem(plan.isReplaceItem())
                .isReturnItem(plan.isReturnItem())
                .isDownloadInvoice(plan.isDownloadInvoice())
                .isfilterInventory(plan.isIsfilterInventory())
                .isfilterSales(plan.isIsfilterSales())
                .isDownloadExcelSales(plan.isDownloadExcelSales())
                .isDownloadExcelEntryItem(plan.isDownloadExcelEntryItem())
                .SUKCount(plan.getSUKCount())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .activeSubscriberCount(activeSubscribers)
                .totalSubscriberCount(totalSubscribers)
                .build();
    }

    private void applyDtoToPlan(SuperAdminPlanDto dto, SubscriptionPlan plan) {
        plan.setSubscriptionName(dto.getSubscriptionName());
        plan.setDescription(dto.getDescription());
        if (dto.getSubscriptionCode() != null && !dto.getSubscriptionCode().trim().isEmpty()) {
            plan.setSubscriptionCode(dto.getSubscriptionCode().trim());
        }
        plan.setSubscriptionType(dto.getSubscriptionType() != null ? dto.getSubscriptionType() : "MONTHLY");
        plan.setAmountPerMonth(dto.getAmountPerMonth() != null ? dto.getAmountPerMonth() : 0.0);
        plan.setMonth(dto.getMonth() != null ? dto.getMonth() : 1);
        plan.setGst(dto.getGst() != null ? dto.getGst() : 18.0);
        plan.setTotalAmount(dto.getTotalAmount() != null ? dto.getTotalAmount() : 0.0);
        plan.setProof(dto.getProof());
        plan.setMultipleBranch(dto.getIsMultipleBranch() != null && dto.getIsMultipleBranch());
        plan.setPerBranchUser(dto.getPerBranchUser() != null ? dto.getPerBranchUser() : 1);
        plan.setBranchCount(dto.getBranchCount() != null ? dto.getBranchCount() : 1);
        plan.setMultipleUser(dto.getIsMultipleUser() != null && dto.getIsMultipleUser());
        plan.setUserCount(dto.getUserCount() != null ? dto.getUserCount() : 5);
        plan.setStatus(dto.getStatus() == null || dto.getStatus());
        plan.setPermissions(dto.getPermissions());

        plan.setRepaireAllow(dto.getIsRepaireAllow() != null && dto.getIsRepaireAllow());
        plan.setSalesAllow(dto.getIsSalesAllow() != null && dto.getIsSalesAllow());
        plan.setEmployeeAllow(dto.getIsEmployeeAllow() != null && dto.getIsEmployeeAllow());
        plan.setPerDayRepaireCount(dto.getPerDayRepaireCount());
        plan.setPerDayMobileSmartDevicesSalesCount(dto.getPerDayMobileSmartDevicesSalesCount());
        plan.setPerDayComputerLaptopSalesCount(dto.getPerDayComputerLaptopSalesCount());
        plan.setPerDayNormalTypeSalesCount(dto.getPerDayNormalTypeSalesCount());

        plan.setReplaceItem(dto.getIsReplaceItem() != null && dto.getIsReplaceItem());
        plan.setReturnItem(dto.getIsReturnItem() != null && dto.getIsReturnItem());
        plan.setDownloadInvoice(dto.getIsDownloadInvoice() != null && dto.getIsDownloadInvoice());
        plan.setIsfilterInventory(dto.getIsfilterInventory() != null && dto.getIsfilterInventory());
        plan.setIsfilterSales(dto.getIsfilterSales() != null && dto.getIsfilterSales());
        plan.setDownloadExcelSales(dto.getIsDownloadExcelSales() != null && dto.getIsDownloadExcelSales());
        plan.setDownloadExcelEntryItem(dto.getIsDownloadExcelEntryItem() != null && dto.getIsDownloadExcelEntryItem());
        plan.setSUKCount(dto.getSUKCount() != null ? dto.getSUKCount() : 100);
    }

    private SuperAdminAdminDto toAdminDto(User admin) {
        // Find latest subscription
        List<UserSubscription> subscriptions = entityManager.createQuery(
                "SELECT us FROM UserSubscription us WHERE us.ownerId = :ownerId ORDER BY us.createdAt DESC",
                UserSubscription.class
        ).setParameter("ownerId", admin.getId()).setMaxResults(1).getResultList();

        UserSubscription sub = subscriptions.isEmpty() ? null : subscriptions.get(0);

        // Count users under this admin
        long totalUsers = ((Number) entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.ownerId = :ownerId AND u.id <> :ownerId"
        ).setParameter("ownerId", admin.getId()).getSingleResult()).longValue();

        long activeUsers = ((Number) entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.ownerId = :ownerId AND u.id <> :ownerId AND u.status = 1"
        ).setParameter("ownerId", admin.getId()).getSingleResult()).longValue();

        long inactiveUsers = Math.max(0, totalUsers - activeUsers);

        String subStatus = "NONE";
        LocalDateTime startAt = null;
        LocalDateTime endAt = null;
        Double amount = 0.0;
        String planName = "No Plan";
        String planCode = "-";
        String billingType = "-";

        if (sub != null) {
            planName = sub.getSubscriptionName();
            planCode = sub.getSubscriptionCode();
            billingType = sub.getSubscriptionType();
            startAt = sub.getSubscriptionStartAt();
            amount = sub.getTotalAmount();
            if (startAt != null) {
                int durationDays = sub.getSubscriptionDuration() > 0 ? sub.getSubscriptionDuration() : 30;
                endAt = startAt.plusDays(durationDays);
                if (sub.isStatus() && sub.isActive() && endAt.isAfter(LocalDateTime.now())) {
                    subStatus = "ACTIVE";
                } else {
                    subStatus = "EXPIRED";
                }
            } else {
                subStatus = sub.isStatus() && sub.isActive() ? "ACTIVE" : "EXPIRED";
            }
        }

        return SuperAdminAdminDto.builder()
                .id(admin.getId())
                .name(admin.getName())
                .email_id(admin.getEmail_id())
                .mobile_no(admin.getMobile_no())
                .country_code(admin.getCountry_code())
                .status(admin.getStatus())
                .created_at(admin.getCreated_at())
                .subscriptionPlan(planName)
                .subscriptionCode(planCode)
                .subscriptionType(billingType)
                .subscriptionStatus(subStatus)
                .subscriptionStartAt(startAt)
                .subscriptionEndAt(endAt)
                .subscriptionAmount(amount)
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .build();
    }

    private SuperAdminUserDto toUserDto(User u, User admin) {
        return SuperAdminUserDto.builder()
                .id(u.getId())
                .name(u.getName())
                .email_id(u.getEmail_id())
                .mobile_no(u.getMobile_no())
                .status(u.getStatus())
                .role(u.getRole())
                .disabledReason(u.getDisabledReason())
                .created_at(u.getCreated_at())
                .ownerId(u.getOwnerId())
                .adminName(admin != null ? admin.getName() : "Unknown")
                .adminEmail(admin != null ? admin.getEmail_id() : "Unknown")
                .adminStatus(admin != null ? admin.getStatus() : 0)
                .build();
    }

    private SuperAdminSubscriptionDto toSubscriptionDto(UserSubscription us, User admin) {
        LocalDateTime startAt = us.getSubscriptionStartAt();
        LocalDateTime endAt = null;
        String subStatus = "EXPIRED";
        if (startAt != null) {
            int durationDays = us.getSubscriptionDuration() > 0 ? us.getSubscriptionDuration() : 30;
            endAt = startAt.plusDays(durationDays);
            if (us.isStatus() && us.isActive() && endAt.isAfter(LocalDateTime.now())) {
                subStatus = "ACTIVE";
            }
        } else if (us.isStatus() && us.isActive()) {
            subStatus = "ACTIVE";
        }

        return SuperAdminSubscriptionDto.builder()
                .id(us.getId())
                .ownerId(us.getOwnerId())
                .adminName(admin != null ? admin.getName() : "Admin #" + us.getOwnerId())
                .adminEmail(admin != null ? admin.getEmail_id() : "-")
                .adminMobile(admin != null ? admin.getMobile_no() : "-")
                .subscriptionName(us.getSubscriptionName())
                .subscriptionCode(us.getSubscriptionCode())
                .subscriptionType(us.getSubscriptionType())
                .amountPerMonth(us.getAmountPerMonth())
                .month(us.getMonth())
                .gst(us.getGst())
                .totalAmount(us.getTotalAmount())
                .createdAt(us.getCreatedAt())
                .subscriptionStartAt(startAt)
                .subscriptionEndAt(endAt)
                .subscriptionDuration(us.getSubscriptionDuration())
                .active(us.isActive())
                .status(us.isStatus())
                .subscriptionStatus(subStatus)
                .razorpayOrderId(us.getRazorpayOrderId())
                .razorpayPaymentId(us.getRazorpayPaymentId())
                .paymentStatus(us.getPaymentStatus())
                .build();
    }
}
