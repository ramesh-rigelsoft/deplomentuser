package com.rigel.user.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rigel.user.annotation.ApiSecured;
import com.rigel.user.exception.BadGatewayRequest;
import com.rigel.user.exception.TaskTitleException;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.User;
import com.rigel.user.model.UserSubscription;
import com.rigel.user.model.dto.OfficeBranchDto;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.service.IRolesManagementService;
import com.rigel.user.service.ISubscriptionPlanService;
import com.rigel.user.service.IUserService;
import com.rigel.user.util.UploadFileUtlity;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

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
	
	@Autowired
	ISubscriptionPlanService subscriptionPlanService;

	@PostMapping(value = "save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, Object>> save(@ModelAttribute @Valid OfficeBranchDto officeBranchDto, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (officeBranchDto == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
						
//			UserSubscription subscriptionPlan=subscriptionPlanService.getSubscriptionPlanByOwnerId(officeBranchDto.getOwnerId());
			if (officeBranchDto.getId() != null&&!officeBranchDto.getId().isBlank()&&officeBranchDto.getId().length()>10) {
				OfficeBranch existingBranch = rolesManagementService.searchOfficeBranch(SearchCriteria.builder().userId(officeBranchDto.getOwnerId()).itemId(officeBranchDto.getId()).build()).stream().findFirst().orElse(null);
				existingBranch.setBranchName(officeBranchDto.getBranchName());
				existingBranch.setAddress(officeBranchDto.getAddress());
				existingBranch.setAdditionalDetails(officeBranchDto.getAdditionalDetails());
				existingBranch.setStatus(officeBranchDto.isStatus());
				existingBranch.setUpdatedAt(LocalDateTime.now());
				
				existingBranch.setCinNumber(officeBranchDto.getCinNumber());
				existingBranch.setShopType(officeBranchDto.getShopType());
				existingBranch.setGstNumber(officeBranchDto.getGstNumber());
				existingBranch.setPanNumber(officeBranchDto.getPanNumber());
				existingBranch.setState(officeBranchDto.getState());
				existingBranch.setCity(officeBranchDto.getCity());
				existingBranch.setPincode(officeBranchDto.getPincode());
				if(officeBranchDto.getOfcLat()!=null) {
					existingBranch.setOfcLat(officeBranchDto.getOfcLat());
					existingBranch.setOfcLng(officeBranchDto.getOfcLng());
					existingBranch.setCenterRedious(officeBranchDto.getCenterRedious());
				}
				
				String fileName = UploadFileUtlity.uploadLogo(officeBranchDto.getLogo(),existingBranch.getBranchCode());

				if(fileName!=null) {
				  existingBranch.setBranchLogo(fileName);
				}
				existingBranch=rolesManagementService.updateOfficeBranch(existingBranch);				
//				System.out.println("Logo: " + logo);
//				System.out.println("Type: " + (logo != null ? logo.getClass().getName() : "null"));
				officeBranchDto.setLogo(null);
				data.put("branch", existingBranch);
			} else {
				User user=userService.findUserById(officeBranchDto.getOwnerId());
				List<OfficeBranch> existingBranchList = rolesManagementService.searchOfficeBranch(SearchCriteria.builder().userId(officeBranchDto.getOwnerId()).build());
				if((existingBranchList.size()+1) > user.getBranchCount()) {
					throw new TaskTitleException("You have reached the maximum number of branches allowed by your subscription plan.");
				}
				int maxNo = existingBranchList == null ? 0 : existingBranchList.stream().mapToInt(b -> Integer.parseInt(b.getBranchCode().substring(6))).max().orElse(0);
				OfficeBranch officeBranch = objectMapper.convertValue(officeBranchDto,OfficeBranch.class);
				officeBranch.setId(null);
				officeBranch.setBranchCode("BRT"+String.format("%03d",officeBranch.getOwnerId())+String.format("%02d", maxNo+1));
				String fileName = UploadFileUtlity.uploadLogo(officeBranchDto.getLogo(),officeBranch.getBranchCode());
				if(fileName!=null) {
					officeBranch.setBranchLogo(fileName);
				}
				officeBranch = rolesManagementService.saveOfficeBranch(officeBranch);
//				System.out.println("Logo: " + logo);
//				System.out.println("Type: " + (logo != null ? logo.getClass().getName() : "null"));
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
