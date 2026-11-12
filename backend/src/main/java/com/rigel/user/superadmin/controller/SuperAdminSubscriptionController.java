package com.rigel.user.superadmin.controller;

import com.rigel.user.superadmin.dto.SuperAdminPageResponse;
import com.rigel.user.superadmin.dto.SuperAdminSubscriptionDto;
import com.rigel.user.superadmin.service.ISuperAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/super-admin/subscriptions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SuperAdminSubscriptionController {

    @Autowired
    private ISuperAdminService superAdminService;

    @GetMapping
    public ResponseEntity<SuperAdminPageResponse<SuperAdminSubscriptionDto>> getSubscriptions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String billingType,
            @RequestParam(required = false, defaultValue = "ALL") String subStatus,
            @RequestParam(required = false, defaultValue = "ALL") String payStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(superAdminService.getSubscriptions(search, billingType, subStatus, payStatus, fromDate, toDate, page, size));
    }

    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> getSubscriptionReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(superAdminService.getSubscriptionReport(fromDate, toDate));
    }
}
