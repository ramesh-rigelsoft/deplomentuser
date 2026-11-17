package com.rigel.user.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "low_stock_alert", indexes = {
    @Index(name = "idx_low_stock_alert_owner_id", columnList = "owner_id"),
    @Index(name = "idx_low_stock_alert_branch_code", columnList = "branch_code")
})
public class LowStockAlert implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_id", nullable = false)
    private Integer ownerId;

    @Column(name = "branch_code", nullable = false, length = 255)
    private String branchCode;

    @Column(name = "brand", nullable = false, length = 255)
    private String brand;

    @Column(name = "category_type", nullable = false, length = 255)
    private String categoryType;

    @Column(name = "model", nullable = false, length = 255)
    private String model;

    @Column(name = "minimum_stock_count", nullable = false)
    @Builder.Default
    private Integer minimumStockCount = 0;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private Boolean status = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = true;
        }
        if (this.minimumStockCount == null) {
            this.minimumStockCount = 0;
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
