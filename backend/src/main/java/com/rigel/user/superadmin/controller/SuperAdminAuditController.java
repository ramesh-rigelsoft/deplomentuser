package com.rigel.user.superadmin.controller;

import com.rigel.user.superadmin.dto.SuperAdminPageResponse;
import com.rigel.user.superadmin.model.SuperAdminAuditLog;
import com.rigel.user.superadmin.service.ISuperAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/super-admin/audit-logs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SuperAdminAuditController {

    @Autowired
    private ISuperAdminService superAdminService;

    @GetMapping
    public ResponseEntity<SuperAdminPageResponse<SuperAdminAuditLog>> getAuditLogs(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(superAdminService.getAuditLogs(page, size));
    }
}
