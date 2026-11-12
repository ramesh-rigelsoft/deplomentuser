package com.rigel.user.superadmin.controller;

import com.rigel.user.superadmin.dto.SuperAdminPageResponse;
import com.rigel.user.superadmin.dto.SuperAdminUserDto;
import com.rigel.user.superadmin.service.ISuperAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/super-admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SuperAdminUserController {

    @Autowired
    private ISuperAdminService superAdminService;

    @GetMapping
    public ResponseEntity<SuperAdminPageResponse<SuperAdminUserDto>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer adminId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(superAdminService.getUsers(search, status, adminId, page, size));
    }
}
