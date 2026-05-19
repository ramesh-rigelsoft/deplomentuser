package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.Items;
import com.rigel.user.model.SalesInfo;
import com.rigel.user.model.dto.SearchCriteria;

public interface ISalesService {

    public List<SalesInfo> saveSalesInfo(List<SalesInfo> salesInfo);
	
    public SalesInfo updateSalesInfo(SalesInfo salesInfo);
	
	public int deleteItems(List<Long> salesId);
	
	public List<SalesInfo> searchSalesInfo(SearchCriteria criteria);
}
