package com.rigel.user.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.io.*;
import java.nio.file.Files;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rigel.user.util.*;
import com.rigel.user.util.Constaints;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rigel.user.annotation.ApiSecured;
import com.rigel.user.dao.IRolesManagementDao;
import com.rigel.user.exception.BadGatewayRequest;
import com.rigel.user.exception.TaskTitleException;
import com.rigel.user.exception.TaskTitleNotFound;
import com.rigel.user.model.LoginDetails;
import com.rigel.user.model.LoginRequest;
import com.rigel.user.model.Mail;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.Roles;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.User;
import com.rigel.user.model.UserOtp;
import com.rigel.user.model.UserSubscription;
import com.rigel.user.model.UserSubscriptionLog;
import com.rigel.user.model.VerifyKeyRequest;
import com.rigel.user.model.dto.MenuDto;
import com.rigel.user.model.dto.OfficeBranchDto;
import com.rigel.user.model.dto.ResetPasswordRequest;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.model.dto.SubscriptionPlanDto;
import com.rigel.user.model.dto.UserDto;
import com.rigel.user.model.dto.UserSubscriptionDto;
import com.rigel.user.security.JwtTokenUtil;
import com.rigel.user.security.JwtUser;
import com.rigel.user.service.IRolesManagementService;
import com.rigel.user.service.ISubscriptionPlanService;
import com.rigel.user.service.IRazorpayService;
import com.rigel.user.service.IUserLogOutIn;
import com.rigel.user.service.IUserService;
import com.rigel.user.serviceimpl.EmailService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/user/")
@ApiSecured
@Tag(name = "User Api", description = "User API endpoints")
public class UserController {

	Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private IUserService userService;

	@Autowired
	private EmailService emailService;

	@Autowired
	ModelMapper modelMapper;
	
	@Autowired
	ObjectMapper objectMapper;

//	@Autowired
//	CryptoAES128 cryptoAES128;

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;
	
	@Autowired
	private IRolesManagementService rolesManagementService;
	
	@Autowired
	ISubscriptionPlanService subscriptionPlanService;

	@Autowired
	private IRazorpayService razorpayService;
	
//	@Autowired
//	private IUserLogOutIn userLogOutIn;
//
//	@Autowired
//	private ILoginInfoService loginInfoService;
//
//	@Autowired
//	private Environment environment;

	@RequestMapping(value = "sendEmail", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> sendEmail(@RequestBody(required = true) @Valid Mail mail,
			BindingResult result, HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		if (mail == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			Map<String, Object> data = userService.sendEmailToAll(mail);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your account has been created successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	@PostMapping(value = "password/reset")
	public ResponseEntity<Map<String, Object>> reset(
			@RequestBody(required = true) @Valid ResetPasswordRequest resetPassword, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (resetPassword == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			String username = resetPassword.getMobile_no();
			User user = userService.findUserByEmailId(username,0);
			if (user != null) {
				UserOtp userOtp = userService.findUserOtpByMobileNo(username);
				LocalDateTime currentTime = LocalDateTime.now();

				if (userOtp.getOtp().equals(resetPassword.getOtp()) && userOtp.getExpaire_at().isAfter(currentTime)) {
					if (LocalDateTime.now().isAfter(userOtp.getCreated_at())) {
						user.setPassword(User.PASSWORD_ENCODER.encode(user.getPassword()));
						user = userService.saveUser(user);
						UserDto userDto = modelMapper.map(user, UserDto.class);
						final JwtUser userDetails = (JwtUser) userDetailsService.loadUserByUsername(user.getEmail_id());
						final String token = jwtTokenUtil.generateToken(userDetails, request);
						data.put("access_token", token);
						data.put("user", userDto);
						response.put("data", data);
						response.put("status", "OK");
						response.put("code", "200");
						response.put("message", "Your password has been changed successfully.");
						return new ResponseEntity<>(response, HttpStatus.OK);
					} else {
						throw new TaskTitleException("OTP expired");
					}
				} else {
					throw new TaskTitleException("Wrong OTP");
				}
			} else {
				throw new TaskTitleException("Email Id or Mobile No are not registered with us.");
			}
		}
	}

	@PostMapping(value = "send/otp")
	public ResponseEntity<Map<String, Object>> otp(
			@RequestBody(required = true) @Valid ResetPasswordRequest resetPassword, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (resetPassword == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			String username = resetPassword.getMobile_no();
			User user = userService.findUserByEmailId(username,0);
			if (user != null) {
				UserOtp userOtp = UserOtp.builder().emailId(user.getEmail_id()).softwareType(user.getSoftwareType()).mobile_no(username).build();
				userService.saveUserOTP(userOtp);
				data.put("access_token", "sdfghjk");
				data.put("user", userOtp);
				response.put("data", data);
				response.put("status", "OK");
				response.put("code", "200");
				response.put("message", "Your OTP has been send successfully.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				throw new TaskTitleException("Mobile Number is not registered with us.");
			}
		}
	}
	
	@PostMapping(value = "view")
	public ResponseEntity<Map<String, Object>> view(
			@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (searchCriteria == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			User user = userService.findUserById(searchCriteria.getUserId());
			
			if (user != null) {
				String mobileNo=user.getMobile_no().split("\\|")[0];
				String emailId=user.getEmail_id().split("\\|")[0];
				user.setEmail_id(emailId);
				user.setMobile_no(mobileNo);
				data.put("user", user);
				response.put("data", data);
				response.put("status", "OK");
				response.put("code", "200");
				response.put("message", "Your profile has been viewed successfully.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				throw new TaskTitleException("Mobile Number is not registered with us.");
			}
		}
	}


	@PostMapping(value = "signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, Object>> signup(@ModelAttribute @Valid UserDto userDtoReq, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (userDtoReq == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
//			System.out.println("userDtoReq.getLogo()" + userDtoReq.getProfilePhoto());
//			String fileName = userDtoReq.getLogo() == null ? null
//					: UploadFileUtlity.uploadFiles(userDtoReq.getLogo(), "logo", null);
			User user = modelMapper.map(userDtoReq, User.class);
            String adminEmail=user.getEmail_id()+"|admin";
            String adminMobileNo=user.getMobile_no()+"|admin";
			User user2 = userService.findUserByEmailId(adminMobileNo,userDtoReq.getId());
			if(user2!=null){
				throw new TaskTitleException("Mobile Number already registered with us.");
			}
			User user1 = userService.findUserByEmailId(adminEmail,userDtoReq.getId());
			if (user1 == null) {
				if(user.getId()<1){
					user.setStatus(1);
					user.setPassword(User.PASSWORD_ENCODER.encode(user.getPassword()));
					user.setCreated_at(new Timestamp(new Date().getTime()));
//					user.setLogo(fileName);
					user.setEmail_id(adminEmail);
					user.setMobile_no(adminMobileNo);
					user.setRole("admin");
					user.setSoftwareKey(LicenseKeyGenerator.generateLicenseKey());
					user = userService.persistUser(user);
//					final JwtUser userDetails = (JwtUser) userDetailsService.loadUserByUsername(user.getEmail_id());
//					final String token = jwtTokenUtil.generateToken(userDetails, request);
					try {
						if(user.getRole().equalsIgnoreCase("admin")) {
						    emailService.sendHtmlEmail(user.getEmail_id(),user.getSoftwareKey(), user.getEmail_id(),userDtoReq.getPassword(),user.getSoftwareType());
						}
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
//					data.put("access_token", token);
					data.put("user", user);
					response.put("data", data);
				}else {
					userDtoReq.setEmail_id(adminEmail);
					userDtoReq.setMobile_no(adminMobileNo);
					user = userService.saveUserDto(userDtoReq);
					data.put("user", user);
					response.put("data", data);
				}
				response.put("status", "OK");
				response.put("code", "200");
				response.put("message", "Your account has been created successfully.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				throw new TaskTitleException("Email id already registered with us.");
			}
		}
	}
	
	@RequestMapping(value = "adminLogin", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody(required = true) @Valid LoginRequest login,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		String username=login.getUsername()+"|admin";
        User user = userService.findUserByEmailId(username,0);
		if (user == null) {
			throw new TaskTitleNotFound("Email id not existing with us.");
		} else if (!(User.PASSWORD_ENCODER.matches(login.getPassword(), user.getPassword()))) {
			throw new TaskTitleException("Wrong password");
		} else {
			final JwtUser userDetails = (JwtUser) userDetailsService.loadUserByUsername(user.getEmail_id());
			final String token = jwtTokenUtil.generateToken(userDetails, request);
			data.put("access_token", token);
			data.put("user", user);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your account has been logined successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}
	
	@RequestMapping(value = "login", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> login(@RequestBody(required = true) @Valid LoginRequest login,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		String username=login.getUsername();
        User user = userService.findUserByEmailId(username,0);
		if (user == null) {
			throw new TaskTitleNotFound("Email id not existing with us.");
		} else if (!(User.PASSWORD_ENCODER.matches(login.getPassword(), user.getPassword()))) {
			throw new TaskTitleException("Wrong password");
		} else {
			final JwtUser userDetails = (JwtUser) userDetailsService.loadUserByUsername(user.getEmail_id());
			final String token = jwtTokenUtil.generateToken(userDetails, request);
			Long roleId=rolesManagementService.getRoleIdByRole(user.getRole());
			OfficeBranch branch=rolesManagementService.searchOfficeBranch(SearchCriteria.builder().userId(user.getOwnerId()).branchCode(login.getBranchCode()).build()).stream().findFirst().orElse(null);
			OfficeBranchDto officeBranchDto=objectMapper.convertValue(branch, OfficeBranchDto.class);
			List<MenuDto> menuDto=rolesManagementService.getMenus(roleId, user.getOwnerId(),login.getBranchCode());
			UserSubscriptionDto userSubscriptionDto = Optional.ofNullable(subscriptionPlanService.getSubscriptionPlanByOwnerId(user.getOwnerId(), login.getBranchCode())).map(e -> objectMapper.convertValue(e, UserSubscriptionDto.class)).orElse(null);
			data.put("access_token", token);
			data.put("user", user);
			data.put("branch", officeBranchDto);
			data.put("page_access", menuDto);
			data.put("subscription_plan", userSubscriptionDto);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your account has been logined successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}
	
	@RequestMapping(value = "employee-login", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> employeeLogin(@RequestBody(required = true) @Valid LoginRequest login,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		User user = userService.findUserById(login.getOwnerId());
		if (user == null) {
			throw new TaskTitleNotFound("Email id not existing with us.");
		} else {
			final JwtUser userDetails = (JwtUser) userDetailsService.loadUserByUsername(user.getEmail_id());
			final String token = jwtTokenUtil.generateToken(userDetails, request);
			Long roleId=rolesManagementService.getRoleIdByRole(user.getRole());
			OfficeBranch branch=rolesManagementService.searchOfficeBranch(SearchCriteria.builder().userId(user.getOwnerId()).branchCode(login.getBranchCode()).build()).stream().findFirst().orElse(null);
			OfficeBranchDto officeBranchDto=objectMapper.convertValue(branch, OfficeBranchDto.class);
			List<MenuDto> menuDto=rolesManagementService.getMenus(roleId, user.getOwnerId(),login.getBranchCode());
			UserSubscriptionDto userSubscriptionDto = Optional.ofNullable(subscriptionPlanService.getSubscriptionPlanByOwnerId(user.getOwnerId(), login.getBranchCode())).map(e -> objectMapper.convertValue(e, UserSubscriptionDto.class)).orElse(null);
			data.put("access_token", token);
			data.put("user", user);
			data.put("branch", officeBranchDto);
			data.put("page_access", menuDto);
			data.put("subscription_plan", userSubscriptionDto);
			response.put("data", data);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Your account has been logined successfully.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}


	@RequestMapping(value = "key/verify", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> verifyKey(
			@RequestBody(required = true) @Valid VerifyKeyRequest verifyKeyRequest, HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		User user = userService.findUserByEmailId(verifyKeyRequest.getUsername(),0);
		if (user == null) {
			response.put("status", "BAD_GATEWAY");
			response.put("code", "400");
			response.put("message", "Email id not existing with us.");
			return new ResponseEntity<>(response, HttpStatus.BAD_GATEWAY);
		} else if (user.getSoftwareKey().equalsIgnoreCase(verifyKeyRequest.getSoftwareKey())) {

			userService.saveUser(user);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Success");
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			response.put("status", "BAD_GATEWAY");
			response.put("code", "400");
			response.put("message", "Invalid Key.");
			return new ResponseEntity<>(response, HttpStatus.BAD_GATEWAY);
		}
	}

//	    @RequestMapping(value = "logOut",method = RequestMethod.POST)
//		public ResponseEntity<Map<String,Object>> logOut(HttpServletRequest request){
//			Map<String,Object> response=new HashMap<>();
//			Map<String,Object> data=new HashMap<>();
//			String email=jwtTokenUtil.getEmailFromToken(request.getHeader(environment.getProperty("security.jwt.header")).substring(7));
//			User user=userService.findUserByEmailId(email);
//			     	userLogOutIn.logOutUser(user.getId(), user.getEmail_id());		
//					response.put("data", data);
//					response.put("status", "OK");
//					response.put("code", "200");
//					response.put("message","Your account has been logout successfully.");
//					return new ResponseEntity<>(response, HttpStatus.OK);
//			
//	    }
	
	

	@RequestMapping(value = "testapi", method = RequestMethod.GET)
	public String d() {
		return "abc";
	}

	@RequestMapping(value = "testapi2", method = RequestMethod.GET)
	public String d2() {
		return "abc";
	}

	// Deserialize byte[] back to User
	public User deserializeUser(byte[] data) {
		if (data == null)
			return null;
		try (ByteArrayInputStream bis = new ByteArrayInputStream(data);
				ObjectInputStream ois = new ObjectInputStream(bis)) {

			return (User) ois.readObject(); // cast to User

		} catch (IOException | ClassNotFoundException e) {
			e.printStackTrace();
			return null;
		}
	}

	@GetMapping("/view/file")
	public ResponseEntity<byte[]> viewFile(@RequestParam String path, @RequestParam String fileName)
			throws IOException {

		File file = new File(UploadFileUtlity.getPath(path) + fileName);
		System.out.println("hhhhhhhhhhhh---" + file.getAbsolutePath());
		if (!file.exists()) {
			throw new RuntimeException("File not found");
		}

		byte[] fileBytes = Files.readAllBytes(file.toPath());

		String contentType = Files.probeContentType(file.toPath());
		if (contentType == null) {
			contentType = "application/octet-stream";
		}

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
				.header("Content-Disposition", "inline; filename=\"" + fileName + "\"").body(fileBytes);
	}
	
	@PostMapping("/checkInternet")
	public ResponseEntity<Map<String, Object>> checkInternet() {
	    Map<String, Object> response = new HashMap<>();
	    response.put("status", "OK");
	    response.put("code", 200);
	    response.put("message", "Success");
	    return ResponseEntity.ok(response);
	}
	
	@PostMapping(value = "userSubscription")
	public ResponseEntity<Map<String, Object>> userSubscription(
			@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (searchCriteria == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			String branchCode = searchCriteria.getBranchCode();
			int ownerId = searchCriteria.getUserId();
			String subScriptionCode = searchCriteria.getSubscriptionCode();

			UserSubscription userSubscription = subscriptionPlanService.getSubscriptionPlanByOwnerId(ownerId, branchCode);
			if (userSubscription != null && userSubscription.isStatus() && !searchCriteria.isRenewal()) {
				throw new BadGatewayRequest("You already have an active subscription. Please select the renewal option to extend.");
			}

			SubscriptionPlan subscriptionPlan = rolesManagementService.findBySubscriptionCode(subScriptionCode);
			if (subscriptionPlan == null) {
				throw new BadGatewayRequest("Invalid subscription Code.");
			}

			// If payment details are not passed and the plan requires payment, initiate Razorpay Order
			if ((searchCriteria.getRazorpayPaymentId() == null || searchCriteria.getRazorpayPaymentId().trim().isEmpty())
					&& subscriptionPlan.getTotalAmount() > 0) {
				Map<String, String> notes = new HashMap<>();
				notes.put("userId", String.valueOf(ownerId));
				notes.put("branchCode", branchCode);
				notes.put("subscriptionCode", subScriptionCode);
				notes.put("subscriptionName", subscriptionPlan.getSubscriptionName());
				notes.put("isRenewal", String.valueOf(searchCriteria.isRenewal()));

				Map<String, Object> orderDetails = razorpayService.createOrder(
						subscriptionPlan.getTotalAmount(),
						"sub_" + ownerId + "_" + System.currentTimeMillis(),
						"INR",
						notes
				);

				data.put("razorpayOrder", orderDetails);
				data.put("orderId", orderDetails.get("orderId"));
				data.put("amount", subscriptionPlan.getTotalAmount());
				data.put("amountInPaise", orderDetails.get("amount"));
				data.put("currency", orderDetails.get("currency"));
				data.put("keyId", razorpayService.getKeyId());
				data.put("subscriptionCode", subScriptionCode);
				data.put("subscriptionName", subscriptionPlan.getSubscriptionName());
				data.put("paymentRequired", true);
				data.put("isRenewal", searchCriteria.isRenewal());

				response.put("data", data);
				response.put("status", "OK");
				response.put("code", "200");
				response.put("message", "Razorpay order created successfully. Please complete the payment to activate subscription.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			}

			// If payment details are provided, verify payment signature
			if (searchCriteria.getRazorpayPaymentId() != null && !searchCriteria.getRazorpayPaymentId().trim().isEmpty()) {
				boolean verified = razorpayService.verifyPaymentSignature(
						searchCriteria.getRazorpayOrderId(),
						searchCriteria.getRazorpayPaymentId(),
						searchCriteria.getRazorpaySignature()
				);
				if (!verified) {
					throw new BadGatewayRequest("Invalid Razorpay payment signature. Payment verification failed.");
				}
			}

			// Activate or renew subscription
			boolean isRenewal = searchCriteria.isRenewal();
			if (userSubscription != null && userSubscription.getSubscriptionCode().equalsIgnoreCase(subScriptionCode)) {
				userSubscription.setSubscriptionStartAt(LocalDateTime.now());
				userSubscription.setSubscriptionDuration(subscriptionPlan.getMonth());
				userSubscription.setStatus(true);
				userSubscription.setActive(true);
				userSubscription.setRazorpayOrderId(searchCriteria.getRazorpayOrderId());
				userSubscription.setRazorpayPaymentId(searchCriteria.getRazorpayPaymentId());
				userSubscription.setRazorpaySignature(searchCriteria.getRazorpaySignature());
				userSubscription.setPaymentStatus("SUCCESS");
				userSubscription = subscriptionPlanService.saveUserSubscriptionPlan(userSubscription);
				UserSubscriptionDto userSubscriptionDto1 = objectMapper.convertValue(userSubscription, UserSubscriptionDto.class);
				data.put("userSubscription", userSubscriptionDto1);

				// log
				UserSubscriptionLog userSubscriptionLog = objectMapper.convertValue(userSubscriptionDto1, UserSubscriptionLog.class);
				userSubscriptionLog.setId(null);
				subscriptionPlanService.saveUserSubscriptionLogPlan(userSubscriptionLog);
			} else {
				if (userSubscription != null) {
					userSubscription.setActive(false);
					userSubscription.setStatus(false);
					subscriptionPlanService.saveUserSubscriptionPlan(userSubscription);
				}

				SubscriptionPlanDto subscription = objectMapper.convertValue(subscriptionPlan, SubscriptionPlanDto.class);
				UserSubscription userSubscriptionNew = objectMapper.convertValue(subscription, UserSubscription.class);
				userSubscriptionNew.setCreatedAt(LocalDateTime.now());
				userSubscriptionNew.setSubscriptionStartAt(LocalDateTime.now());
				userSubscriptionNew.setSubscriptionDuration(subscriptionPlan.getMonth());
				userSubscriptionNew.setBranchCode(branchCode);
				userSubscriptionNew.setOwnerId(ownerId);
				userSubscriptionNew.setActive(true);
				userSubscriptionNew.setStatus(true);
				userSubscriptionNew.setRazorpayOrderId(searchCriteria.getRazorpayOrderId());
				userSubscriptionNew.setRazorpayPaymentId(searchCriteria.getRazorpayPaymentId());
				userSubscriptionNew.setRazorpaySignature(searchCriteria.getRazorpaySignature());
				userSubscriptionNew.setPaymentStatus("SUCCESS");
				userSubscriptionNew = subscriptionPlanService.saveUserSubscriptionPlan(userSubscriptionNew);
				UserSubscriptionDto userSubscriptionDto2 = objectMapper.convertValue(userSubscriptionNew, UserSubscriptionDto.class);
				data.put("userSubscription", userSubscriptionDto2);

				// log
				UserSubscriptionLog userSubscriptionLog = objectMapper.convertValue(userSubscriptionDto2, UserSubscriptionLog.class);
				userSubscriptionLog.setId(null);
				subscriptionPlanService.saveUserSubscriptionLogPlan(userSubscriptionLog);
			}

			response.put("data", data);
			response.put("status", "CREATED");
			response.put("code", "201");
			response.put("message", isRenewal ? "Subscription has been renewed successfully." : "Subscription has been created successfully.");
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		}
	}

	@PostMapping(value = "createSubscriptionOrder")
	public ResponseEntity<Map<String, Object>> createSubscriptionOrder(
			@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (searchCriteria == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		}

		String branchCode = searchCriteria.getBranchCode();
		int ownerId = searchCriteria.getUserId();
		String subScriptionCode = searchCriteria.getSubscriptionCode();

		UserSubscription userSubscription = subscriptionPlanService.getSubscriptionPlanByOwnerId(ownerId, branchCode);
		if (userSubscription != null && userSubscription.isStatus()) {
			throw new BadGatewayRequest("You already have an active subscription.");
		}

		SubscriptionPlan subscriptionPlan = rolesManagementService.findBySubscriptionCode(subScriptionCode);
		if (subscriptionPlan == null) {
			throw new BadGatewayRequest("Invalid subscription Code.");
		}

		Map<String, String> notes = new HashMap<>();
		notes.put("userId", String.valueOf(ownerId));
		notes.put("branchCode", branchCode);
		notes.put("subscriptionCode", subScriptionCode);
		notes.put("subscriptionName", subscriptionPlan.getSubscriptionName());

		Map<String, Object> orderDetails = razorpayService.createOrder(
				subscriptionPlan.getTotalAmount(),
				"sub_" + ownerId + "_" + System.currentTimeMillis(),
				"INR",
				notes
		);

		data.put("razorpayOrder", orderDetails);
		data.put("orderId", orderDetails.get("orderId"));
		data.put("amount", subscriptionPlan.getTotalAmount());
		data.put("amountInPaise", orderDetails.get("amount"));
		data.put("currency", orderDetails.get("currency"));
		data.put("keyId", razorpayService.getKeyId());
		data.put("subscriptionCode", subScriptionCode);
		data.put("subscriptionName", subscriptionPlan.getSubscriptionName());

		response.put("data", data);
		response.put("status", "OK");
		response.put("code", "200");
		response.put("message", "Razorpay order created successfully.");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping(value = "verifySubscriptionPayment")
	public ResponseEntity<Map<String, Object>> verifySubscriptionPayment(
			@RequestBody(required = true) @Valid SearchCriteria searchCriteria, BindingResult result,
			HttpServletRequest request) {
		return userSubscription(searchCriteria, result, request);
	}

	@PostMapping(value = "razorpay/webhook")
	public ResponseEntity<Map<String, Object>> razorpayWebhook(
			@RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
			@RequestBody(required = false) String payload) {
		Map<String, Object> response = new HashMap<>();
		logger.info("Received Razorpay Webhook notification");

		boolean isValid = razorpayService.verifyWebhookSignature(payload, signature);
		if (!isValid) {
			logger.warn("Invalid Razorpay webhook signature");
			response.put("status", "BAD_REQUEST");
			response.put("code", "400");
			response.put("message", "Invalid webhook signature");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		logger.info("Razorpay webhook signature verified successfully. Payload: {}", payload);
		response.put("status", "OK");
		response.put("code", "200");
		response.put("message", "Webhook received and verified successfully.");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
