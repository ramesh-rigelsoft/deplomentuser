package com.rigel.user.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.IItemsDao;
import com.rigel.user.dao.ISalesDao;
import com.rigel.user.model.Items;
import com.rigel.user.model.SalesInfo;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.service.IItemsService;
import com.rigel.user.service.ISalesService;

@Service
@CacheConfig(cacheNames = "userCache", keyGenerator = "TransferKeyGenerator")
public class SalesServiceImpl implements ISalesService {

	@Autowired
	ISalesDao salesDao;

	@Override
	public List<SalesInfo> saveSalesInfo(List<SalesInfo> salesInfo) {
		return salesDao.saveSalesInfo(salesInfo);
	}

	@Override
	public SalesInfo updateSalesInfo(SalesInfo salesInfo) {
		return salesDao.updateSalesInfo(salesInfo);
	}

	@Override
	public int deleteItems(List<Long> salesId) {
		return salesDao.deleteItems(salesId);
	}

	@Override
	public List<SalesInfo> searchSalesInfo(SearchCriteria criteria) {
		return salesDao.searchSalesInfo(criteria);
	}

	
}
