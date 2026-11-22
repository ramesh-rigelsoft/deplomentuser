package com.rigel.user.model.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchCategoryDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private Integer ownerId;
    private String branchId;
    private String branchCode;
    private String category;
    private String categoryType;
    private String hsn;
    private String gst;
    private Boolean status;

    // For batch additions
    private List<CategoryItemDto> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryItemDto implements Serializable {
        private static final long serialVersionUID = 1L;
        private String categoryType;
        private String hsn;
        private String gst;
    }
}
