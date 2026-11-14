package com.rigel.user.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "super_admin_audit_log")
public class SuperAdminAuditLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String adminUsername;

    private String action; // LOGIN, LOGOUT, CREATE_PLAN, UPDATE_PLAN, ACTIVATE_PLAN, DEACTIVATE_PLAN

    private String entityType; // SUBSCRIPTION_PLAN, OWNER, AUTH, PAYMENT

    private String entityId;

    @Column(length = 2000)
    private String details;

    private String ipAddress;

    private LocalDateTime createdAt;
}
