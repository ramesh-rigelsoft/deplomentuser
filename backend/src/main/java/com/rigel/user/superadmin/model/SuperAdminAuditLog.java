package com.rigel.user.superadmin.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "super_admin_audit_log")
public class SuperAdminAuditLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer superAdminId;

    private String superAdminEmail;

    @Column(nullable = false, length = 100)
    private String action; // e.g., ACTIVATE_ADMIN, DEACTIVATE_ADMIN, CREATE_PLAN, UPDATE_PLAN, TOGGLE_PLAN_STATUS

    @Column(length = 100)
    private String targetType; // ADMIN, PLAN, SUBSCRIPTION, USER

    private String targetId; // ID or Code of the modified entity

    @Column(columnDefinition = "TEXT")
    private String oldValue;

    @Column(columnDefinition = "TEXT")
    private String newValue;

    @Column(length = 500)
    private String remarks;

    private String ipAddress;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}

