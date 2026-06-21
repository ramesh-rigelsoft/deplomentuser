package com.rigel.user.model.dto;

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
import com.rigel.user.model.User;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class OfficeBranchDto  {
	
    private String id;

    private String branchCode;   // Travel, Food, Salary etc.

    @NotBlank(message = "Branch Name is required")
    private String branchName;  // Personal / Business

    @Column(length = 300)
    private String address;

   
    private int ownerId; // reference to the user/owner
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private boolean status;
    private String additionalDetails;
    
 	private User user;
 
}
