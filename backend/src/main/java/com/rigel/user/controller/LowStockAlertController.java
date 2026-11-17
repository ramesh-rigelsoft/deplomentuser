package com.rigel.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rigel.user.model.LowStockAlert;
import com.rigel.user.model.dto.LowStockAlertDto;
import com.rigel.user.service.ILowStockAlertService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/user/low-stock-alert")
@Tag(name = "Low Stock Alert API", description = "Endpoints for managing Low Stock Alert thresholds")
public class LowStockAlertController {

    private static final Logger logger = LoggerFactory.getLogger(LowStockAlertController.class);

    @Autowired
    private ILowStockAlertService lowStockAlertService;

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveAlert(@RequestBody LowStockAlertDto dto) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        try {
            LowStockAlert saved = lowStockAlertService.saveAlert(dto);
            data.put("alert", saved);
            response.put("status", "OK");
            response.put("code", "200");
            response.put("message", dto.getId() != null && dto.getId() > 0 ? "Low stock alert updated successfully." : "Low stock alert created successfully.");
            response.put("data", data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error saving low stock alert", e);
            response.put("status", "ERROR");
            response.put("code", "400");
            response.put("message", e.getMessage() != null ? e.getMessage() : "Failed to save low stock alert");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> getAlerts(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        try {
            Object ownerIdObj = request.get("ownerId");
            if (ownerIdObj == null) {
                response.put("status", "ERROR");
                response.put("code", "400");
                response.put("message", "ownerId is required");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            Integer ownerId = Integer.parseInt(ownerIdObj.toString());
            String branchCode = request.get("branchCode") != null ? request.get("branchCode").toString() : null;

            List<LowStockAlert> alerts = lowStockAlertService.getAlerts(ownerId, branchCode);
            data.put("alerts", alerts);
            response.put("status", "OK");
            response.put("code", "200");
            response.put("message", "Low stock alerts fetched successfully.");
            response.put("data", data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching low stock alerts", e);
            response.put("status", "ERROR");
            response.put("code", "400");
            response.put("message", e.getMessage() != null ? e.getMessage() : "Failed to fetch low stock alerts");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        try {
            Object idObj = request.get("id");
            Object statusObj = request.get("status");

            if (idObj == null || statusObj == null) {
                response.put("status", "ERROR");
                response.put("code", "400");
                response.put("message", "id and status are required");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            Long id = Long.parseLong(idObj.toString());
            boolean status = Boolean.parseBoolean(statusObj.toString());

            boolean updated = lowStockAlertService.updateStatus(id, status);
            data.put("updated", updated);
            response.put("status", "OK");
            response.put("code", "200");
            response.put("message", status ? "Low stock alert activated successfully." : "Low stock alert deactivated successfully.");
            response.put("data", data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error updating low stock alert status", e);
            response.put("status", "ERROR");
            response.put("code", "400");
            response.put("message", e.getMessage() != null ? e.getMessage() : "Failed to update alert status");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteAlert(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        try {
            Object idObj = request.get("id");
            if (idObj == null) {
                response.put("status", "ERROR");
                response.put("code", "400");
                response.put("message", "id is required");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            Long id = Long.parseLong(idObj.toString());
            boolean deleted = lowStockAlertService.deleteAlert(id);
            data.put("deleted", deleted);
            response.put("status", "OK");
            response.put("code", "200");
            response.put("message", "Low stock alert deleted successfully.");
            response.put("data", data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting low stock alert", e);
            response.put("status", "ERROR");
            response.put("code", "400");
            response.put("message", e.getMessage() != null ? e.getMessage() : "Failed to delete low stock alert");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}
