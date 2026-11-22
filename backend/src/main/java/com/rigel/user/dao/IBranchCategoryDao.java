package com.rigel.user.dao;

import java.util.List;
import com.rigel.user.model.BranchCategory;

public interface IBranchCategoryDao {

    BranchCategory save(BranchCategory entity);

    List<BranchCategory> saveAll(List<BranchCategory> entities);

    BranchCategory findById(Long id);

    List<BranchCategory> findByOwner(Integer ownerId);

    List<BranchCategory> findByOwnerAndBranch(Integer ownerId, String branchCode);

    boolean exists(Integer ownerId, String branchCode, String category, String categoryType);

    boolean delete(Long id);

    int deleteByBranch(Integer ownerId, String branchCode);
}
