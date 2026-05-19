package com.rigel.user.service;

import com.rigel.user.model.LoginDetails;

public interface IUserLogOutIn {
	
	public LoginDetails loginUser(LoginDetails LoginDetails);
	public LoginDetails logOutUser(int id,String username);
	public LoginDetails fetchLogInUser(int id);
	public LoginDetails updateCount(LoginDetails loginDetails);

}
