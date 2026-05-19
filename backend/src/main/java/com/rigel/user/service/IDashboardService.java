package com.rigel.user.service;

import java.time.ZoneId;
import java.util.List;
import java.util.Map;

import com.rigel.user.model.Inventory;
import com.rigel.user.model.SalesInfo;
import com.rigel.user.model.dto.ItemSalesCompare;

public interface IDashboardService {
	
	public Map<String, Object> viewDashboard(String cycle,int ownerId);
}