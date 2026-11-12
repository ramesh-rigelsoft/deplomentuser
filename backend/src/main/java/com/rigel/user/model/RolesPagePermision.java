package com.rigel.user.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(
    name = "roles_page_permision",

    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_page_role_owner_branch",
            columnNames = {
                "pageId",
                "roleId",
                "branchCode",
                "owner_id"
            }
        )
    },

    indexes = {
        @Index(
            name = "idx_roles_permission_branch",
            columnList = "branchCode"
        ),
        @Index(
            name = "idx_roles_permission_owner_branch",
            columnList = "owner_id, branchCode"
        )
    }
)
@Getter
@Setter
@ToString
public class RolesPagePermision implements Serializable {

    private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(length = 36, updatable = false, nullable = false)
	private String id;

    @Column(name = "canAll")
    private boolean canAll;

    @Column(name = "can_view")
    private boolean canView;

    @Column(name = "can_create")
    private boolean canCreate;

    @Column(name = "can_edit")
    private boolean canEdit;

    @Column(name = "can_delete")
    private boolean canDelete;

    @Column(name = "owner_id")
    private int ownerId;

    @Column(name = "branchCode")
    private String branchCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pageId")
    @JsonBackReference(value = "pageId")
    private Pages pageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roleId")
    @JsonBackReference(value = "roleId")
    private Roles roleId;
}
