package com.rigel.user.serviceimpl;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.ValidationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rigel.user.dao.IUserDao;
import com.rigel.user.model.Mail;
import com.rigel.user.model.User;
import com.rigel.user.model.UserOtp;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.model.dto.UserDto;
import com.rigel.user.service.IUserService;

import lombok.experimental.StandardException;

@Service
//@CacheConfig(cacheNames = "userCache", keyGenerator = "TransferKeyGenerator")
public class UserServiceImpl implements IUserService {

	private volatile String em = null;

	Map<String, Object> smail = null;

	@Autowired
	private JavaMailSender emailSender;

	@Autowired
	private EmailService emailService;

	@Autowired
	private SpringTemplateEngine templateEngine;

	@Autowired
	private IUserDao userDao;
	
	@Autowired
	ObjectMapper objectMapper;

	@Override
	public User saveUser(User user) {
		return userDao.saveUser(user);
	}
	
	@Override
	public User saveSubUser(User user) {
		if(user.getOwnerId()<1) {
			throw new ValidationException("Session Expired, Please Login again then try....");			
		}
		return userDao.saveSubUser(user);
	}
	
	@Override
	public User saveUserDto(UserDto userDto) {
		int userId = userDto.getId();
		if (userId > 0) {
			User dbUser = userDao.findUserById(userId);	
			if (userDto.getOwnerId() < 1) {
				throw new ValidationException("Session Expired, Please Login again then try....");
			}

			
			if (dbUser == null) {
				throw new ValidationException("User not found");
			}
			mapUserFields(userDto, dbUser);
			// 👇 SINGLE METHOD CALL
			return userDao.saveUser(dbUser);
		} else {
			User user=objectMapper.convertValue(userDto, User.class);
			return userDao.saveUser(user);
		}
	}

	@Override
	public User findUserById(int id) {
		return userDao.findUserById(id);
	}

	@Override
	public User findUserByEmailId(String email, int existingId) {
		return userDao.findUserByEmailId(email, existingId);
	}

	@Override
	public Map<String, Object> sendEmailToAll(Mail emailDetails) {
		smail = Collections.synchronizedMap(new HashMap<>());
		List<String> invalidEmail = new CopyOnWriteArrayList<>();
		List<String> validEmail = new CopyOnWriteArrayList<>();
		emailDetails.getTo().stream().forEach(toEmail -> {
			CompletableFuture.runAsync(() -> {
				try {
					em = toEmail;
					/// Mail mail = new ObjectMapper.readValue(jsonStr, Mail.class);
					Map<String, Object> data = new HashMap<>();

					MimeMessage message = emailSender.createMimeMessage();
					MimeMessageHelper helper = new MimeMessageHelper(message,
							MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
//					Context context = new Context();
//					// context.setVariables(mail.getModel());
//					String html = templateEngine.process(
//							"path for html page in templates  or fontend folder or html page name in templates folder ",
//							context);

					helper.setTo(toEmail);
					helper.setText(emailDetails.getBody(), true);
					helper.setSubject(emailDetails.getSubject());
					helper.setFrom("rameshkumar13111@gmail.com");
					emailSender.send(message);

//					emailData(toEmail,1);
					validEmail.add(em);
				} catch (MessagingException e) {

//					emailData(toEmail,2);
					e.printStackTrace();
				} catch (Exception e2) {
					invalidEmail.add(em);
					System.out.println("aaaaaaaaaaaaaaaaaaaa");
					e2.printStackTrace();
					// TODO: handle exception
				}
				smail.put("emailSend", validEmail);
				smail.put("invalidEmail", invalidEmail);

			});
			System.out.println(smail);
		});
		try {
			Thread.sleep(3000 * emailDetails.getTo().stream().count());
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// TODO Auto-generated method stub
		return smail;
	}

	private void emailData(String e, int status) {
		if (status == 1) {
			smail.put("emailSend", e);
		} else {
			smail.put("invalidEmail", e);
		}
		System.out.println(smail);

	}

	@Override
	public UserOtp saveUserOTP(UserOtp otp) {
		int num = (int) (Math.random() * 900000) + 100000;
		try {
			emailService.sendOtpEmail(otp.getEmailId(), num + "", otp.getSoftwareType());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		otp.setOtp(String.valueOf(num));
		otp.setCreated_at(LocalDateTime.now());
		otp.setExpaire_at(LocalDateTime.now().plusMinutes(15));
		otp.setStatus(1);
		return userDao.saveUserOTP(otp);
	}

	@Override
	public UserOtp findUserOtpByMobileNo(String mobileNo) {
		return userDao.findUserOtpByMobileNo(mobileNo);
	}

	@Override
	public List<User> findUsers(SearchCriteria searcCriteria) {
		return userDao.findUsers(searcCriteria);
	}
	
	private void mapUserFields(UserDto source, User target) {

		// ===== BASIC INFO =====
		target.setName(source.getName());
		target.setEmail_id(source.getEmail_id());
		target.setMobile_no(source.getMobile_no());
//		target.setCountry_code(source.getCountry_code());
		target.setGender(source.getGender());
//		target.setRole(source.getRole());
//		target.setStatus(source.getStatus());

		// ===== PASSWORD (ONLY IF PROVIDED) =====
//	    if (source.getPassword() != null && !source.getPassword().trim().isEmpty()) {
//	        target.setPassword(
//	            User.PASSWORD_ENCODER.encode(source.getPassword())
//	        );
//	    }

		// ===== COMPANY INFO =====
		target.setSoftwareType(source.getSoftwareType());
		target.setShopType(source.getShopType());
		target.setCompanyName(source.getCompanyName());
//		target.setCompanyLogo(source.getCompanyLogo());

		target.setGstNumber(source.getGstNumber());
		target.setPanNumber(source.getPanNumber());
		target.setCinNumber(source.getCinNumber());

		target.setAddressLine1(source.getAddressLine1());
		target.setAddressLine2(source.getAddressLine2());
		target.setCity(source.getCity());
		target.setState(source.getState());
		target.setCountry(source.getCountry());
		target.setPincode(source.getPincode());

		target.setWebsite(source.getWebsite());
		target.setCompanyType(source.getCompanyType());
//		target.setCompanyEmployeeCount(source.getCompanyEmployeeCount());

		// ===== EXTRA INFO =====
//		if (source.getLogo() != null) {
//			target.setLogo(source.getLogo());
//		}
//		target.setSoftwareKey(source.getSoftwareKey());
//		target.setMacAddress(source.getMacAddress());
//
//		target.setOwnerId(source.getOwnerId());
	}

	@Override
	public User persistUser(User user) {
		return userDao.persistUser(user);
	}

}
