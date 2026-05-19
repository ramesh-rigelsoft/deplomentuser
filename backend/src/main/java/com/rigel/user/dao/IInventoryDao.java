package com.rigel.user.dao;

import java.util.List;

import com.rigel.user.model.Inventory;
import com.rigel.user.model.Items;
import com.rigel.user.model.dto.SearchCriteria;

public interface IInventoryDao {
	
//    public Inventory saveInventory(Inventory inventory);
	
    public Inventory updateInventory(Inventory inventory);
	
	public int deleteInventory(String itemCode);
	
	public int updateInventory(String itemCode,int qty);
	
	public Inventory findInventoryByCode(String itemCode);
	
	public List<Inventory> searchInventory(SearchCriteria criteria);

}
