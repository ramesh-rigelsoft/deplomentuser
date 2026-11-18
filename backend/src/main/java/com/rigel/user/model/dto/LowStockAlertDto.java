package com.rigel.user.model.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

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
public class LowStockAlertDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private Integer ownerId;
    private String branchCode;
    private String brand;
    private String categoryType;
    private String model;
    private String skuCode;
    private Integer minimumStockCount;
    private Boolean status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
