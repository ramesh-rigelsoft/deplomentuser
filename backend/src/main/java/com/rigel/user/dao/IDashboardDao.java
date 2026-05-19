package com.rigel.user.dao;

import java.util.List;
import java.util.Map;

import com.rigel.user.model.BuyerInfo;
import com.rigel.user.model.dto.SearchCriteria;

public interface IDashboardDao {

	public Map<String, Object> viewDashboard(String cycle,int ownerId);


}
