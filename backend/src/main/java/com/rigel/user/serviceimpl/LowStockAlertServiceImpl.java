package com.rigel.user.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.ILowStockAlertDao;
import com.rigel.user.model.LowStockAlert;
import com.rigel.user.model.dto.LowStockAlertDto;
import com.rigel.user.service.ILowStockAlertService;

@Service
public class LowStockAlertServiceImpl implements ILowStockAlertService {

    @Autowired
    private ILowStockAlertDao lowStockAlertDao;

    @Override
    public LowStockAlert saveAlert(LowStockAlertDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Low stock alert data is required");
        }
        if (dto.getOwnerId() == null) {
            throw new IllegalArgumentException("Owner ID is required");
        }
        if (dto.getBranchCode() == null || dto.getBranchCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Branch code is required");
        }
        if (dto.getCategoryType() == null || dto.getCategoryType().trim().isEmpty()) {
            throw new IllegalArgumentException("Category type is required");
        }
        if (dto.getBrand() == null || dto.getBrand().trim().isEmpty()) {
            throw new IllegalArgumentException("Brand is required");
        }
        if (dto.getModel() == null || dto.getModel().trim().isEmpty()) {
            dto.setModel("All Models");
        }
        if (dto.getMinimumStockCount() == null || dto.getMinimumStockCount() < 0) {
            dto.setMinimumStockCount(0);
        }

        LowStockAlert alert;
        if (dto.getId() != null && dto.getId() > 0) {
            alert = lowStockAlertDao.findById(dto.getId());
            if (alert == null) {
                alert = new LowStockAlert();
            }
        } else {
            alert = new LowStockAlert();
        }

        alert.setOwnerId(dto.getOwnerId());
        alert.setBranchCode(dto.getBranchCode().trim());
        alert.setCategoryType(dto.getCategoryType().trim());
        alert.setBrand(dto.getBrand().trim());
        alert.setModel(dto.getModel().trim());
        alert.setMinimumStockCount(dto.getMinimumStockCount());
        if (dto.getStatus() != null) {
            alert.setStatus(dto.getStatus());
        } else if (alert.getStatus() == null) {
            alert.setStatus(true);
        }

        return lowStockAlertDao.save(alert);
    }

    @Override
    public LowStockAlert findById(Long id) {
        return lowStockAlertDao.findById(id);
    }

    @Override
    public List<LowStockAlert> getAlerts(Integer ownerId, String branchCode) {
        if (ownerId == null) {
            throw new IllegalArgumentException("Owner ID is required");
        }
        return lowStockAlertDao.findByOwnerAndBranch(ownerId, branchCode);
    }

    @Override
    public boolean updateStatus(Long id, boolean status) {
        if (id == null) {
            throw new IllegalArgumentException("Alert ID is required");
        }
        return lowStockAlertDao.updateStatus(id, status);
    }

    @Override
    public boolean deleteAlert(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Alert ID is required");
        }
        return lowStockAlertDao.delete(id);
    }
}
