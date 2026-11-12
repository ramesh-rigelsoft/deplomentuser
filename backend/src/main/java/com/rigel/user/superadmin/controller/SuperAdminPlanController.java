package com.rigel.user.superadmin.controller;

import com.rigel.user.superadmin.dto.SuperAdminPlanDto;
import com.rigel.user.superadmin.dto.SuperAdminStatusUpdateRequest;
import com.rigel.user.superadmin.service.ISuperAdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/super-admin/plans")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SuperAdminPlanController {

    @Autowired
    private ISuperAdminService superAdminService;

    @GetMapping
    public ResponseEntity<List<SuperAdminPlanDto>> getAllPlans() {
        return ResponseEntity.ok(superAdminService.getAllPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlanById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(superAdminService.getPlanById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createPlan(@RequestBody SuperAdminPlanDto planDto, HttpServletRequest request) {
        try {
            SuperAdminPlanDto created = superAdminService.createPlan(planDto, request);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable int id, @RequestBody SuperAdminPlanDto planDto, HttpServletRequest request) {
        try {
            SuperAdminPlanDto updated = superAdminService.updatePlan(id, planDto, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<?> togglePlanStatus(
            @PathVariable int id,
            @RequestBody(required = false) SuperAdminStatusUpdateRequest statusRequest,
            @RequestParam(required = false) Boolean active,
            HttpServletRequest request
    ) {
        try {
            boolean isActive = false;
            if (active != null) {
                isActive = active;
            } else if (statusRequest != null) {
                isActive = Boolean.TRUE.equals(statusRequest.isEffectiveActive());
            }
            SuperAdminPlanDto updated = superAdminService.togglePlanStatus(id, isActive, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

