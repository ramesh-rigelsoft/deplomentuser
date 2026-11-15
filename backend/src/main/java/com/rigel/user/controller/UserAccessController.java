package com.rigel.user.controller;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.User;
import com.rigel.user.model.UserSubscription;
import com.rigel.user.model.dto.RolesPagePermisionDto;
import com.rigel.user.model.dto.RolesPermittedPagesList;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.model.dto.UserDto;
import com.rigel.user.model.dto.UserSubscriptionDto;
import com.rigel.user.service.IRolesManagementService;
import com.rigel.user.service.ISubscriptionPlanService;
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
	
	@Autowired
	ISubscriptionPlanService subscriptionPlanService;

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
			System.out.println("rolesAccess.getId()-------------"+rolesAccess.getId());
			try {
				if (rolesAccess.getId() != null) {
			
					RolesPagePermision existingRolesPagePermision = rolesManagementService.findRolesPagePermissionById(rolesAccess.getId());
					existingRolesPagePermision.setCanAll(rolesAccess.isCanAll());
					existingRolesPagePermision.setCanView(rolesAccess.isCanView());
					existingRolesPagePermision.setCanCreate(rolesAccess.isCanCreate());
					existingRolesPagePermision.setCanEdit(rolesAccess.isCanEdit());
					existingRolesPagePermision.setCanDelete(rolesAccess.isCanDelete());
					
					existingRolesPagePermision.setBranchCode(rolesAccess.getBranchCode());
					
					existingRolesPagePermision = rolesManagementService.saveRolesPagePermission(existingRolesPagePermision);
					data.put("access", existingRolesPagePermision);
				} else {
					RolesPagePermision rolesPagePermision = objectMapper.convertValue(rolesAccess, RolesPagePermision.class);
					rolesPagePermision.setId(null);
					rolesPagePermision = rolesManagementService.saveRolesPagePermission(rolesPagePermision);
					data.put("access", rolesPagePermision);
				}
			}catch (Exception e) {
				throw new BadGatewayRequest("Permission already added");
			}
			
			
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your access has been updated successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}
	
	@PostMapping(value = "fetchPremittedPagesRoleWise")
	public ResponseEntity<Map<String, Object>> fetchPremittedPagesRoleWise(
			@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (searchCriteria == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			List<RolesPagePermision> rolesPagePermision = rolesManagementService.fetchPermittedPagesRoleWise(searchCriteria);
			List<RolesPermittedPagesList> rolesPermittedPagesList = rolesPagePermision.stream()
					.map(p -> RolesPermittedPagesList.builder()
							.id(p.getPageId() != null ? p.getPageId().getId() : null)
							.pageId(p.getPageId() != null ? p.getPageId().getId() : null)
							.pageLabel(p.getPageId() != null ? p.getPageId().getLabel() : null)
							.pagePermittedId(p.getId())
							.ownerId((long) p.getOwnerId())
							.branchCode(p.getBranchCode())
							.roleId(p.getRoleId() != null ? String.valueOf(p.getRoleId().getId()) : null)
							.build())
					.toList();
			
			data.put("pages", rolesPermittedPagesList);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your access has been fetch successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}
	
	@PostMapping(value = "removedPermission")
	public ResponseEntity<Map<String, Object>> removedPermission(
			@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (searchCriteria == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			int rolesPagePermision = rolesManagementService.removePagesPermission(searchCriteria);
			response.put("data", rolesPagePermision);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your access has been fetch successfully.");
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
			
			UserSubscription subscription = subscriptionPlanService.getSubscriptionPlanByOwnerId(userDtoReq.getOwnerId(), userDtoReq.getBranchCode());
			UserSubscriptionDto userSubscriptionDto = null;
			int userCount=0;
			if (subscription == null) {
				userCount=1;//throw new TaskTitleException("You have not subscribed to any plan");
			}else {
				userSubscriptionDto = objectMapper.convertValue(subscription,UserSubscriptionDto.class);
				userCount=userSubscriptionDto.getPerBranchUser();
			}
			
			List<User> users = userService.findUsersByOwnerIdAndBranch(SearchCriteria.builder().branchCode(userDtoReq.getBranchCode()).userId(userDtoReq.getOwnerId()).build());
			boolean isUpdate = userDtoReq.getId() != null && userDtoReq.getId() > 0;
			int userExistingCount = isUpdate ? users.size() : users.size() + 1;
			if (userExistingCount > userCount) {
				throw new TaskTitleException("Max number of user already has been created in this Office");
			}
			
			int targetId = isUpdate ? userDtoReq.getId() : 0;
			
			// Check email uniqueness (excluding target user)
			User userByEmail = userService.findOtherUserByEmail(userDtoReq.getEmail_id(), targetId);
			if (userByEmail != null) {
				throw new TaskTitleException("Email id already registered with us.");
			}
			
			// Check mobile uniqueness (excluding target user)
			User userByMobile = userService.findOtherUserByMobile(userDtoReq.getMobile_no(), targetId);
			if (userByMobile != null) {
				throw new TaskTitleException("Mobile Number already registered with us.");
			}
			
			User user;
			if (isUpdate) {
				user = userService.findUserById(targetId);
				if (user == null) {
					throw new TaskTitleException("User not found to update.");
				}
				user.setName(userDtoReq.getName());
				user.setEmail_id(userDtoReq.getEmail_id());
				user.setMobile_no(userDtoReq.getMobile_no());
				user.setRole(userDtoReq.getRole());
				user.setStatus(userDtoReq.getStatus());
				user.setBranchCode(userDtoReq.getBranchCode());
				user.setOwnerId(userDtoReq.getOwnerId());
				
				// Only update password if a new plain password was provided
				if (userDtoReq.getPassword() != null && !userDtoReq.getPassword().trim().isEmpty()
						&& !userDtoReq.getPassword().startsWith("$2a$")
						&& !userDtoReq.getPassword().equals(user.getPassword())) {
					user.setPassword(User.PASSWORD_ENCODER.encode(userDtoReq.getPassword().trim()));
				}
			} else {
				user = objectMapper.convertValue(userDtoReq, User.class);
				user.setId(0);
				user.setPassword(User.PASSWORD_ENCODER.encode(userDtoReq.getPassword()));
				user.setCreated_at(new Timestamp(new Date().getTime()));
				user.setSoftwareKey(LicenseKeyGenerator.generateLicenseKey());
			}
			
			user = userService.saveSubUser(user);

			data.put("user", user);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", isUpdate ? "User updated successfully." : "User created successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
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
		
			List<User> users = userService.findUsers(searchCriteria)
			        .stream()
			        .map(u -> {
			            u.setPassword(AppUtill.generatePassword(12));
			            return u;
			        })
			        .toList();
            data.put("userList", users);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Users has been fetch successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}
	
	@PostMapping(value = "subscriptionList")
	public ResponseEntity<Map<String, Object>> subscriptionList() {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
			List<SubscriptionPlan> subscriptionPlanList = subscriptionPlanService.subscriptionPlanList();
			data.put("subscriptionPlanList", subscriptionPlanList);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Users has been fetch successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = "userSubscriptionList")
	public ResponseEntity<Map<String, Object>> userSubscriptionList(@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
			List<UserSubscription> subscriptionPlanList = subscriptionPlanService.userSubscriptionPlanList(searchCriteria);
			data.put("mysubscriptionList", subscriptionPlanList);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Users has been fetch successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
