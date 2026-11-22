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
import jakarta.persistence.UniqueConstraint;
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
@Table(name = "branch_category", indexes = {
    @Index(name = "idx_branch_cat_owner_id", columnList = "owner_id"),
    @Index(name = "idx_branch_cat_branch_code", columnList = "branch_code"),
    @Index(name = "idx_branch_cat_category", columnList = "category")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_branch_cat_item", columnNames = {"owner_id", "branch_code", "category", "category_type"})
})
public class BranchCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_id", nullable = false)
    private Integer ownerId;

    @Column(name = "branch_id", length = 100)
    private String branchId;

    @Column(name = "branch_code", nullable = false, length = 100)
    private String branchCode;

    @Column(name = "category", nullable = false, length = 255)
    private String category;

    @Column(name = "category_type", nullable = false, length = 255)
    private String categoryType;

    @Column(name = "hsn", length = 50)
    private String hsn;

    @Column(name = "gst", length = 100)
    private String gst;

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
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
