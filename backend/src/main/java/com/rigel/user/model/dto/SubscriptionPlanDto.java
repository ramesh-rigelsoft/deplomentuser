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

import com.fasterxml.jackson.annotation.JsonFormat;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class SubscriptionPlanDto{

    private String subscriptionName;
    
    private String subscriptionCode;   // Travel, Food, Salary etc.

    private String subscriptionType;   // Monthaly,Qutarily,HelfYerily,Yerily

    private Double amountPerMonth;
    private int month;
    private Double gst;
    private double totalAmount;

    private String proof;

    private boolean isMultipleBranch;

    private int perBranchUser;
    
    private boolean isMultipleUser;
    
    private int userCount; 
       
    private String permissions;
    private boolean status;
    
    private boolean isReplaceItem;
    private boolean isReturnItem;
    private boolean isDownloadInvoice;
    private boolean isfilterInventory;
    private boolean isfilterSales;
    private boolean isDownloadExcelSales;
    private boolean isDownloadExcelEntryItem;
    private int SUKCount;
      
}

