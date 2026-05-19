package com.rigel.user.model;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.Builder.Default;

@Entity
@Table(
    name = "inventory",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {
            "category",
            "category_type",
            "measure_type",
            "brand",
            "model_name",
            "ram",
            "ram_unit",
            "storage",
            "storage_unit",
            "item_color",
            "owner_id"
        }
    )
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Inventory implements Serializable {

    private static final long serialVersionUID = -7016888389920150869L;

    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    private String itemCode;
    
    private String category;

    private String categoryType;

    private String measureType;

    private String brand;

    private String modelName;

    private String itemCondition;

    private String itemSource;

    private String ram;

    private String ramUnit;

    private String storage;

    private String storageType;

    private String storageUnit;

    private Integer quantity;

    private Double initialPrice;

    private Double sellingPrice;

    private String description;

    private String itemColor;

    private String image;

    private String processor;

    private String operatingSystem;

    private String screenSize;

    private String itemGen;
    
    @Default
    private int ownerId=1;

}
