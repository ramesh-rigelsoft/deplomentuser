package com.rigel.user.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.IBranchCategoryDao;
import com.rigel.user.model.BranchCategory;
import com.rigel.user.model.dto.BranchCategoryDto;
import com.rigel.user.service.IBranchCategoryService;

@Service
public class BranchCategoryServiceImpl implements IBranchCategoryService {

    @Autowired
    private IBranchCategoryDao branchCategoryDao;

    @Override
    public List<BranchCategory> saveCategories(BranchCategoryDto dto) {
        if (dto.getOwnerId() == null) {
            throw new IllegalArgumentException("Owner ID is required");
        }
        if (dto.getBranchCode() == null || dto.getBranchCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Branch Code is required");
        }
        if (dto.getCategory() == null || dto.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Category is required");
        }

        List<BranchCategory> savedList = new ArrayList<>();

        // If batch items provided
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (BranchCategoryDto.CategoryItemDto item : dto.getItems()) {
                if (item.getCategoryType() == null || item.getCategoryType().trim().isEmpty()) {
                    continue;
                }
                // Check if already exists
                boolean exists = branchCategoryDao.exists(
                        dto.getOwnerId(),
                        dto.getBranchCode(),
                        dto.getCategory(),
                        item.getCategoryType()
                );
                if (!exists) {
                    BranchCategory entity = BranchCategory.builder()
                            .ownerId(dto.getOwnerId())
                            .branchId(dto.getBranchId())
                            .branchCode(dto.getBranchCode().trim())
                            .category(dto.getCategory().trim())
                            .categoryType(item.getCategoryType().trim())
                            .hsn(item.getHsn())
                            .gst(item.getGst())
                            .status(dto.getStatus() != null ? dto.getStatus() : true)
                            .build();
                    savedList.add(branchCategoryDao.save(entity));
                }
            }
        } else if (dto.getCategoryType() != null && !dto.getCategoryType().trim().isEmpty()) {
            // Single item save
            boolean exists = branchCategoryDao.exists(
                    dto.getOwnerId(),
                    dto.getBranchCode(),
                    dto.getCategory(),
                    dto.getCategoryType()
            );
            if (!exists) {
                BranchCategory entity = BranchCategory.builder()
                        .ownerId(dto.getOwnerId())
                        .branchId(dto.getBranchId())
                        .branchCode(dto.getBranchCode().trim())
                        .category(dto.getCategory().trim())
                        .categoryType(dto.getCategoryType().trim())
                        .hsn(dto.getHsn())
                        .gst(dto.getGst())
                        .status(dto.getStatus() != null ? dto.getStatus() : true)
                        .build();
                savedList.add(branchCategoryDao.save(entity));
            }
        }

        return savedList;
    }

    @Override
    public List<BranchCategory> getCategories(Integer ownerId, String branchCode) {
        if (ownerId == null) {
            throw new IllegalArgumentException("Owner ID is required");
        }
        return branchCategoryDao.findByOwnerAndBranch(ownerId, branchCode);
    }

    @Override
    public boolean deleteCategory(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID is required");
        }
        return branchCategoryDao.delete(id);
    }

    @Override
    public int deleteByBranch(Integer ownerId, String branchCode) {
        if (ownerId == null || branchCode == null || branchCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Owner ID and Branch Code are required");
        }
        return branchCategoryDao.deleteByBranch(ownerId, branchCode);
    }
}
