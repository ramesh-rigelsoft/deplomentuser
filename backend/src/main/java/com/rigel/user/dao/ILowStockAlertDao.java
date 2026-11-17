package com.rigel.user.dao;

import java.util.List;
import com.rigel.user.model.LowStockAlert;

public interface ILowStockAlertDao {

    LowStockAlert save(LowStockAlert alert);

    LowStockAlert findById(Long id);

    List<LowStockAlert> findByOwner(Integer ownerId);

    List<LowStockAlert> findByOwnerAndBranch(Integer ownerId, String branchCode);

    boolean updateStatus(Long id, boolean status);

    boolean delete(Long id);
}
