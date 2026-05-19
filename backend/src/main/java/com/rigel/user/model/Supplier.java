package com.rigel.user.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.Builder.Default;

import java.io.Serializable;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "supplier")
public class Supplier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36, updatable = false, nullable = false)
    private String id;

    @NotBlank(message = "Supplier name is required")
    @Column(nullable = false)
    private String supplierName;

    @Column(length = 15)
    private String gstNumber;

    @Column(length = 10)
    private String panNumber;
    
    private String pinCode;

    @Email(message = "Invalid email format")
    @Column(length = 100)
    private String email;

//    @Pattern(regexp = "^[0-9]{12}$", message = "Phone must be 10 digits")
//    @Column(length = 10)
    private String phone;

    @Column(length = 500)
    private String address;
    
    @Default
    private String status="Active";
    
    private String district;
    
    private int ownerId; // optional if multi-user system

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

