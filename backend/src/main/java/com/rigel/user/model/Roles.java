package com.rigel.user.model;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Roles implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role", nullable = false)
    private String role;
    
    @Column(name = "role_name", nullable = false)
    private String roleName;
    
    @OneToMany(mappedBy = "roleId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference(value = "roleId")
	private Set<RolesPagePermision> rolesPagePermision = new HashSet<>();
    
//	@ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
//	@JoinColumn(name="user_id")
//	@JsonBackReference
//	private User user_id;

}
