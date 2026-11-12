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
public class SuperAdminPlanDto {
    private Integer id;
    private String subscriptionName;
    private String description;
    private String subscriptionCode;
    private String subscriptionType; // MONTHLY, YEARLY, Quarterly, HalfYearly
    private Double amountPerMonth;
    private Integer month;
    private Double gst;
    private Double totalAmount;
    private String proof;
    private Boolean isMultipleBranch;
    private Integer perBranchUser;
    private Integer branchCount;
    private Boolean isMultipleUser;
    private Integer userCount;
    private Boolean status; // true=ACTIVE, false=INACTIVE
    private String permissions;

    private Boolean isRepaireAllow;
    private Boolean isSalesAllow;
    private Boolean isEmployeeAllow;
    private Integer perDayRepaireCount;
    private Integer perDayMobileSmartDevicesSalesCount;
    private Integer perDayComputerLaptopSalesCount;
    private Integer perDayNormalTypeSalesCount;

    private Boolean isReplaceItem;
    private Boolean isReturnItem;
    private Boolean isDownloadInvoice;
    private Boolean isfilterInventory;
    private Boolean isfilterSales;
    private Boolean isDownloadExcelSales;
    private Boolean isDownloadExcelEntryItem;
    private Integer SUKCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Computed subscriber count
    private Long activeSubscriberCount;
    private Long totalSubscriberCount;
}

