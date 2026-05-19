package com.rigel.user.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rigel.user.util.*;
import com.rigel.user.util.Constaints;
import com.rigel.user.annotation.ApiSecured;
import com.rigel.user.exception.BadGatewayRequest;
import com.rigel.user.exception.TaskTitleException;
import com.rigel.user.exception.TaskTitleNotFound;
import com.rigel.user.model.LoginActivity;
import com.rigel.user.model.LoginDetails;
import com.rigel.user.model.LoginRequest;
import com.rigel.user.model.Mail;
import com.rigel.user.model.User;
import com.rigel.user.model.UserOtp;
import com.rigel.user.model.VerifyKeyRequest;
import com.rigel.user.model.dto.ResetPasswordRequest;
import com.rigel.user.model.dto.UserDto;
import com.rigel.user.security.JwtTokenUtil;
import com.rigel.user.security.JwtUser;
import com.rigel.user.service.ILoginInfoService;
import com.rigel.user.service.IUserLogOutIn;
import com.rigel.user.service.IUserService;
import com.rigel.user.serviceimpl.EmailService;
import com.rigel.user.serviceimpl.LoginInfoService;

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

//	@Autowired
//	CryptoAES128 cryptoAES128;

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;
	

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
			User user = userService.findUserByEmailId(username);
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
			User user = userService.findUserByEmailId(username);
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

	@PostMapping(value = "update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Map<String, Object>> update(@ModelAttribute @Valid UserDto userDtoReq, BindingResult result,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();

		if (userDtoReq == null) {
			throw new BadGatewayRequest("Invalid Request");
		} else if (result.hasFieldErrors()) {
			throw new BadGatewayRequest(result.getFieldError().getDefaultMessage());
		} else {
			System.out.println("userDtoReq.getLogo()" + userDtoReq.getLogo());
			String fileName = userDtoReq.getLogo() == null ? null
					: UploadFileUtlity.uploadFiles(userDtoReq.getLogo(), "logo", null);
			User user = modelMapper.map(userDtoReq, User.class);
			user.setLogo(fileName);
			User user1 = userService.findUserByEmailId(user.getEmail_id());
			if (user1 == null) {
				user.setStatus(1);
				user.setPassword(User.PASSWORD_ENCODER.encode(user.getPassword()));
				user.setCreated_at(new Timestamp(new Date().getTime()));
				user.setRole("user");
				user.setLogo(fileName);
				user = userService.saveUser(user);
				UserDto userDto = modelMapper.map(user, UserDto.class);
				final JwtUser userDetails = (JwtUser) userDetailsService.loadUserByUsername(user.getEmail_id());
				final String token = jwtTokenUtil.generateToken(userDetails, request);
				data.put("access_token", token);
				data.put("user", userDto);
				response.put("data", data);
				response.put("status", "OK");
				response.put("code", "200");
				response.put("message", "Your account has been created successfully.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				throw new TaskTitleException("Email id already registered with us.");
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
			System.out.println("userDtoReq.getLogo()" + userDtoReq.getLogo());
			String fileName = userDtoReq.getLogo() == null ? null
					: UploadFileUtlity.uploadFiles(userDtoReq.getLogo(), "logo", null);
			User user = modelMapper.map(userDtoReq, User.class);
			user.setLogo(fileName);
			User user1 = userService.findUserByEmailId(user.getEmail_id());
			User user2 = userService.findUserByEmailId(user.getMobile_no());
			if(user2!=null){
				throw new TaskTitleException("Mobile Number already registered with us.");
			}
			
			if (user1 == null) {
				user.setStatus(1);
				user.setPassword(User.PASSWORD_ENCODER.encode(user.getPassword()));
				user.setCreated_at(new Timestamp(new Date().getTime()));
				user.setRole("user");
				user.setLogo(fileName);
				user.setSoftwareKey(LicenseKeyGenerator.generateLicenseKey());
				user = userService.saveUser(user);
				// UserDto userDto = modelMapper.map(user, UserDto.class);
				final JwtUser userDetails = (JwtUser) userDetailsService.loadUserByUsername(user.getEmail_id());
				final String token = jwtTokenUtil.generateToken(userDetails, request);
				try {
					emailService.sendHtmlEmail(user.getEmail_id(),user.getSoftwareKey(), user.getEmail_id(),user.getPassword(),user.getSoftwareType());
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				data.put("access_token", token);
				data.put("user", user);
				response.put("data", data);
				response.put("status", "OK");
				response.put("code", "200");
				response.put("message", "Your account has been created successfully.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				throw new TaskTitleException("Email id already registered with us.");
			}
		}
	}

	@RequestMapping(value = "login", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> login(@RequestBody(required = true) @Valid LoginRequest login,
			HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		User user = userService.findUserByEmailId(login.getUsername());
		if (user == null) {
			throw new TaskTitleNotFound("Email id not existing with us.");
		} else if (!(User.PASSWORD_ENCODER.matches(login.getPassword(), user.getPassword()))) {
			throw new TaskTitleException("Wrong password");
		} else {

			
			// if(user.getMacAddress().split("\\|")[0].equalsIgnoreCase(login.getMacAddress()))
			// {
//			UserDto userDto = modelMapper.map(user, UserDto.class);
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
//		else {
//			throw new TaskTitleException("Your are recently changed the System");
//		}
	}

	@RequestMapping(value = "key/verify", method = RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> verifyKey(
			@RequestBody(required = true) @Valid VerifyKeyRequest verifyKeyRequest, HttpServletRequest request) {
		Map<String, Object> response = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		User user = userService.findUserByEmailId(verifyKeyRequest.getUsername());
		if (user == null) {
			response.put("status", "BAD_GATEWAY");
			response.put("code", "400");
			response.put("message", "Email id not existing with us.");
			return new ResponseEntity<>(response, HttpStatus.BAD_GATEWAY);
		} else if (user.getSoftwareKey().equalsIgnoreCase(verifyKeyRequest.getSoftwareKey())) {
//			user.setSoftwareInstalationCount(user.getSoftwareInstalationCount()+1);
			user.setMacAddress(
					verifyKeyRequest.getMacAddress() + user.getMacAddress() != null ? ("|" + user.getMacAddress())
							: "");
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
}
