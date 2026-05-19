package com.rigel.user.model;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="login_activity")
@Entity
public class LoginActivity implements Serializable {

	 private static final long serialVersionUID = -7016888344920150869L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
 
    private int userId;
    private String emailId;
    private String mobileNumber;
    private LocalDateTime loginAt;
    private String requestIp;
    private String macAddress;
    @Lob
    @Column(name = "token", columnDefinition = "text")
    private String token;  // JSON string में store करें

    
    @Lob
    @Column(name = "user_object")
    private byte[] userObject;  // या JSON string

}