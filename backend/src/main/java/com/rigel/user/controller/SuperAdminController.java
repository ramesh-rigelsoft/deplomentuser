package com.rigel.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rigel.user.dao.ISuperAdminDao;
import com.rigel.user.exception.BadGatewayRequest;
import com.rigel.user.model.LanguageMaster;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.PaymentTransaction;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.SuperAdmin;
import com.rigel.user.model.SuperAdminAuditLog;
import com.rigel.user.model.User;
import com.rigel.user.security.JwtConfig;
import com.rigel.user.security.JwtTokenUtil;
import com.rigel.user.service.ILanguageService;
import com.rigel.user.service.ISuperAdminService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/superadmin")
@CrossOrigin(originPatterns = {"*"}, allowedHeaders = "*", allowCredentials = "true")
public class SuperAdminController {

    @Autowired
    private ISuperAdminService superAdminService;

    @Autowired
    private ISuperAdminDao superAdminDao;

    @Autowired
    private JwtConfig jwtConfig;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ILanguageService languageService;

    /**
     * Helper to validate super admin authentication from Bearer token
     */
    private String authenticateSuperAdmin(HttpServletRequest request) {
        String authHeader = request.getHeader(jwtConfig.getHeader());
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BadGatewayRequest("Missing or invalid Authorization header.");
        }
        String token = authHeader.substring(7);
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtConfig.getKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            String username = claims.getSubject();
            SuperAdmin admin = superAdminDao.findByUsername(username);
            if (admin == null) {
                admin = superAdminDao.findByEmail(username);
            }
            if (admin == null || admin.getStatus() != 1) {
                throw new BadGatewayRequest("Unauthorized: Not a valid active Super Admin.");
            }
            return admin.getUsername();
        } catch (Exception e) {
            throw new BadGatewayRequest("Invalid or expired Super Admin token.");
        }
    }

    // ========================================================
    // 1. AUTHENTICATION
    // ========================================================

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Map<String, Object> authData = superAdminService.login(username, password, request);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("message", "Super Admin logged in successfully.");
        response.put("data", authData);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {
        String adminUser = "anonymous";
        try {
            adminUser = authenticateSuperAdmin(request);
            superAdminDao.saveAuditLog(SuperAdminAuditLog.builder()
                    .adminUsername(adminUser)
                    .action("LOGOUT")
                    .entityType("AUTH")
                    .details("Super Admin logged out")
                    .ipAddress(request.getRemoteAddr())
                    .build());
        } catch (Exception ignored) {}

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("message", "Logged out successfully.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth/profile")
    public ResponseEntity<Map<String, Object>> getProfile(HttpServletRequest request) {
        String adminUser = authenticateSuperAdmin(request);
        Map<String, Object> profile = superAdminService.getProfile(adminUser);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", profile);
        return ResponseEntity.ok(response);
    }

    // ========================================================
    // 2. DASHBOARD
    // ========================================================

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestParam(required = false) String filterType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        Map<String, Object> stats = superAdminService.getDashboardStats(filterType, startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", stats);
        return ResponseEntity.ok(response);
    }

    // ========================================================
    // 3. SUBSCRIPTION PLANS MANAGEMENT
    // ========================================================

    @GetMapping("/plans")
    public ResponseEntity<Map<String, Object>> getPlans(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean status,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        List<SubscriptionPlan> plans = superAdminService.getAllPlans(search, status);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", plans);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<Map<String, Object>> getPlanById(@PathVariable int id, HttpServletRequest request) {
        authenticateSuperAdmin(request);
        SubscriptionPlan plan = superAdminService.getPlanById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", plan);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/plans")
    public ResponseEntity<Map<String, Object>> createPlan(@RequestBody SubscriptionPlan plan, HttpServletRequest request) {
        String adminUser = authenticateSuperAdmin(request);
        SubscriptionPlan created = superAdminService.createPlan(plan, adminUser);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "CREATED");
        response.put("code", 201);
        response.put("message", "Subscription plan created successfully.");
        response.put("data", created);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<Map<String, Object>> updatePlan(
            @PathVariable int id,
            @RequestBody SubscriptionPlan plan,
            HttpServletRequest request) {

        String adminUser = authenticateSuperAdmin(request);
        SubscriptionPlan updated = superAdminService.updatePlan(id, plan, adminUser);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("message", "Subscription plan updated successfully.");
        response.put("data", updated);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/plans/{id}/status")
    public ResponseEntity<Map<String, Object>> togglePlanStatus(
            @PathVariable int id,
            @RequestBody Map<String, Boolean> body,
            HttpServletRequest request) {

        String adminUser = authenticateSuperAdmin(request);
        boolean status = body.getOrDefault("status", false);
        superAdminService.togglePlanStatus(id, status, adminUser);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("message", "Plan status changed to " + (status ? "ACTIVE" : "INACTIVE"));
        return ResponseEntity.ok(response);
    }

    // ========================================================
    // 4. SALES REPORTS & ANALYTICS
    // ========================================================

    @GetMapping("/reports/sales")
    public ResponseEntity<Map<String, Object>> getSalesReport(
            @RequestParam(required = false, defaultValue = "thisMonth") String filterType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String search,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        Map<String, Object> report = superAdminService.getSalesReport(filterType, startDate, endDate, search);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", report);
        return ResponseEntity.ok(response);
    }

    // ========================================================
    // 5. OWNERS & CHILD USERS
    // ========================================================

    @GetMapping("/owners")
    public ResponseEntity<Map<String, Object>> getOwners(
            @RequestParam(required = false) String search,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        List<Map<String, Object>> owners = superAdminService.getOwnersList(search);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", owners);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/owners/{id}")
    public ResponseEntity<Map<String, Object>> getOwnerDetail(
            @PathVariable int id,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        Map<String, Object> detail = superAdminService.getOwnerDetail(id);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", detail);
        return ResponseEntity.ok(response);
    }

    // ========================================================
    // 6. SUBSCRIPTIONS
    // ========================================================

    @GetMapping("/subscriptions")
    public ResponseEntity<Map<String, Object>> getSubscriptions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String filterType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        List<Map<String, Object>> list = superAdminService.getAllSubscriptions(search, status, filterType, startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", list);
        return ResponseEntity.ok(response);
    }

    // ========================================================
    // 7. PAYMENTS
    // ========================================================

    @GetMapping("/payments")
    public ResponseEntity<Map<String, Object>> getPayments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        List<PaymentTransaction> list = superAdminService.getAllPayments(search, status, startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", list);
        return ResponseEntity.ok(response);
    }

    // ========================================================
    // 8. AUDIT LOGS
    // ========================================================

    @GetMapping("/audit-logs")
    public ResponseEntity<Map<String, Object>> getAuditLogs(
            @RequestParam(required = false, defaultValue = "50") int limit,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        List<SuperAdminAuditLog> logs = superAdminService.getAuditLogs(limit);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", logs);
        return ResponseEntity.ok(response);
    }

    // ========================================================
    // 9. MULTILINGUAL & LANGUAGE MANAGEMENT
    // ========================================================

    @GetMapping("/languages")
    public ResponseEntity<Map<String, Object>> getAllLanguages(HttpServletRequest request) {
        authenticateSuperAdmin(request);
        List<LanguageMaster> languages = languageService.getAllLanguages();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", languages);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/languages/{code}/status")
    public ResponseEntity<Map<String, Object>> toggleLanguageStatus(
            @PathVariable String code,
            @RequestBody Map<String, Boolean> body,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        boolean active = body.getOrDefault("active", true);
        LanguageMaster updated = languageService.toggleLanguageStatus(code, active);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("message", "Language " + updated.getLanguageName() + " status changed to " + (active ? "ACTIVE" : "INACTIVE"));
        response.put("data", updated);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/owners/{id}/language")
    public ResponseEntity<Map<String, Object>> updateOwnerDefaultLanguage(
            @PathVariable int id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        String language = body.get("language");
        if (language == null || language.trim().isEmpty()) {
            throw new BadGatewayRequest("Language is required.");
        }

        User owner = languageService.updateOwnerDefaultLanguage(id, language.trim());

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("message", "Owner default language updated to " + languageService.getLanguageName(owner.getDefaultLanguage()));
        Map<String, Object> data = new HashMap<>();
        data.put("ownerId", owner.getId());
        data.put("defaultLanguage", owner.getDefaultLanguage());
        data.put("defaultLanguageName", languageService.getLanguageName(owner.getDefaultLanguage()));
        response.put("data", data);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/branches/{branchCode}/language")
    public ResponseEntity<Map<String, Object>> updateBranchLanguage(
            @PathVariable String branchCode,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        authenticateSuperAdmin(request);
        String language = body.get("language");
        if (language == null || language.trim().isEmpty()) {
            throw new BadGatewayRequest("Language is required.");
        }

        OfficeBranch branch = languageService.updateBranchLanguage(branchCode, language.trim());

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("message", "Branch language updated to " + languageService.getLanguageName(branch.getLanguage()));
        Map<String, Object> data = new HashMap<>();
        data.put("branchCode", branch.getBranchCode());
        data.put("branchName", branch.getBranchName());
        data.put("language", branch.getLanguage());
        data.put("languageName", languageService.getLanguageName(branch.getLanguage()));
        data.put("isRtl", languageService.isRtl(branch.getLanguage()));
        response.put("data", data);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/branches")
    public ResponseEntity<Map<String, Object>> getAllBranches(HttpServletRequest request) {
        authenticateSuperAdmin(request);
        List<OfficeBranch> branches = superAdminDao.getAllBranches();
        List<Map<String, Object>> list = new java.util.ArrayList<>();
        Map<Integer, String> ownerNames = new HashMap<>();

        for (OfficeBranch b : branches) {
            Map<String, Object> bm = new HashMap<>();
            bm.put("id", b.getId());
            bm.put("branchCode", b.getBranchCode());
            bm.put("branchName", b.getBranchName());
            bm.put("ownerId", b.getOwnerId());
            if (!ownerNames.containsKey(b.getOwnerId())) {
                User o = superAdminDao.getOwnerById(b.getOwnerId());
                ownerNames.put(b.getOwnerId(), o != null ? o.getName() : "Unknown");
            }
            bm.put("ownerName", ownerNames.get(b.getOwnerId()));
            bm.put("city", b.getCity());
            bm.put("state", b.getState());
            bm.put("status", b.isStatus());
            String bLang = (b.getLanguage() != null && !b.getLanguage().trim().isEmpty()) ? b.getLanguage().trim() : "en";
            bm.put("language", bLang);
            bm.put("languageName", languageService.getLanguageName(bLang));
            bm.put("isRtl", languageService.isRtl(bLang));
            bm.put("createdAt", b.getCreatedAt());
            list.add(bm);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("code", 200);
        response.put("data", list);
        return ResponseEntity.ok(response);
    }
}
