package com.rigel.user.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.Builder.Default;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "OFFICE_BRANCH")
public class OfficeBranch implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(length = 36, updatable = false, nullable = false)
	private String id;

	@NotBlank(message = "branchCode is required")
	private String branchCode; // Travel, Food, Salary etc.

	@NotBlank(message = "branchName is required")
	private String branchName; // Personal / Business

	@Column(length = 500)
	private String address;

	@Column(name = "ownerId", insertable = true, updatable = false)
	private int ownerId; // reference to the user/owner

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	private boolean status;
	private String additionalDetails;

	private String branchLogo;

	// ================= COMPANY INFO =================
	private String shopType;

	private String gstNumber;
	private String panNumber;
	private String cinNumber;
	
	private String ofcLat;
	private String ofcLng;
	private Integer centerRedious;
	
	private String city;
	private String state;
	private String pincode;

}
