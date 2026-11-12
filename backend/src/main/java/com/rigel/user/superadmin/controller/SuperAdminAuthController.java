package com.rigel.user.superadmin.controller;

import com.rigel.user.superadmin.dto.SuperAdminLoginRequest;
import com.rigel.user.superadmin.service.ISuperAdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/super-admin/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SuperAdminAuthController {

    @Autowired
    private ISuperAdminService superAdminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody SuperAdminLoginRequest loginRequest, HttpServletRequest request) {
        try {
            Map<String, Object> result = superAdminService.login(loginRequest, request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Authentication failed: " + e.getMessage()));
        }
    }
}
