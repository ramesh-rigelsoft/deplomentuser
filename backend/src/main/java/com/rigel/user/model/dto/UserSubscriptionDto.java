package com.rigel.user.model.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.Builder.Default;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import com.rigel.user.util.PagePermission;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserSubscriptionDto{
	
	private int id;
    
    private int ownerId;
    private String branchCode;
    
    private boolean status;
    
    private boolean active;

    private String subscriptionName;
    
 
    private String subscriptionCode;   // SUB01

    private String subscriptionType;   // Monthaly,Qutarily,HelfYerily,Yerily

    private Double amountPerMonth;
    private int month;
    private Double gst;
    private double totalAmount;

    private String proof;

    private boolean isMultipleBranch;

    private int perBranchUser;
    
    private int branchCount;
    
    private boolean isMultipleUser;
    
    private int userCount; 
    
    private LocalDateTime createdAt;
    
    private LocalDateTime subscriptionStartAt;
    private int subscriptionDuration;
   
    private String permissions;
    
    private boolean isReplaceItem;
    private boolean isReturnItem;
    private boolean isDownloadInvoice;
    private boolean isfilterInventory;
    private boolean isfilterSales;
    private boolean isDownloadExcelSales;
    private boolean isDownloadExcelEntryItem;
    
    private boolean isRepaireAllow;
    private boolean isSalesAllow;
    private boolean isEmployeeAllow;
    
    private int SUKCount;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private String paymentStatus;
}
