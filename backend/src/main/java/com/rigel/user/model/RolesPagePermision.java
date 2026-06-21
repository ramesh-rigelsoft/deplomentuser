package com.rigel.user.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(
	    name = "roles_page_permision",
	    uniqueConstraints = {
	        @UniqueConstraint(
	            name = "uk_page_role_owner",
	            columnNames = {"pageId", "roleId", "owner_id"}
	        )
	    }
	)
@Getter
@Setter
@ToString
public class RolesPagePermision implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
 // ===== BASIC PAGE ACCESS =====
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
 	
 	private int ownerId;
 	
 	@ManyToOne(fetch = FetchType.LAZY)
 	@JoinColumn(name="pageId")
 	@JsonBackReference(value = "pageId")
 	private Pages pageId;

 	@ManyToOne(fetch = FetchType.LAZY)
 	@JoinColumn(name="roleId")
 	@JsonBackReference(value = "roleId")
 	private Roles roleId;
 	
// 	@ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
//	@JoinColumn(name="pageId")
//	@JsonBackReference(value = "pageId")
//	private Pages pageId;
//    
//    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
//	@JoinColumn(name="roleId")
//    @JsonBackReference(value = "roleId")
//	private Roles roleId;
}
