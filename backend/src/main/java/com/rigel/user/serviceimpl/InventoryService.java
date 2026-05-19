package com.rigel.user.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.IInventoryDao;
import com.rigel.user.model.Inventory;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.service.IInventoryService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Service
public class InventoryService implements IInventoryService {
	
	@Autowired
	IInventoryDao iInventoryDao;

	@Override
	public Inventory saveInventory(Inventory inventory, String existingItemCode, EntityManager entityManager) {

	    // 1) If existingItemCode is provided -> update by itemCode only
	    if (existingItemCode != null && !existingItemCode.trim().isEmpty()) {

	        TypedQuery<Inventory> queryByItemcode = entityManager.createQuery(
	                "SELECT i FROM Inventory i WHERE i.itemCode = :itemcode",
	                Inventory.class
	        ).setParameter("itemcode", existingItemCode);

	        List<Inventory> results = queryByItemcode.getResultList();

	        if (!results.isEmpty()) {
	            Inventory existing = results.get(0);
	            existing.setQuantity(existing.getQuantity() + inventory.getQuantity());
	            return existing;  // managed entity auto updates
	        } else {
	            // If itemCode not found, create new
	            entityManager.persist(inventory);
	            return inventory;
	        }
	    }

	    // 2) If no itemCode provided -> null-safe matching on fields
	    String jpql =
	            "SELECT i FROM Inventory i " +
	            "WHERE i.category = :category " +
	            "AND i.categoryType = :categoryType " +
	            "AND i.measureType = :measureType " +
	            "AND i.brand = :brand " +
	            "AND i.modelName = :modelName " +
	            "AND i.initialPrice = :initialPrice " +
	            "AND i.sellingPrice = :sellingPrice " +

	            // RAM null-safe
	            "AND ( (i.ram = :ram) OR (i.ram IS NULL AND :ram IS NULL) ) " +
	            "AND ( (i.ramUnit = :ramUnit) OR (i.ramUnit IS NULL AND :ramUnit IS NULL) ) " +

	            // STORAGE null-safe
	            "AND ( (i.storage = :storage) OR (i.storage IS NULL AND :storage IS NULL) ) " +
	            "AND ( (i.storageUnit = :storageUnit) OR (i.storageUnit IS NULL AND :storageUnit IS NULL) ) " +
	            "AND ( (i.storageType = :storageType) OR (i.storageType IS NULL AND :storageType IS NULL) ) " +

	            // DESCRIPTION null-safe
	            "AND ( (i.description = :description) OR (i.description IS NULL AND :description IS NULL) ) " +

	            // COLOR null-safe
	            "AND ( (i.itemColor = :itemColor) OR (i.itemColor IS NULL AND :itemColor IS NULL) ) " +

	            // PROCESSOR null-safe
	            "AND ( (i.processor = :processor) OR (i.processor IS NULL AND :processor IS NULL) ) " +

	            // OS null-safe
	            "AND ( (i.operatingSystem = :operatingSystem) OR (i.operatingSystem IS NULL AND :operatingSystem IS NULL) ) " +

	            // SCREEN SIZE null-safe
	            "AND ( (i.screenSize = :screenSize) OR (i.screenSize IS NULL AND :screenSize IS NULL) ) " +

	            // ITEM GEN null-safe
	            "AND ( (i.itemGen = :itemGen) OR (i.itemGen IS NULL AND :itemGen IS NULL) )";

	    TypedQuery<Inventory> query = entityManager.createQuery(jpql, Inventory.class)
	            .setParameter("category", inventory.getCategory())
	            .setParameter("categoryType", inventory.getCategoryType())
	            .setParameter("measureType", inventory.getMeasureType())
	            .setParameter("brand", inventory.getBrand())
	            .setParameter("modelName", inventory.getModelName())
	            .setParameter("initialPrice", inventory.getInitialPrice())
	            .setParameter("sellingPrice", inventory.getSellingPrice())

	            .setParameter("ram", inventory.getRam())
	            .setParameter("ramUnit", inventory.getRamUnit())
	            .setParameter("storage", inventory.getStorage())
	            .setParameter("storageUnit", inventory.getStorageUnit())
	            .setParameter("storageType", inventory.getStorageType())

	            .setParameter("description", inventory.getDescription())
	            .setParameter("itemColor", inventory.getItemColor())

	            .setParameter("processor", inventory.getProcessor())
	            .setParameter("operatingSystem", inventory.getOperatingSystem())
	            .setParameter("screenSize", inventory.getScreenSize())
	            .setParameter("itemGen", inventory.getItemGen());

	    List<Inventory> results = query.getResultList();

	    Inventory existing = null;
	    if (!results.isEmpty()) {
	        existing = results.get(0);
	        existing.setQuantity(existing.getQuantity() + inventory.getQuantity());
	        entityManager.merge(existing);
	        return existing;
	    } else {
	        entityManager.persist(inventory);
	        return inventory;
	    }
	}



	@Override
	public Inventory updateInventory(Inventory inventory) {
		return iInventoryDao.updateInventory(inventory);
	}

//	@Override
//	public int deleteInventory(String itemCode) {
//		return iInventoryDao.deleteInventory(itemCode);
//	}

	@Override
	public List<Inventory> searchInventory(SearchCriteria criteria) {
		return iInventoryDao.searchInventory(criteria);
	}


	@Override
	public Inventory getInventryByItemCode(String itemCode,int qty, EntityManager entityManager) {
		String jpqlByItemCode = "SELECT i FROM Inventory i WHERE i.itemCode = :itemcode ";
		TypedQuery<Inventory> query = entityManager.createQuery(jpqlByItemCode, Inventory.class)
	            .setParameter("itemcode", itemCode);
		  Inventory results = query.getResultList().get(0);
		  results.setQuantity(results.getQuantity()-qty);
		return results;
	}



	@Override
	public int deleteInventory(String itemCode) {
		return iInventoryDao.deleteInventory(itemCode);
	}  
}