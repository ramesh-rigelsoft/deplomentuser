package com.rigel.user.service;

import java.util.List;
import com.rigel.user.model.BranchCategory;
import com.rigel.user.model.dto.BranchCategoryDto;

public interface IBranchCategoryService {

    List<BranchCategory> saveCategories(BranchCategoryDto dto);

    List<BranchCategory> getCategories(Integer ownerId, String branchCode);

    boolean deleteCategory(Long id);

    int deleteByBranch(Integer ownerId, String branchCode);
}
