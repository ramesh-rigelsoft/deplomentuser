package com.rigel.user.service;

import java.util.List;
import com.rigel.user.model.LowStockAlert;
import com.rigel.user.model.dto.LowStockAlertDto;

public interface ILowStockAlertService {

    LowStockAlert saveAlert(LowStockAlertDto dto);

    LowStockAlert findById(Long id);

    List<LowStockAlert> getAlerts(Integer ownerId, String branchCode);

    boolean updateStatus(Long id, boolean status);

    boolean deleteAlert(Long id);
}
