package com.rigel.user.model.dto;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UserDto {
	
	private Integer id;
	
	private String name;
	
	@Email
	@NotBlank(message = "Email is mandatory")
	private String email_id;
	
	@Pattern(regexp = "^[0-9]{10,10}$",message="Enter valid mobile number") 
	private String mobile_no;
	
	@Pattern(regexp = "^[0-9]{1,3}$",message="Enter valid contry code") 
	private String country_code;
	
//	@NotBlank(message = "Password is mandatory")
	private String password;
	
	private int status;// 1-active,2-InActive,3-delete
	private Timestamp created_at;
	private String role;// 1- admin,2-user
	
	private String gender;
	private Date lastPasswordResetDate;
	private int branchCount;
	
    
    // ================= RELATION =================
    
    private int ownerId;
    private String branchCode;
    private String branchName;
    

    private MultipartFile profilePhoto;
}

