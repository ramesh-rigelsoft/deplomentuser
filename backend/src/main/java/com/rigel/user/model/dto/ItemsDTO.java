package com.rigel.user.model.dto;


import lombok.Data;

@Data
public class ItemsDTO {

    private Long id;

    private String itemCode;
    private String category;
    private String categoryType;
    private String itemType;
    private String measureType;
    private String brand;
    private String modelName;

    private String ram;
    private String ramUnit;

    private String storage;
    private String storageUnit;

    private Integer quantity;
    private Double initialPrice;
    private Double sellingPrice;

    private String image;

    private Integer status;

    private Long createdAt;

    private String subOwnerId;
}
