package com.rigel.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.rigel.user.dao.ISuperAdminDao;
import com.rigel.user.exception.BadGatewayRequest;
import com.rigel.user.exception.TaskTitleException;
import com.rigel.user.exception.TaskTitleNotFound;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.SuperAdmin;
import com.rigel.user.security.JwtTokenUtil;
import com.rigel.user.serviceimpl.SuperAdminServiceImpl;

public class SuperAdminServiceTest {

    private ISuperAdminDao superAdminDao;
    private JwtTokenUtil jwtTokenUtil;
    private IRazorpayService razorpayService;
    private SuperAdminServiceImpl superAdminService;

    @BeforeEach
    public void setup() {
        superAdminDao = mock(ISuperAdminDao.class);
        jwtTokenUtil = mock(JwtTokenUtil.class);
        razorpayService = mock(IRazorpayService.class);

        superAdminService = new SuperAdminServiceImpl();
        ReflectionTestUtils.setField(superAdminService, "superAdminDao", superAdminDao);
        ReflectionTestUtils.setField(superAdminService, "jwtTokenUtil", jwtTokenUtil);
        ReflectionTestUtils.setField(superAdminService, "razorpayService", razorpayService);
    }

    @Test
    public void testLoginValidationEmptyUsername() {
        assertThrows(BadGatewayRequest.class, () -> {
            superAdminService.login("", "password", null);
        });
    }

    @Test
    public void testLoginNotFound() {
        when(superAdminDao.findByUsername("unknown")).thenReturn(null);
        when(superAdminDao.findByEmail("unknown")).thenReturn(null);

        assertThrows(TaskTitleNotFound.class, () -> {
            superAdminService.login("unknown", "password", null);
        });
    }

    @Test
    public void testLoginWrongPassword() {
        SuperAdmin admin = SuperAdmin.builder()
                .id(1)
                .username("superadmin")
                .password(SuperAdmin.PASSWORD_ENCODER.encode("CorrectPassword"))
                .status(1)
                .build();
        when(superAdminDao.findByUsername("superadmin")).thenReturn(admin);

        assertThrows(TaskTitleException.class, () -> {
            superAdminService.login("superadmin", "WrongPassword", null);
        });
    }

    @Test
    public void testLoginSuccess() {
        SuperAdmin admin = SuperAdmin.builder()
                .id(1)
                .username("superadmin")
                .email("superadmin@rigelsoft.com")
                .name("Super Admin")
                .password(SuperAdmin.PASSWORD_ENCODER.encode("SuperAdmin@123"))
                .role("SUPERADMIN")
                .status(1)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
        when(superAdminDao.findByUsername("superadmin")).thenReturn(admin);
        when(jwtTokenUtil.generateToken(any(), any())).thenReturn("mock.jwt.token");

        Map<String, Object> result = superAdminService.login("superadmin", "SuperAdmin@123", null);

        assertNotNull(result);
        assertEquals("mock.jwt.token", result.get("token"));
        assertEquals("superadmin", result.get("username"));
        assertEquals("SUPERADMIN", result.get("role"));
    }

    @Test
    public void testCreatePlanSuccess() {
        SubscriptionPlan plan = SubscriptionPlan.builder()
                .subscriptionName("Standard")
                .subscriptionCode("STD01")
                .amountPerMonth(500.0)
                .month(12)
                .build();

        when(superAdminDao.getPlanByCode("STD01")).thenReturn(null);
        when(superAdminDao.savePlan(any(SubscriptionPlan.class))).thenAnswer(i -> {
            SubscriptionPlan p = i.getArgument(0);
            p.setId(10);
            return p;
        });

        SubscriptionPlan created = superAdminService.createPlan(plan, "superadmin");
        assertNotNull(created);
        assertEquals(10, created.getId());
        assertEquals(true, created.isStatus());
        assertNotNull(created.getGst());
    }

    @Test
    public void testTogglePlanStatus() {
        SubscriptionPlan plan = SubscriptionPlan.builder()
                .id(5)
                .subscriptionName("Basic")
                .subscriptionCode("BAS01")
                .status(true)
                .build();
        when(superAdminDao.getPlanById(5)).thenReturn(plan);

        boolean toggled = superAdminService.togglePlanStatus(5, false, "superadmin");
        assertTrue(toggled);
        assertFalse(plan.isStatus());
    }
}
