package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.Items;
import com.rigel.user.model.dto.SearchCriteria;

public interface IItemsService {

	public Items saveItems(Items items);

	public Items updateItems(Items items);

	public int deleteItems(List<Long> itemsId);

	public List<Items> searchItems(SearchCriteria criteria);

}
