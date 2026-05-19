package com.rigel.user.model;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

import jakarta.persistence.Column;
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


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
@Table(name="user_otp")
public class UserOtp implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -7016888389920150869L;
	/// its not be Serialize
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(length = 36, updatable = false, nullable = false)
	private String id;
	
//	@Pattern(regexp = "^[0-9]{10,10}$",message="Enter valid mobile number") 
	private String mobile_no;

	private String emailId;
	
//	@NotBlank(message = "Password is mandatory")
	private String otp;
	
	private int status;// 1-active,2-InActive,3-delete
	private LocalDateTime created_at;
	
	private LocalDateTime expaire_at;
	
	private String softwareType;
	
	private int userId;
	
    
	
}

