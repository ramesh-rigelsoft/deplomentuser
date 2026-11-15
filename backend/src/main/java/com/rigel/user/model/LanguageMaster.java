package com.rigel.user.model;

import java.io.Serializable;
import java.time.LocalDateTime;

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

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "language_master")
public class LanguageMaster implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "language_code", length = 10, unique = true, nullable = false)
    private String languageCode;

    @Column(name = "language_name", length = 50, nullable = false)
    private String languageName;

    @Column(name = "native_name", length = 100, nullable = false)
    private String nativeName;

    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;

    @Column(name = "is_rtl")
    @Builder.Default
    private boolean rtl = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
