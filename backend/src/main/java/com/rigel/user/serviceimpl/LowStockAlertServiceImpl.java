package com.rigel.user.serviceimpl;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rigel.user.dao.ILowStockAlertDao;
import com.rigel.user.model.LowStockAlert;
import com.rigel.user.model.dto.LowStockAlertDto;
import com.rigel.user.service.ILowStockAlertService;

import jakarta.annotation.PostConstruct;

@Service
public class LowStockAlertServiceImpl implements ILowStockAlertService {

    private static final Logger logger = LoggerFactory.getLogger(LowStockAlertServiceImpl.class);

    @Autowired
    private ILowStockAlertDao lowStockAlertDao;

    private final Map<String, String> categoryIdMap = new ConcurrentHashMap<>();

    private static String normalizeName(String name) {
        if (name == null) return "";
        return name.trim().toLowerCase().replaceAll("[\\s\\-_]+", "");
    }

    @PostConstruct
    public void initDeviceCategories() {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("device.json")) {
            if (is != null) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(is);
                JsonNode categories = root.get("categories");
                if (categories != null && categories.isArray()) {
                    for (JsonNode cat : categories) {
                        JsonNode items = cat.get("items");
                        if (items != null && items.isArray()) {
                            for (JsonNode item : items) {
                                JsonNode nameNode = item.get("name");
                                JsonNode idNode = item.get("id");
                                if (nameNode != null && idNode != null) {
                                    String rawName = nameNode.asText().trim().toLowerCase();
                                    String idVal = idNode.asText().trim();
                                    categoryIdMap.put(rawName, idVal);
                                    categoryIdMap.put(normalizeName(rawName), idVal);
                                }
                            }
                        }
                    }
                }
                logger.info("Loaded {} device category items from device.json for SKU code generation", categoryIdMap.size());
            } else {
                logger.warn("device.json not found in classpath");
            }
        } catch (Exception e) {
            logger.error("Failed to load device.json for SKU code generation", e);
        }
    }

    public String resolveSkuCode(String brand, String categoryType, String providedSku) {
        if (providedSku != null && !providedSku.trim().isEmpty()) {
            return providedSku.trim();
        }
        String id = null;
        if (categoryType != null) {
            id = categoryIdMap.get(categoryType.trim().toLowerCase());
            if (id == null || id.isEmpty()) {
                id = categoryIdMap.get(normalizeName(categoryType));
            }
        }
        if (id == null || id.isEmpty()) {
            id = "97";
        }
        String b = (brand != null && !brand.trim().isEmpty()) ? brand.trim() : "Unknown";
        return b + "|" + id;
    }

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

        String skuCode = resolveSkuCode(dto.getBrand(), dto.getCategoryType(), dto.getSkuCode());
        alert.setSkuCode(skuCode);

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
