package com.rigel.user.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminSubscriptionDto {
    private Integer id;
    private Integer ownerId;
    private String adminName;
    private String adminEmail;
    private String adminMobile;

    private String subscriptionName;
    private String subscriptionCode;
    private String subscriptionType; // MONTHLY, YEARLY, etc.
    private Double amountPerMonth;
    private Integer month;
    private Double gst;
    private Double totalAmount;

    private LocalDateTime createdAt;
    private LocalDateTime subscriptionStartAt;
    private LocalDateTime subscriptionEndAt;
    private Integer subscriptionDuration;
    private boolean active;
    private boolean status;
    private String subscriptionStatus; // ACTIVE, EXPIRED

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String paymentStatus;
}
