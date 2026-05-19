package com.rigel.user.daoimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.IItemsDao;
import com.rigel.user.dao.ISalesDao;
import com.rigel.user.model.Inventory;
import com.rigel.user.model.Items;
import com.rigel.user.model.SalesInfo;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.querybuilder.SalesQueryBuilder;
import com.rigel.user.service.IInventoryService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class SalesDaoImpl implements ISalesDao {

	@Autowired
	private EntityManager entityManager;
	
	@Autowired
	IInventoryService iInventoryService;
	
	@Autowired
	SalesQueryBuilder salesQueryBuilder;

	@Override
	public List<SalesInfo> saveSalesInfo(List<SalesInfo> salesInfoList) {
	    List<SalesInfo> savedSales = new ArrayList<>();
	    for (SalesInfo sale : salesInfoList) {
	        SalesInfo saved = entityManager.merge(sale); // Merge one entity at a time
	        savedSales.add(saved);
	    }
	    return savedSales;
	}

	@Override
	public SalesInfo updateSalesInfo(SalesInfo salesInfo) {
		try {
			return entityManager.merge(salesInfo);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public int deleteItems(List<Long> salesId) {
		int query = entityManager.createQuery("delete from sales_info where id in(" + salesId + ")").executeUpdate();
		return query;
	}

	@Override
	public List<SalesInfo> searchSalesInfo(SearchCriteria criteria) {

	    List<SalesInfo> d = entityManager.createQuery(
	        "SELECT i FROM SalesInfo i INNER JOIN FETCH i.buyerInfo ORDER BY i.createdAt DESC",
	        SalesInfo.class
	    ).getResultList();

	    return d;
	}

}