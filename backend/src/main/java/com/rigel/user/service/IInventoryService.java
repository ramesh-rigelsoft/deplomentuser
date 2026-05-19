package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.Inventory;
import com.rigel.user.model.dto.SearchCriteria;

import jakarta.persistence.EntityManager;

public interface IInventoryService {

	public Inventory saveInventory(Inventory inventory,String itemCode,EntityManager entityManager);

	public Inventory getInventryByItemCode(String itemCode,int qty, EntityManager entityManager);
	
	public Inventory updateInventory(Inventory inventory);

	public int deleteInventory(String itemCode);

	public List<Inventory> searchInventory(SearchCriteria criteria);

}
