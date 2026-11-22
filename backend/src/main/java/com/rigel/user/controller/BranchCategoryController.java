package com.rigel.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rigel.user.model.BranchCategory;
import com.rigel.user.model.dto.BranchCategoryDto;
import com.rigel.user.service.IBranchCategoryService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/user/branch-category")
@Tag(name = "Branch Category API", description = "Endpoints for managing branch-wise categories and category types")
public class BranchCategoryController {

    private static final Logger logger = LoggerFactory.getLogger(BranchCategoryController.class);

    @Autowired
    private IBranchCategoryService branchCategoryService;

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveCategories(@RequestBody BranchCategoryDto dto) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        try {
            List<BranchCategory> saved = branchCategoryService.saveCategories(dto);
            data.put("categories", saved);
            data.put("count", saved.size());
            response.put("status", "OK");
            response.put("code", "200");
            response.put("message", saved.size() + " category type(s) saved successfully.");
            response.put("data", data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error saving branch categories", e);
            response.put("status", "ERROR");
            response.put("code", "400");
            response.put("message", e.getMessage() != null ? e.getMessage() : "Failed to save branch categories");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> getCategories(@RequestBody Map<String, Object> request) {
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

            List<BranchCategory> list = branchCategoryService.getCategories(ownerId, branchCode);
            data.put("categories", list);
            response.put("status", "OK");
            response.put("code", "200");
            response.put("message", "Branch categories fetched successfully.");
            response.put("data", data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching branch categories", e);
            response.put("status", "ERROR");
            response.put("code", "400");
            response.put("message", e.getMessage() != null ? e.getMessage() : "Failed to fetch branch categories");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteCategory(@RequestBody Map<String, Object> request) {
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
            boolean deleted = branchCategoryService.deleteCategory(id);
            data.put("deleted", deleted);
            response.put("status", "OK");
            response.put("code", "200");
            response.put("message", "Category deleted successfully.");
            response.put("data", data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting category", e);
            response.put("status", "ERROR");
            response.put("code", "400");
            response.put("message", e.getMessage() != null ? e.getMessage() : "Failed to delete category");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/delete-branch")
    public ResponseEntity<Map<String, Object>> deleteBranchCategories(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        try {
            Object ownerIdObj = request.get("ownerId");
            Object branchCodeObj = request.get("branchCode");
            if (ownerIdObj == null || branchCodeObj == null) {
                response.put("status", "ERROR");
                response.put("code", "400");
                response.put("message", "ownerId and branchCode are required");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            Integer ownerId = Integer.parseInt(ownerIdObj.toString());
            String branchCode = branchCodeObj.toString();

            int deletedCount = branchCategoryService.deleteByBranch(ownerId, branchCode);
            data.put("deletedCount", deletedCount);
            response.put("status", "OK");
            response.put("code", "200");
            response.put("message", deletedCount + " categories deleted for this branch.");
            response.put("data", data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting branch categories", e);
            response.put("status", "ERROR");
            response.put("code", "400");
            response.put("message", e.getMessage() != null ? e.getMessage() : "Failed to delete branch categories");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}
