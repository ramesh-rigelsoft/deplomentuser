package com.rigel.user.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rigel.user.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rigel.user.annotation.ApiSecured;
import com.rigel.user.exception.BadGatewayRequest;
import com.rigel.user.exception.TaskTitleException;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.Pages;
import com.rigel.user.model.RolesPagePermision;
import com.rigel.user.model.User;
import com.rigel.user.model.dto.OfficeBranchDto;
import com.rigel.user.model.dto.RolesPagePermisionDto;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.model.dto.UserDto;
import com.rigel.user.service.IRolesManagementService;
import com.rigel.user.service.IUserService;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/branch/")
@ApiSecured
@Tag(name = "User Api", description = "User API endpoints")
public class OfficeBranchController {

	Logger logger = LoggerFactory.getLogger(OfficeBranchController.class);

	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	IRolesManagementService rolesManagementService;

	@Autowired
	IUserService userService;

	@PostMapping(value = "save")
	public ResponseEntity<Map<String, Object>> save(
			@RequestBody(required = true) @Valid OfficeBranchDto officeBranchDto, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (officeBranchDto == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			if (officeBranchDto.getId() != null&&!officeBranchDto.getId().isBlank()&&officeBranchDto.getId().length()>10) {
				OfficeBranch existingBranch = rolesManagementService.searchOfficeBranch(SearchCriteria.builder().userId(officeBranchDto.getOwnerId()).itemId(officeBranchDto.getId()).build()).stream().findFirst().orElse(null);
				existingBranch.setBranchName(officeBranchDto.getBranchName());
				existingBranch.setAddress(officeBranchDto.getAddress());
				existingBranch.setAdditionalDetails(officeBranchDto.getAdditionalDetails());
				existingBranch.setStatus(officeBranchDto.isStatus());
				existingBranch.setUpdatedAt(LocalDateTime.now());
				rolesManagementService.updateOfficeBranch(existingBranch);
				data.put("branch", officeBranchDto);
			} else {
				List<OfficeBranch> existingBranchList = rolesManagementService.searchOfficeBranch(SearchCriteria.builder().userId(officeBranchDto.getOwnerId()).build());
				int maxNo = existingBranchList == null ? 1 : existingBranchList.stream().mapToInt(b -> Integer.parseInt(b.getBranchCode().substring(3))).max().orElse(1);
				OfficeBranch officeBranch = objectMapper.convertValue(officeBranchDto,OfficeBranch.class);
				officeBranch.setId(null);
				officeBranch.setBranchCode("OFC"+String.format("%02d", maxNo+1));
				officeBranch = rolesManagementService.saveOfficeBranch(officeBranch);
				data.put("branch", officeBranch);
			}
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your access has been updated successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	@PostMapping(value = "search")
	public ResponseEntity<Map<String, Object>> fetchOffice(
			@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (searchCriteria == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			List<OfficeBranch> branchList = rolesManagementService.searchOfficeBranch(searchCriteria);
			data.put("branchList", branchList);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your access has been fetch successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

}
