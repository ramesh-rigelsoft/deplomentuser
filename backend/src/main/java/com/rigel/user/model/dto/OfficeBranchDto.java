package com.rigel.user.model.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
//@ToString
public class OfficeBranchDto  {
	
    private String id;

    private String branchCode;   // Travel, Food, Salary etc.

    @NotNull(message = "Branch Name is required")
    private String branchName;  // Personal / Business

    @Column(length = 300)
    @NotNull(message = "Branch Name is required")
    private String address;
   
    private int ownerId; // reference to the user/owner
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private boolean status;
    private String additionalDetails;
    
    // company info
    @NotNull(message = "ShopType is required")
    private String shopType;

	private String gstNumber;
	private String panNumber;
	private String cinNumber;
	
	private String ofcLat;
	private String ofcLng;
	private Integer centerRedious;

    @NotNull(message = "City Name is required")
	private String city;
    
    @NotNull(message = "State Name is required")
	private String state;
    
    @NotNull(message = "Pincode is required")
	private String pincode;
	
    @JsonProperty(access = Access.WRITE_ONLY)
	private MultipartFile logo;
 
}
