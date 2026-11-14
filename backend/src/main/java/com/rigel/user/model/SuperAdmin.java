package com.rigel.user.model;

import java.io.Serializable;
import java.sql.Timestamp;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "super_admin")
public class SuperAdmin implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;

    @Builder.Default
    private String role = "SUPERADMIN";

    @Builder.Default
    private int status = 1; // 1-active, 0-inactive

    private Timestamp createdAt;

    private Timestamp lastLogin;

    public static PasswordEncoder getPasswordEncoder() {
        return PASSWORD_ENCODER;
    }
}
