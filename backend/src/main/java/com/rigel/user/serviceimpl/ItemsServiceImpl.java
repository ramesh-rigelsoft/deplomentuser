package com.rigel.user.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.IItemsDao;
import com.rigel.user.model.Items;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.service.IItemsService;

@Service
@CacheConfig(cacheNames = "userCache", keyGenerator = "TransferKeyGenerator")
public class ItemsServiceImpl implements IItemsService {

	@Autowired
	IItemsDao itemsDao;
	
	@Override
	public Items saveItems(Items items) {
		return itemsDao.saveItems(items);
	}

	@Override
	public Items updateItems(Items items) {
		return itemsDao.updateItems(items);
	}

	@Override
	public int deleteItems(List<Long> itemsId) {
		return itemsDao.deleteItems(itemsId);
	}

	@Override
	public List<Items> searchItems(SearchCriteria criteria) {
		return itemsDao.searchItems(criteria);
	}
	
}
