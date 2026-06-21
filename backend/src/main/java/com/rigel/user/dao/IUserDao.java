package com.rigel.user.dao;

import java.util.List;

import com.rigel.user.model.User;
import com.rigel.user.model.UserOtp;
import com.rigel.user.model.dto.SearchCriteria;

public interface IUserDao {
	
    public User saveUser(User user);
    
    public User saveSubUser(User user);
    
    public User persistUser(User user);
	
	public User findUserById(int id);
	
	public User findUserByEmailId(String email,int existingId);
	
	public UserOtp saveUserOTP(UserOtp otp);

	public UserOtp findUserOtpByMobileNo(String mobileNo);
	
	public List<User> findUsers(SearchCriteria searcCriteria);
	
}
