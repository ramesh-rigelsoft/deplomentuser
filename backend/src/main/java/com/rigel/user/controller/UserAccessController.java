package com.rigel.user.controller;

import java.sql.Timestamp;
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
import com.rigel.user.model.Pages;
import com.rigel.user.model.RolesPagePermision;
import com.rigel.user.model.User;
import com.rigel.user.model.dto.RolesPagePermisionDto;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.model.dto.UserDto;
import com.rigel.user.service.IRolesManagementService;
import com.rigel.user.service.IUserService;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/access/")
@ApiSecured
@Tag(name = "User Api", description = "User API endpoints")
public class UserAccessController {

	Logger logger = LoggerFactory.getLogger(UserAccessController.class);

	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	IRolesManagementService rolesManagementService;

	@Autowired
	IUserService userService;

	@PostMapping(value = "saveRolePermission")
	public ResponseEntity<Map<String, Object>> rolePermission(
			@RequestBody(required = true) @Valid RolesPagePermisionDto rolesAccess, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (rolesAccess == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			if (rolesAccess.getId() != null && rolesAccess.getId() != 0) {
				RolesPagePermision existingRolesPagePermision = rolesManagementService.findRolesPagePermissionById(rolesAccess.getId());
				existingRolesPagePermision.setCanAll(rolesAccess.isCanAll());
				existingRolesPagePermision.setCanView(rolesAccess.isCanView());
				existingRolesPagePermision.setCanCreate(rolesAccess.isCanCreate());
				existingRolesPagePermision.setCanEdit(rolesAccess.isCanEdit());
				existingRolesPagePermision.setCanDelete(rolesAccess.isCanDelete());
				existingRolesPagePermision = rolesManagementService.saveRolesPagePermission(existingRolesPagePermision);
				data.put("access", existingRolesPagePermision);
			} else {
				RolesPagePermision rolesPagePermision = objectMapper.convertValue(rolesAccess, RolesPagePermision.class);
				rolesPagePermision.setId(null);
				rolesPagePermision = rolesManagementService.saveRolesPagePermission(rolesPagePermision);
				data.put("access", rolesPagePermision);
			}
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your access has been updated successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	@PostMapping(value = "fetch")
	public ResponseEntity<Map<String, Object>> fetchPermission(
			@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (searchCriteria == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			if (!searchCriteria.getItemType().equalsIgnoreCase("pages")) {
				List<RolesPagePermision> rolesPagePermision = rolesManagementService
						.searchRolesPagePermision(searchCriteria);
				data.put("access", rolesPagePermision);
			} else {
				List<Pages> pages = rolesManagementService.fetchPagesList(searchCriteria);
				data.put("pages", pages);
			}
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your access has been fetch successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	@PostMapping(value = "addSubUser")
	public ResponseEntity<Map<String, Object>> subUser(@RequestBody @Valid UserDto userDtoReq, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (userDtoReq == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			
			List<User> users = userService.findUsers(SearchCriteria.builder().userId(userDtoReq.getOwnerId()).build());
			if(users.size()<=2) {
				throw new TaskTitleException("Max number of user already has been created");
			}
			
			User user = objectMapper.convertValue(userDtoReq, User.class);
			User user1 = userService.findUserByEmailId(user.getEmail_id(), userDtoReq.getId());
			User user2 = userService.findUserByEmailId(user.getMobile_no(), userDtoReq.getId());
			if (user2 != null) {
				throw new TaskTitleException("Mobile Number already registered with us.");
			}
			if (user1 == null) {
				user.setStatus(1);
				user.setPassword(User.PASSWORD_ENCODER.encode(user.getPassword()));
				user.setCreated_at(new Timestamp(new Date().getTime()));
				user.setSoftwareKey(LicenseKeyGenerator.generateLicenseKey());
				user = userService.saveSubUser(user);

				data.put("user", user);
				response.put("data", data);
				response.put("status", "OK");
				response.put("code", "200");
				response.put("message", "Your account has been Updated successfully.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				throw new TaskTitleException("Email id already registered with us.");
			}
		}
	}

	@PostMapping(value = "userList")
	public ResponseEntity<Map<String, Object>> userList(
			@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (searchCriteria == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			List<User> users = userService.findUsers(searchCriteria);
			data.put("userList", users);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Users has been fetch successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}
}
