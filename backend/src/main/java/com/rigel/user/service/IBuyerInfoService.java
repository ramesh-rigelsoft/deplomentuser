package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.BuyerInfo;
import com.rigel.user.model.dto.SalesRequest;
import com.rigel.user.model.dto.SalesResponse;
import com.rigel.user.model.dto.SearchCriteria;

public interface IBuyerInfoService {

	public SalesResponse saveBuyerInfo(SalesRequest salesRequest);

	public SalesResponse updateBuyerInfo(SalesRequest salesRequest);

	public SalesResponse searchBuyerInfo(SearchCriteria criteria);

}
