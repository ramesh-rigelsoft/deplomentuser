package com.rigel.user.daoimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rigel.user.dao.IItemsDao;
import com.rigel.user.model.Inventory;
import com.rigel.user.model.Items;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.querybuilder.ItemsQueryBuilder;
import com.rigel.user.service.IInventoryService;
import com.rigel.user.serviceimpl.FyIdGeneratorService;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class ItemsDaoImpl implements IItemsDao {

	@Autowired
	private EntityManager entityManager;

	@Autowired
	private ItemsQueryBuilder itemsQueryBuilder;

	@Autowired
	FyIdGeneratorService fyIdGeneratorService;

	@Autowired
	IInventoryService inventoryService;

	@Autowired
	ObjectMapper mapper;

	@Override
	public Items saveItems(Items items) {

		String existingItemCode=items.getItemCode();
		if (items.getItemCode() == null) {
			 items.setItemCode(fyIdGeneratorService.generateFyId(1,"ITM"));
		}
		Inventory Inventory = mapper.convertValue(items, Inventory.class);
		if(Inventory.getCategory().equals("Repair Installation")){
			Inventory.setQuantity(50);
		}
		
		Inventory existingInventory=inventoryService.saveInventory(Inventory,existingItemCode, entityManager);
		if(existingInventory!=null) {
			items.setItemCode(existingInventory.getItemCode());	
		}
		if(Inventory.getCategory().equals("Repair Installation")){
			items.setQuantity(50);
		}
		
		return entityManager.merge(items);
	}

	@Override
	public Items updateItems(Items items) {
		return entityManager.merge(items);
	}

	@Override
	public int deleteItems(List<Long> itemsId) {
		String hql = "DELETE FROM Items i WHERE i.id IN :ids";
		return entityManager.createQuery(hql).setParameter("ids", itemsId).executeUpdate();
	}

	@Override
	public List<Items> searchItems(SearchCriteria criteria) {
		return itemsQueryBuilder.searchItems(criteria, entityManager);
	}
}
