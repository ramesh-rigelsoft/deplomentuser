package com.rigel.user.superadmin.controller;

import com.rigel.user.superadmin.dto.SuperAdminDashboardStatsDto;
import com.rigel.user.superadmin.service.ISuperAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/super-admin/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SuperAdminDashboardController {

    @Autowired
    private ISuperAdminService superAdminService;

    @GetMapping("/stats")
    public ResponseEntity<SuperAdminDashboardStatsDto> getStats(
            @RequestParam(required = false, defaultValue = "THIS_MONTH") String filter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        SuperAdminDashboardStatsDto stats = superAdminService.getDashboardStats(filter, fromDate, toDate);
        return ResponseEntity.ok(stats);
    }
}

