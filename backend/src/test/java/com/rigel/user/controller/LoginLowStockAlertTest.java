package com.rigel.user.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.util.ReflectionTestUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rigel.user.model.LoginRequest;
import com.rigel.user.model.LowStockAlert;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.User;
import com.rigel.user.security.JwtTokenUtil;
import com.rigel.user.security.JwtUser;
import com.rigel.user.service.ILanguageService;
import com.rigel.user.service.ILowStockAlertService;
import com.rigel.user.service.IRolesManagementService;
import com.rigel.user.service.ISubscriptionPlanService;
import com.rigel.user.service.IUserService;

public class LoginLowStockAlertTest {

    private UserController userController;
    private IUserService userService;
    private UserDetailsService userDetailsService;
    private JwtTokenUtil jwtTokenUtil;
    private IRolesManagementService rolesManagementService;
    private ISubscriptionPlanService subscriptionPlanService;
    private ILanguageService languageService;
    private ILowStockAlertService lowStockAlertService;

    @BeforeEach
    public void setup() {
        userController = new UserController();
        userService = mock(IUserService.class);
        userDetailsService = mock(UserDetailsService.class);
        jwtTokenUtil = mock(JwtTokenUtil.class);
        rolesManagementService = mock(IRolesManagementService.class);
        subscriptionPlanService = mock(ISubscriptionPlanService.class);
        languageService = mock(ILanguageService.class);
        lowStockAlertService = mock(ILowStockAlertService.class);

        ReflectionTestUtils.setField(userController, "userService", userService);
        ReflectionTestUtils.setField(userController, "userDetailsService", userDetailsService);
        ReflectionTestUtils.setField(userController, "jwtTokenUtil", jwtTokenUtil);
        ReflectionTestUtils.setField(userController, "rolesManagementService", rolesManagementService);
        ReflectionTestUtils.setField(userController, "subscriptionPlanService", subscriptionPlanService);
        ReflectionTestUtils.setField(userController, "languageService", languageService);
        ReflectionTestUtils.setField(userController, "lowStockAlertService", lowStockAlertService);
        ReflectionTestUtils.setField(userController, "objectMapper", new ObjectMapper());
    }

    @Test
    public void testLoginIncludesLowStockAlertList() {
        User user = new User();
        user.setId(1);
        user.setOwnerId(1);
        user.setEmail_id("owner@test.com");
        user.setRole("admin");
        user.setPassword(User.PASSWORD_ENCODER.encode("secret123"));

        when(userService.findUserByEmailId(eq("owner@test.com"), eq(0))).thenReturn(user);

        JwtUser jwtUser = mock(JwtUser.class);
        when(jwtUser.getUsername()).thenReturn("owner@test.com");
        when(userDetailsService.loadUserByUsername(eq("owner@test.com"))).thenReturn(jwtUser);
        when(jwtTokenUtil.generateToken(any(), any())).thenReturn("mock-token-xyz");

        when(rolesManagementService.searchOfficeBranch(any())).thenReturn(Collections.emptyList());
        when(languageService.resolveLanguage(any(), any())).thenReturn(Collections.emptyMap());

        LowStockAlert alert1 = LowStockAlert.builder()
                .id(101L)
                .ownerId(1)
                .branchCode("BR001")
                .categoryType("Smartphone")
                .brand("Apple")
                .model("iPhone 15")
                .minimumStockCount(5)
                .status(true)
                .build();

        when(lowStockAlertService.getAlerts(eq(1), any())).thenReturn(List.of(alert1));

        LoginRequest request = new LoginRequest();
        request.setUsername("owner@test.com");
        request.setPassword("secret123");

        ResponseEntity<Map<String, Object>> response = userController.login(request, null);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());

        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals("OK", body.get("status"));

        Map<String, Object> data = (Map<String, Object>) body.get("data");
        assertNotNull(data);
        assertTrue(data.containsKey("lowStockAlert"), "data should contain lowStockAlert key");
        org.junit.jupiter.api.Assertions.assertFalse(data.containsKey("lowStockAlertList"), "data should NOT contain lowStockAlertList key");

        List<LowStockAlert> alerts = (List<LowStockAlert>) data.get("lowStockAlert");
        assertNotNull(alerts);
        assertEquals(1, alerts.size());
        assertEquals("Apple", alerts.get(0).getBrand());
        assertEquals("iPhone 15", alerts.get(0).getModel());
        assertEquals(5, alerts.get(0).getMinimumStockCount());
    }
}
