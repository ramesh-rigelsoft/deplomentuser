package com.rigel.user.dao;

import java.util.List;

import com.rigel.user.model.Items;
import com.rigel.user.model.TodoTask;
import com.rigel.user.model.dto.SearchCriteria;

public interface IItemsDao {

    public Items saveItems(Items items);
	
    public Items updateItems(Items items);
	
	public int deleteItems(List<Long> itemsId);
	
	public List<Items> searchItems(SearchCriteria criteria);

}
