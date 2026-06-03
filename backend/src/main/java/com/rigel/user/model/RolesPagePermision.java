package com.rigel.user.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles_page_permision")
@Getter
@Setter
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
 	
 	@ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
	@JoinColumn(name="pages")
	@JsonBackReference
	private Pages pages;
    
    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
	@JoinColumn(name="roles")
	@JsonBackReference
	private Roles roles;
}
