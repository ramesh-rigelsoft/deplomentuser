package com.rigel.user.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.ILoginInfoDao;
import com.rigel.user.model.LoginActivity;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.service.ILoginInfoService;

import io.swagger.v3.oas.annotations.servers.Server;

@Service
public class LoginInfoService implements ILoginInfoService {
	
	@Autowired
	ILoginInfoDao loginInfoDao;

	@Override
	public List<LoginActivity> saveLoginActivity(List<LoginActivity> loginActivity) {
		return loginInfoDao.saveLoginActivity(loginActivity);
	}

	@Override
	public LoginActivity updateLoginActivity(LoginActivity loginActivity) {
		return loginInfoDao.updateLoginActivity(loginActivity);
	}

	@Override
	public List<LoginActivity> searchSalesInfo(SearchCriteria criteria) {
		return loginInfoDao.searchSalesInfo(criteria);
	}

	@Override
	public LoginActivity findLoginActivityByUsername(String username) {
		return loginInfoDao.findLoginActivityByUsername(username);
	}

}
