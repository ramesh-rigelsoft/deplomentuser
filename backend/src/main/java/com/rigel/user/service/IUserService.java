package com.rigel.user.service;

import java.util.List;
import java.util.Map;

import com.rigel.user.model.Mail;
import com.rigel.user.model.User;
import com.rigel.user.model.UserOtp;

public interface IUserService {
	
	public User saveUser(User user);
	
	public User findUserById(int id);
	
	public User findUserByEmailId(String email);
	
	public Map<String,Object> sendEmailToAll(Mail emailDetails);
	
	public UserOtp saveUserOTP(UserOtp otp);

	public UserOtp findUserOtpByMobileNo(String mobileNo);

	
}
