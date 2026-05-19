package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.LoginActivity;
import com.rigel.user.model.dto.SearchCriteria;

public interface ILoginInfoService {
	
	public List<LoginActivity> saveLoginActivity(List<LoginActivity> loginActivity);

    public LoginActivity updateLoginActivity(LoginActivity loginActivity);
	
	public List<LoginActivity> searchSalesInfo(SearchCriteria criteria);
	
	public LoginActivity findLoginActivityByUsername(String username);

}
