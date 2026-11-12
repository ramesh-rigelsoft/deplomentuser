package com.rigel.user.superadmin.controller;

import com.rigel.user.superadmin.dto.SuperAdminAdminDto;
import com.rigel.user.superadmin.dto.SuperAdminPageResponse;
import com.rigel.user.superadmin.dto.SuperAdminStatusUpdateRequest;
import com.rigel.user.superadmin.service.ISuperAdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/super-admin/admins")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SuperAdminAdminController {

    @Autowired
    private ISuperAdminService superAdminService;

    @GetMapping
    public ResponseEntity<SuperAdminPageResponse<SuperAdminAdminDto>> getAdmins(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false, defaultValue = "ALL") String planCode,
            @RequestParam(required = false, defaultValue = "ALL") String billingType,
            @RequestParam(required = false, defaultValue = "ALL") String subStatus,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(superAdminService.getAdmins(search, status, planCode, billingType, subStatus, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(superAdminService.getAdminById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> toggleAdminStatus(
            @PathVariable int id,
            @RequestBody SuperAdminStatusUpdateRequest statusRequest,
            HttpServletRequest request
    ) {
        try {
            int targetStatus = statusRequest.getStatusAsInteger();
            SuperAdminAdminDto updated = superAdminService.toggleAdminStatus(id, targetStatus, statusRequest.getReason(), request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

