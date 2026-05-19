package com.rigel.user.dao;

import java.util.List;

import com.rigel.user.model.Items;
import com.rigel.user.model.LoginActivity;
import com.rigel.user.model.SalesInfo;
import com.rigel.user.model.TodoTask;
import com.rigel.user.model.dto.SearchCriteria;

public interface ILoginInfoDao {

	public List<LoginActivity> saveLoginActivity(List<LoginActivity> loginActivity);

    public LoginActivity updateLoginActivity(LoginActivity loginActivity);
	
	public List<LoginActivity> searchSalesInfo(SearchCriteria criteria);
	
	public LoginActivity findLoginActivityByUsername(String username);

}
