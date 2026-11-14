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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payment_transaction")
public class PaymentTransaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int ownerId;

    private String branchCode;

    private Integer subscriptionId;

    private String subscriptionCode;

    private String subscriptionName;

    @Column(length = 100)
    private String orderId;

    @Column(length = 100)
    private String paymentId;

    private Double amount;

    @Builder.Default
    private String currency = "INR";

    // CREATED, SUCCESS, FAILED, REFUNDED
    private String status;

    @Builder.Default
    private String gateway = "RAZORPAY";

    @Column(length = 2000)
    private String gatewayResponse;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
