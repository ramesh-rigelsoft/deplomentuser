package com.rigel.user.serviceimpl;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.ISuperAdminDao;
import com.rigel.user.exception.BadGatewayRequest;
import com.rigel.user.exception.TaskTitleException;
import com.rigel.user.exception.TaskTitleNotFound;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.PaymentTransaction;
import com.rigel.user.model.PaymentWebhookEvent;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.SuperAdmin;
import com.rigel.user.model.SuperAdminAuditLog;
import com.rigel.user.model.User;
import com.rigel.user.model.UserSubscription;
import com.rigel.user.security.JwtTokenUtil;
import com.rigel.user.security.JwtUser;
import com.rigel.user.service.ILanguageService;
import com.rigel.user.service.IRazorpayService;
import com.rigel.user.service.ISuperAdminService;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class SuperAdminServiceImpl implements ISuperAdminService {

    private static final Logger logger = LoggerFactory.getLogger(SuperAdminServiceImpl.class);

    @Autowired
    private ISuperAdminDao superAdminDao;

    @Autowired
    private ILanguageService languageService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private IRazorpayService razorpayService;

    @EventListener(ApplicationReadyEvent.class)
    public void initDefaultSuperAdmin() {
        try {
            SuperAdmin existing = superAdminDao.findByUsername("superadmin");
            if (existing == null) {
                SuperAdmin defaultAdmin = SuperAdmin.builder()
                        .username("superadmin")
                        .email("superadmin@rigelsoft.com")
                        .password(SuperAdmin.PASSWORD_ENCODER.encode("SuperAdmin@123"))
                        .name("System Super Admin")
                        .role("SUPERADMIN")
                        .status(1)
                        .createdAt(new Timestamp(System.currentTimeMillis()))
                        .build();
                superAdminDao.saveSuperAdmin(defaultAdmin);
                logger.info("Default Super Admin created: username=superadmin, email=superadmin@rigelsoft.com");
            }
        } catch (Exception e) {
            logger.warn("Could not check/initialize default SuperAdmin on startup: {}", e.getMessage());
        }
    }

    @Override
    public Map<String, Object> login(String username, String password, HttpServletRequest request) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new BadGatewayRequest("Username and password are required.");
        }

        SuperAdmin admin = superAdminDao.findByUsername(username.trim());
        if (admin == null) {
            admin = superAdminDao.findByEmail(username.trim());
        }

        if (admin == null) {
            throw new TaskTitleNotFound("Super Admin not found with username/email: " + username);
        }

        if (!SuperAdmin.PASSWORD_ENCODER.matches(password, admin.getPassword())) {
            throw new TaskTitleException("Invalid credentials for Super Admin.");
        }

        if (admin.getStatus() != 1) {
            throw new TaskTitleException("Super Admin account is inactive.");
        }

        admin.setLastLogin(new Timestamp(System.currentTimeMillis()));
        superAdminDao.saveSuperAdmin(admin);

        // Build JwtUser for token generation
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_SUPERADMIN"));
        authorities.add(new SimpleGrantedAuthority("SUPERADMIN"));

        JwtUser jwtUser = new JwtUser(
                admin.getId(),
                admin.getUsername(),
                admin.getPassword(),
                authorities,
                admin.getStatus(),
                admin.getCreatedAt() != null ? new Date(admin.getCreatedAt().getTime()) : new Date()
        );

        String token = jwtTokenUtil.generateToken(jwtUser, request);

        // Audit Log
        superAdminDao.saveAuditLog(SuperAdminAuditLog.builder()
                .adminUsername(admin.getUsername())
                .action("LOGIN")
                .entityType("AUTH")
                .entityId(String.valueOf(admin.getId()))
                .details("Super Admin logged in successfully")
                .ipAddress(request != null ? request.getRemoteAddr() : "UNKNOWN")
                .createdAt(LocalDateTime.now())
                .build());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", token);
        responseData.put("id", admin.getId());
        responseData.put("username", admin.getUsername());
        responseData.put("email", admin.getEmail());
        responseData.put("name", admin.getName());
        responseData.put("role", admin.getRole());

        return responseData;
    }

    @Override
    public Map<String, Object> getProfile(String username) {
        SuperAdmin admin = superAdminDao.findByUsername(username);
        if (admin == null) {
            throw new TaskTitleNotFound("Super Admin not found: " + username);
        }
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", admin.getId());
        profile.put("username", admin.getUsername());
        profile.put("email", admin.getEmail());
        profile.put("name", admin.getName());
        profile.put("role", admin.getRole());
        profile.put("createdAt", admin.getCreatedAt());
        profile.put("lastLogin", admin.getLastLogin());
        return profile;
    }

    @Override
    public Map<String, Object> getDashboardStats(String filterType, String startDateStr, String endDateStr) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(LocalTime.MAX);

        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime yearStart = LocalDate.now().withDayOfYear(1).atStartOfDay();

        // 1. Plan Stats
        List<SubscriptionPlan> allPlans = superAdminDao.getAllPlans(null, null);
        long activePlans = allPlans.stream().filter(SubscriptionPlan::isStatus).count();
        long inactivePlans = allPlans.size() - activePlans;

        // 2. Owner & Child Stats
        List<User> owners = superAdminDao.getAllOwners(null);
        long totalOwners = owners.size();
        long totalChildUsers = 0;
        for (User o : owners) {
            totalChildUsers += superAdminDao.countChildUsers(o.getId());
        }

        // 3. Subscriptions Stats
        List<UserSubscription> allSubs = superAdminDao.getAllSubscriptions(null, null, null, null);
        long activeSubs = 0;
        long expiredSubs = 0;
        long queuedSubs = 0;
        long expiringSoonSubs = 0;

        for (UserSubscription s : allSubs) {
            LocalDateTime end = s.getSubscriptionEndAt();
            if (end == null && s.getSubscriptionStartAt() != null) {
                int months = s.getMonth() > 0 ? s.getMonth() : (s.getSubscriptionDuration() > 0 ? s.getSubscriptionDuration() : 1);
                end = s.getSubscriptionStartAt().plusMonths(months);
            }

            if (s.isQueued()) {
                queuedSubs++;
            } else if (s.isActive() && s.isStatus()) {
                if (end != null && now.isAfter(end)) {
                    expiredSubs++;
                } else {
                    activeSubs++;
                    if (end != null && end.isBefore(now.plusDays(30))) {
                        expiringSoonSubs++;
                    }
                }
            } else {
                expiredSubs++;
            }
        }

        // 4. Sales & Revenue
        Map<String, Object> totalSales = superAdminDao.getSalesMetrics(null, null);
        Map<String, Object> todaySales = superAdminDao.getSalesMetrics(todayStart, todayEnd);
        Map<String, Object> monthSales = superAdminDao.getSalesMetrics(monthStart, null);
        Map<String, Object> yearSales = superAdminDao.getSalesMetrics(yearStart, null);

        // 5. Payment Transaction Breakdown
        List<PaymentTransaction> transactions = superAdminDao.getAllPaymentTransactions(null, null, null, null);
        long successfulPayments = transactions.stream().filter(t -> "SUCCESS".equalsIgnoreCase(t.getStatus())).count();
        long failedPayments = transactions.stream().filter(t -> "FAILED".equalsIgnoreCase(t.getStatus())).count();
        long pendingPayments = transactions.stream().filter(t -> "CREATED".equalsIgnoreCase(t.getStatus()) || "PENDING".equalsIgnoreCase(t.getStatus())).count();

        // 6. Timelines (Daily, Monthly, Yearly)
        List<Map<String, Object>> dailySales = superAdminDao.getSalesTimeline("daily", now.minusDays(30), now);
        List<Map<String, Object>> monthlySales = superAdminDao.getSalesTimeline("monthly", now.minusMonths(12), now);
        List<Map<String, Object>> yearlySales = superAdminDao.getSalesTimeline("yearly", now.minusYears(5), now);

        // 7. Plan Popularity
        List<Map<String, Object>> planPopularity = superAdminDao.getPlanPopularity();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPlans", allPlans.size());
        stats.put("activePlans", activePlans);
        stats.put("inactivePlans", inactivePlans);

        stats.put("totalOwners", totalOwners);
        stats.put("totalChildUsers", totalChildUsers);

        stats.put("activeSubscriptions", activeSubs);
        stats.put("expiredSubscriptions", expiredSubs);
        stats.put("queuedSubscriptions", queuedSubs);
        stats.put("expiringSoonSubscriptions", expiringSoonSubs);

        stats.put("totalSalesCount", totalSales.get("totalSalesCount"));
        stats.put("totalRevenue", totalSales.get("totalRevenue"));

        stats.put("todaySalesCount", todaySales.get("totalSalesCount"));
        stats.put("todayRevenue", todaySales.get("totalRevenue"));

        stats.put("monthSalesCount", monthSales.get("totalSalesCount"));
        stats.put("monthRevenue", monthSales.get("totalRevenue"));

        stats.put("yearSalesCount", yearSales.get("totalSalesCount"));
        stats.put("yearRevenue", yearSales.get("totalRevenue"));

        stats.put("successfulPayments", successfulPayments);
        stats.put("failedPayments", failedPayments);
        stats.put("pendingPayments", pendingPayments);

        stats.put("dailySalesTimeline", dailySales);
        stats.put("monthlySalesTimeline", monthlySales);
        stats.put("yearlySalesTimeline", yearlySales);
        stats.put("planPopularity", planPopularity);

        return stats;
    }

    @Override
    public List<SubscriptionPlan> getAllPlans(String search, Boolean status) {
        return superAdminDao.getAllPlans(search, status);
    }

    @Override
    public SubscriptionPlan getPlanById(int id) {
        SubscriptionPlan plan = superAdminDao.getPlanById(id);
        if (plan == null) {
            throw new TaskTitleNotFound("Subscription plan not found with ID: " + id);
        }
        return plan;
    }

    @Override
    public SubscriptionPlan createPlan(SubscriptionPlan plan, String adminUsername) {
        if (plan.getSubscriptionName() == null || plan.getSubscriptionName().trim().isEmpty()) {
            throw new BadGatewayRequest("Plan Name is required.");
        }
        if (plan.getSubscriptionCode() == null || plan.getSubscriptionCode().trim().isEmpty()) {
            throw new BadGatewayRequest("Plan Code is required.");
        }

        SubscriptionPlan existing = superAdminDao.getPlanByCode(plan.getSubscriptionCode());
        if (existing != null) {
            throw new TaskTitleException("Plan Code '" + plan.getSubscriptionCode() + "' is already in use.");
        }

        if (plan.getAmountPerMonth() == null) {
            plan.setAmountPerMonth(0.0);
        }
        if (plan.getMonth() <= 0) {
            plan.setMonth(1);
        }
        if (plan.getGst() == null) {
            plan.setGst(Math.round(plan.getAmountPerMonth() * plan.getMonth() * 0.18 * 100.0) / 100.0);
        }
        if (plan.getTotalAmount() <= 0) {
            plan.setTotalAmount((plan.getAmountPerMonth() * plan.getMonth()) + plan.getGst());
        }

        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());
        plan.setStatus(true);

        SubscriptionPlan saved = superAdminDao.savePlan(plan);

        superAdminDao.saveAuditLog(SuperAdminAuditLog.builder()
                .adminUsername(adminUsername)
                .action("CREATE_PLAN")
                .entityType("SUBSCRIPTION_PLAN")
                .entityId(String.valueOf(saved.getId()))
                .details("Created plan: " + saved.getSubscriptionName() + " (" + saved.getSubscriptionCode() + ")")
                .createdAt(LocalDateTime.now())
                .build());

        return saved;
    }

    @Override
    public SubscriptionPlan updatePlan(int id, SubscriptionPlan updatedPlan, String adminUsername) {
        SubscriptionPlan existing = superAdminDao.getPlanById(id);
        if (existing == null) {
            throw new TaskTitleNotFound("Subscription Plan not found with ID: " + id);
        }

        if (updatedPlan.getSubscriptionName() != null) existing.setSubscriptionName(updatedPlan.getSubscriptionName());
        if (updatedPlan.getSubscriptionType() != null) existing.setSubscriptionType(updatedPlan.getSubscriptionType());
        if (updatedPlan.getAmountPerMonth() != null) existing.setAmountPerMonth(updatedPlan.getAmountPerMonth());
        if (updatedPlan.getMonth() > 0) existing.setMonth(updatedPlan.getMonth());
        if (updatedPlan.getGst() != null) existing.setGst(updatedPlan.getGst());
        if (updatedPlan.getTotalAmount() > 0) existing.setTotalAmount(updatedPlan.getTotalAmount());
        if (updatedPlan.getUserCount() > 0) existing.setUserCount(updatedPlan.getUserCount());
        if (updatedPlan.getBranchCount() > 0) existing.setBranchCount(updatedPlan.getBranchCount());
        if (updatedPlan.getSUKCount() > 0) existing.setSUKCount(updatedPlan.getSUKCount());
        if (updatedPlan.getDescription() != null) existing.setDescription(updatedPlan.getDescription());
        if (updatedPlan.getCurrency() != null) existing.setCurrency(updatedPlan.getCurrency());
        if (updatedPlan.getDurationUnit() != null) existing.setDurationUnit(updatedPlan.getDurationUnit());
        if (updatedPlan.getFeatures() != null) existing.setFeatures(updatedPlan.getFeatures());
        if (updatedPlan.getPermissions() != null) existing.setPermissions(updatedPlan.getPermissions());

        existing.setMultipleBranch(updatedPlan.isMultipleBranch());
        existing.setMultipleUser(updatedPlan.isMultipleUser());
        existing.setRepaireAllow(updatedPlan.isRepaireAllow());
        existing.setSalesAllow(updatedPlan.isSalesAllow());
        existing.setEmployeeAllow(updatedPlan.isEmployeeAllow());
        existing.setReplaceItem(updatedPlan.isReplaceItem());
        existing.setReturnItem(updatedPlan.isReturnItem());
        existing.setDownloadInvoice(updatedPlan.isDownloadInvoice());
        existing.setIsfilterInventory(updatedPlan.isIsfilterInventory());
        existing.setIsfilterSales(updatedPlan.isIsfilterSales());
        existing.setDownloadExcelSales(updatedPlan.isDownloadExcelSales());
        existing.setDownloadExcelEntryItem(updatedPlan.isDownloadExcelEntryItem());

        existing.setUpdatedAt(LocalDateTime.now());

        SubscriptionPlan saved = superAdminDao.savePlan(existing);

        superAdminDao.saveAuditLog(SuperAdminAuditLog.builder()
                .adminUsername(adminUsername)
                .action("UPDATE_PLAN")
                .entityType("SUBSCRIPTION_PLAN")
                .entityId(String.valueOf(saved.getId()))
                .details("Updated plan: " + saved.getSubscriptionName())
                .createdAt(LocalDateTime.now())
                .build());

        return saved;
    }

    @Override
    public boolean togglePlanStatus(int id, boolean status, String adminUsername) {
        SubscriptionPlan plan = superAdminDao.getPlanById(id);
        if (plan == null) {
            throw new TaskTitleNotFound("Plan not found with ID: " + id);
        }

        plan.setStatus(status);
        plan.setUpdatedAt(LocalDateTime.now());
        superAdminDao.savePlan(plan);

        superAdminDao.saveAuditLog(SuperAdminAuditLog.builder()
                .adminUsername(adminUsername)
                .action(status ? "ACTIVATE_PLAN" : "DEACTIVATE_PLAN")
                .entityType("SUBSCRIPTION_PLAN")
                .entityId(String.valueOf(id))
                .details((status ? "Activated" : "Deactivated") + " plan: " + plan.getSubscriptionName())
                .createdAt(LocalDateTime.now())
                .build());

        return true;
    }

    @Override
    public Map<String, Object> getSalesReport(String filterType, String startDateStr, String endDateStr, String search) {
        LocalDateTime start = null;
        LocalDateTime end = null;
        LocalDateTime now = LocalDateTime.now();

        if ("today".equalsIgnoreCase(filterType)) {
            start = LocalDate.now().atStartOfDay();
            end = LocalDate.now().atTime(LocalTime.MAX);
        } else if ("yesterday".equalsIgnoreCase(filterType)) {
            start = LocalDate.now().minusDays(1).atStartOfDay();
            end = LocalDate.now().minusDays(1).atTime(LocalTime.MAX);
        } else if ("last7days".equalsIgnoreCase(filterType)) {
            start = now.minusDays(7);
            end = now;
        } else if ("thisMonth".equalsIgnoreCase(filterType)) {
            start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
            end = now;
        } else if ("lastMonth".equalsIgnoreCase(filterType)) {
            LocalDate firstOfLastMonth = LocalDate.now().minusMonths(1).withDayOfMonth(1);
            start = firstOfLastMonth.atStartOfDay();
            end = firstOfLastMonth.plusMonths(1).minusDays(1).atTime(LocalTime.MAX);
        } else if ("thisYear".equalsIgnoreCase(filterType)) {
            start = LocalDate.now().withDayOfYear(1).atStartOfDay();
            end = now;
        } else if ("lastYear".equalsIgnoreCase(filterType)) {
            LocalDate firstOfLastYear = LocalDate.now().minusYears(1).withDayOfYear(1);
            start = firstOfLastYear.atStartOfDay();
            end = firstOfLastYear.plusYears(1).minusDays(1).atTime(LocalTime.MAX);
        } else if ("custom".equalsIgnoreCase(filterType) && startDateStr != null && endDateStr != null) {
            try {
                start = LocalDate.parse(startDateStr).atStartOfDay();
                end = LocalDate.parse(endDateStr).atTime(LocalTime.MAX);
            } catch (Exception e) {
                logger.warn("Invalid date format for custom range: {} - {}", startDateStr, endDateStr);
            }
        }

        List<UserSubscription> subscriptions = superAdminDao.getAllSubscriptions(search, null, start, end);
        double totalRevenue = 0.0;
        long successfulCount = 0;
        long failedCount = 0;
        long pendingCount = 0;

        List<Map<String, Object>> rows = new ArrayList<>();
        for (UserSubscription sub : subscriptions) {
            totalRevenue += sub.getTotalAmount();
            if (sub.isStatus() || "SUCCESS".equalsIgnoreCase(sub.getPaymentStatus())) {
                successfulCount++;
            } else if ("FAILED".equalsIgnoreCase(sub.getPaymentStatus())) {
                failedCount++;
            } else {
                pendingCount++;
            }

            User owner = superAdminDao.getOwnerById(sub.getOwnerId());
            Map<String, Object> row = new HashMap<>();
            row.put("subscriptionId", sub.getId());
            row.put("ownerId", sub.getOwnerId());
            row.put("ownerName", owner != null ? owner.getName() : "Unknown");
            row.put("ownerEmail", owner != null ? cleanEmail(owner.getEmail_id()) : "-");
            row.put("ownerMobile", owner != null ? cleanMobile(owner.getMobile_no()) : "-");
            row.put("planName", sub.getSubscriptionName());
            row.put("planCode", sub.getSubscriptionCode());
            row.put("planType", sub.getSubscriptionType());
            row.put("amount", sub.getTotalAmount());
            row.put("duration", sub.getSubscriptionDuration() > 0 ? sub.getSubscriptionDuration() : sub.getMonth());
            row.put("orderId", sub.getRazorpayOrderId());
            row.put("paymentId", sub.getRazorpayPaymentId());
            row.put("paymentStatus", sub.getPaymentStatus() != null ? sub.getPaymentStatus() : (sub.isStatus() ? "SUCCESS" : "PENDING"));
            row.put("subscriptionStatus", sub.isQueued() ? "QUEUED" : (sub.isActive() ? "ACTIVE" : "EXPIRED"));
            row.put("startDate", sub.getSubscriptionStartAt());
            row.put("expiryDate", sub.getSubscriptionEndAt());
            row.put("createdAt", sub.getCreatedAt());
            rows.add(row);
        }

        Map<String, Object> report = new HashMap<>();
        report.put("totalSubscriptions", subscriptions.size());
        report.put("totalRevenue", totalRevenue);
        report.put("successfulCount", successfulCount);
        report.put("failedCount", failedCount);
        report.put("pendingCount", pendingCount);
        report.put("transactions", rows);
        report.put("filterType", filterType);

        return report;
    }

    @Override
    public List<Map<String, Object>> getOwnersList(String search) {
        List<User> owners = superAdminDao.getAllOwners(search);
        List<Map<String, Object>> list = new ArrayList<>();

        for (User o : owners) {
            Map<String, Object> item = new HashMap<>();
            item.put("ownerId", o.getId());
            item.put("ownerName", o.getName());
            item.put("email", cleanEmail(o.getEmail_id()));
            item.put("mobile", cleanMobile(o.getMobile_no()));
            item.put("accountStatus", o.getStatus() == 1 ? "ACTIVE" : (o.getStatus() == 2 ? "INACTIVE" : "DELETED"));
            item.put("softwareKey", o.getSoftwareKey());
            item.put("softwareType", o.getSoftwareType());
            item.put("createdAt", o.getCreated_at());
            item.put("branchCount", o.getBranchCount());
            String defLang = (o.getDefaultLanguage() != null && !o.getDefaultLanguage().trim().isEmpty()) ? o.getDefaultLanguage().trim() : "en";
            item.put("defaultLanguage", defLang);
            item.put("defaultLanguageName", languageService.getLanguageName(defLang));
            item.put("personalLanguage", o.getPersonalLanguage());
            item.put("personalLanguageName", o.getPersonalLanguage() != null ? languageService.getLanguageName(o.getPersonalLanguage()) : null);

            // Count child users
            long childCount = superAdminDao.countChildUsers(o.getId());
            item.put("childUsersCount", childCount);

            // Latest / Active Subscription
            List<UserSubscription> subs = superAdminDao.getSubscriptionsByOwnerId(o.getId());
            UserSubscription currentSub = null;
            for (UserSubscription s : subs) {
                if (s.isActive() && s.isStatus() && !s.isQueued()) {
                    currentSub = s;
                    break;
                }
            }
            if (currentSub == null && !subs.isEmpty()) {
                currentSub = subs.get(0);
            }

            if (currentSub != null) {
                item.put("currentPlanName", currentSub.getSubscriptionName());
                item.put("subscriptionCode", currentSub.getSubscriptionCode());
                item.put("subscriptionStatus", currentSub.isQueued() ? "QUEUED" : (currentSub.isActive() ? "ACTIVE" : "EXPIRED"));
                item.put("subscriptionStartDate", currentSub.getSubscriptionStartAt());
                item.put("subscriptionExpiryDate", currentSub.getSubscriptionEndAt());
                item.put("totalAmount", currentSub.getTotalAmount());
            } else {
                item.put("currentPlanName", "None");
                item.put("subscriptionStatus", "NO_SUBSCRIPTION");
            }

            list.add(item);
        }

        return list;
    }

    @Override
    public Map<String, Object> getOwnerDetail(int ownerId) {
        User owner = superAdminDao.getOwnerById(ownerId);
        if (owner == null) {
            throw new TaskTitleNotFound("Owner not found with ID: " + ownerId);
        }

        Map<String, Object> details = new HashMap<>();

        // 1. Owner Information
        Map<String, Object> ownerInfo = new HashMap<>();
        ownerInfo.put("ownerId", owner.getId());
        ownerInfo.put("name", owner.getName());
        ownerInfo.put("email", cleanEmail(owner.getEmail_id()));
        ownerInfo.put("mobile", cleanMobile(owner.getMobile_no()));
        ownerInfo.put("gender", owner.getGender());
        ownerInfo.put("softwareKey", owner.getSoftwareKey());
        ownerInfo.put("softwareType", owner.getSoftwareType());
        ownerInfo.put("status", owner.getStatus() == 1 ? "ACTIVE" : "INACTIVE");
        ownerInfo.put("createdAt", owner.getCreated_at());
        ownerInfo.put("branchCount", owner.getBranchCount());
        ownerInfo.put("profileLogo", owner.getProfileLogo());
        String defLang = (owner.getDefaultLanguage() != null && !owner.getDefaultLanguage().trim().isEmpty()) ? owner.getDefaultLanguage().trim() : "en";
        ownerInfo.put("defaultLanguage", defLang);
        ownerInfo.put("defaultLanguageName", languageService.getLanguageName(defLang));
        ownerInfo.put("personalLanguage", owner.getPersonalLanguage());
        ownerInfo.put("personalLanguageName", owner.getPersonalLanguage() != null ? languageService.getLanguageName(owner.getPersonalLanguage()) : null);
        details.put("owner", ownerInfo);

        // 2. Child Users
        List<User> childUsers = superAdminDao.getChildUsersByOwnerId(ownerId);
        List<Map<String, Object>> children = new ArrayList<>();
        for (User c : childUsers) {
            Map<String, Object> ch = new HashMap<>();
            ch.put("id", c.getId());
            ch.put("name", c.getName());
            ch.put("email", cleanEmail(c.getEmail_id()));
            ch.put("mobile", cleanMobile(c.getMobile_no()));
            ch.put("role", c.getRole());
            ch.put("branchCode", c.getBranchCode());
            ch.put("status", c.getStatus() == 1 ? "ACTIVE" : "INACTIVE");
            ch.put("createdAt", c.getCreated_at());
            children.add(ch);
        }
        details.put("childUsers", children);
        details.put("childUsersCount", children.size());

        // 3. Subscriptions (Current & History)
        List<UserSubscription> subs = superAdminDao.getSubscriptionsByOwnerId(ownerId);
        UserSubscription currentActive = null;
        List<Map<String, Object>> subHistory = new ArrayList<>();

        for (UserSubscription s : subs) {
            Map<String, Object> subMap = new HashMap<>();
            subMap.put("id", s.getId());
            subMap.put("planName", s.getSubscriptionName());
            subMap.put("planCode", s.getSubscriptionCode());
            subMap.put("planType", s.getSubscriptionType());
            subMap.put("amount", s.getTotalAmount());
            subMap.put("amountPerMonth", s.getAmountPerMonth());
            subMap.put("duration", s.getSubscriptionDuration() > 0 ? s.getSubscriptionDuration() : s.getMonth());
            subMap.put("branchCode", s.getBranchCode());
            subMap.put("startDate", s.getSubscriptionStartAt());
            subMap.put("expiryDate", s.getSubscriptionEndAt());
            subMap.put("orderId", s.getRazorpayOrderId());
            subMap.put("paymentId", s.getRazorpayPaymentId());
            subMap.put("paymentStatus", s.getPaymentStatus());
            subMap.put("status", s.isQueued() ? "QUEUED" : (s.isActive() ? "ACTIVE" : "EXPIRED"));
            subMap.put("isQueued", s.isQueued());
            subMap.put("createdAt", s.getCreatedAt());

            if (currentActive == null && s.isActive() && s.isStatus() && !s.isQueued()) {
                currentActive = s;
                details.put("currentSubscription", subMap);
            }

            subHistory.add(subMap);
        }

        if (currentActive == null) {
            details.put("currentSubscription", null);
        }
        details.put("subscriptionHistory", subHistory);

        // 4. Branches & Language Configuration
        List<OfficeBranch> branches = superAdminDao.getBranchesByOwnerId(ownerId);
        List<Map<String, Object>> branchList = new ArrayList<>();
        for (OfficeBranch b : branches) {
            Map<String, Object> bm = new HashMap<>();
            bm.put("id", b.getId());
            bm.put("branchCode", b.getBranchCode());
            bm.put("branchName", b.getBranchName());
            bm.put("address", b.getAddress());
            bm.put("city", b.getCity());
            bm.put("state", b.getState());
            bm.put("pincode", b.getPincode());
            bm.put("status", b.isStatus());
            String bLang = (b.getLanguage() != null && !b.getLanguage().trim().isEmpty()) ? b.getLanguage().trim() : "en";
            bm.put("language", bLang);
            bm.put("languageName", languageService.getLanguageName(bLang));
            bm.put("isRtl", languageService.isRtl(bLang));
            bm.put("shopType", b.getShopType());
            bm.put("createdAt", b.getCreatedAt());
            branchList.add(bm);
        }
        details.put("branches", branchList);
        details.put("branchesCount", branchList.size());

        return details;
    }

    @Override
    public List<Map<String, Object>> getAllSubscriptions(String search, String status, String filterType, String startDate, String endDate) {
        LocalDateTime start = null;
        LocalDateTime end = null;
        LocalDateTime now = LocalDateTime.now();

        if ("daily".equalsIgnoreCase(filterType)) {
            start = LocalDate.now().atStartOfDay();
            end = LocalDate.now().atTime(LocalTime.MAX);
        } else if ("monthly".equalsIgnoreCase(filterType)) {
            start = LocalDate.now().withDayOfMonth(1).atStartOfDay();
            end = now;
        } else if ("yearly".equalsIgnoreCase(filterType)) {
            start = LocalDate.now().withDayOfYear(1).atStartOfDay();
            end = now;
        } else if (startDate != null && endDate != null && !startDate.isEmpty() && !endDate.isEmpty()) {
            try {
                start = LocalDate.parse(startDate).atStartOfDay();
                end = LocalDate.parse(endDate).atTime(LocalTime.MAX);
            } catch (Exception e) {}
        }

        List<UserSubscription> list = superAdminDao.getAllSubscriptions(search, status, start, end);
        List<Map<String, Object>> result = new ArrayList<>();

        for (UserSubscription s : list) {
            User owner = superAdminDao.getOwnerById(s.getOwnerId());
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("ownerId", s.getOwnerId());
            map.put("ownerName", owner != null ? owner.getName() : "Unknown");
            map.put("ownerEmail", owner != null ? cleanEmail(owner.getEmail_id()) : "-");
            map.put("planName", s.getSubscriptionName());
            map.put("planCode", s.getSubscriptionCode());
            map.put("planType", s.getSubscriptionType());
            map.put("amount", s.getTotalAmount());
            map.put("duration", s.getSubscriptionDuration() > 0 ? s.getSubscriptionDuration() : s.getMonth());
            map.put("branchCode", s.getBranchCode());
            map.put("startDate", s.getSubscriptionStartAt());
            map.put("expiryDate", s.getSubscriptionEndAt());
            map.put("orderId", s.getRazorpayOrderId());
            map.put("paymentId", s.getRazorpayPaymentId());
            map.put("paymentStatus", s.getPaymentStatus());
            map.put("status", s.isQueued() ? "QUEUED" : (s.isActive() ? "ACTIVE" : "EXPIRED"));
            map.put("isQueued", s.isQueued());
            map.put("createdAt", s.getCreatedAt());
            result.add(map);
        }

        return result;
    }

    @Override
    public List<PaymentTransaction> getAllPayments(String search, String status, String startDate, String endDate) {
        LocalDateTime start = null;
        LocalDateTime end = null;
        if (startDate != null && endDate != null && !startDate.isEmpty() && !endDate.isEmpty()) {
            try {
                start = LocalDate.parse(startDate).atStartOfDay();
                end = LocalDate.parse(endDate).atTime(LocalTime.MAX);
            } catch (Exception e) {}
        }
        return superAdminDao.getAllPaymentTransactions(search, status, start, end);
    }

    @Override
    public List<SuperAdminAuditLog> getAuditLogs(int limit) {
        return superAdminDao.getAuditLogs(limit);
    }

    @Scheduled(fixedRate = 3600000) // Every hour
    @Override
    public void processSubscriptionLifecycle() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Mark expired active subscriptions
        List<UserSubscription> expired = superAdminDao.getExpiredActiveSubscriptions(now);
        for (UserSubscription s : expired) {
            s.setActive(false);
            s.setStatus(false);
            s.setQueueStatus("EXPIRED");
            // Check if there is a queued subscription for this owner & branch
            logger.info("Marked subscription id={} as expired for ownerId={}", s.getId(), s.getOwnerId());
        }

        // 2. Activate queued subscriptions whose start time has arrived
        List<UserSubscription> toActivate = superAdminDao.getQueuedSubscriptionsToActivate(now);
        for (UserSubscription q : toActivate) {
            q.setQueued(false);
            q.setActive(true);
            q.setStatus(true);
            q.setQueueStatus("ACTIVE");
            logger.info("Activated queued subscription id={} for ownerId={}", q.getId(), q.getOwnerId());
        }
    }

    @Override
    public Map<String, Object> processRazorpayWebhook(String payload, String signature) {
        Map<String, Object> response = new HashMap<>();

        if (payload == null || payload.trim().isEmpty()) {
            response.put("status", "BAD_REQUEST");
            response.put("message", "Empty payload");
            return response;
        }

        boolean verified = razorpayService.verifyWebhookSignature(payload, signature);
        if (!verified) {
            logger.warn("Razorpay Webhook signature verification failed!");
            response.put("status", "UNAUTHORIZED");
            response.put("message", "Invalid webhook signature");
            return response;
        }

        try {
            JSONObject json = new JSONObject(payload);
            String event = json.optString("event");
            String eventId = json.optString("event_id", "evt_" + System.currentTimeMillis());

            // Check duplicate / idempotent
            PaymentWebhookEvent existing = superAdminDao.findWebhookEventById(eventId);
            if (existing != null) {
                logger.info("Duplicate Razorpay webhook event received: {}. Skipping.", eventId);
                response.put("status", "OK");
                response.put("message", "Event already processed");
                return response;
            }

            JSONObject payloadObj = json.optJSONObject("payload");
            JSONObject paymentObj = payloadObj != null ? payloadObj.optJSONObject("payment") : null;
            JSONObject entity = paymentObj != null ? paymentObj.optJSONObject("entity") : null;

            String paymentId = entity != null ? entity.optString("id") : null;
            String orderId = entity != null ? entity.optString("order_id") : null;

            // Save webhook event
            PaymentWebhookEvent webhookEvent = PaymentWebhookEvent.builder()
                    .eventId(eventId)
                    .eventType(event)
                    .orderId(orderId)
                    .paymentId(paymentId)
                    .payload(payload)
                    .status("PROCESSED")
                    .createdAt(LocalDateTime.now())
                    .build();
            superAdminDao.saveWebhookEvent(webhookEvent);

            // Handle payment.captured or order.paid
            if ("payment.captured".equals(event) || "order.paid".equals(event)) {
                if (orderId != null) {
                    PaymentTransaction tx = superAdminDao.findPaymentTransactionByOrderId(orderId);
                    if (tx != null) {
                        tx.setStatus("SUCCESS");
                        if (paymentId != null) tx.setPaymentId(paymentId);
                        tx.setGatewayResponse("Webhook confirmed success: " + event);
                        superAdminDao.savePaymentTransaction(tx);
                    }
                }
            } else if ("payment.failed".equals(event)) {
                if (orderId != null) {
                    PaymentTransaction tx = superAdminDao.findPaymentTransactionByOrderId(orderId);
                    if (tx != null) {
                        tx.setStatus("FAILED");
                        if (paymentId != null) tx.setPaymentId(paymentId);
                        tx.setGatewayResponse("Webhook reported failure: " + event);
                        superAdminDao.savePaymentTransaction(tx);
                    }
                }
            }

            response.put("status", "OK");
            response.put("message", "Webhook processed successfully");
            return response;
        } catch (Exception e) {
            logger.error("Error processing Razorpay webhook: {}", e.getMessage(), e);
            response.put("status", "ERROR");
            response.put("message", e.getMessage());
            return response;
        }
    }

    private String cleanEmail(String email) {
        if (email != null && email.contains("|")) {
            return email.split("\\|", 2)[0];
        }
        return email != null ? email : "-";
    }

    private String cleanMobile(String mobile) {
        if (mobile != null && mobile.contains("|")) {
            return mobile.split("\\|", 2)[0];
        }
        return mobile != null ? mobile : "-";
    }
}
