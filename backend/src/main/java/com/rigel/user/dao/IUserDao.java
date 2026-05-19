package com.rigel.user.dao;

import com.rigel.user.model.User;
import com.rigel.user.model.UserOtp;

public interface IUserDao {
	
    public User saveUser(User user);
	
	public User findUserById(int id);
	
	public User findUserByEmailId(String email);
	
	public UserOtp saveUserOTP(UserOtp otp);

	public UserOtp findUserOtpByMobileNo(String mobileNo);
	
}
