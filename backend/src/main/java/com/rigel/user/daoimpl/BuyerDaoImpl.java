package com.rigel.user.daoimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.IBuyerDao;
import com.rigel.user.dao.IItemsDao;
import com.rigel.user.model.BuyerInfo;
import com.rigel.user.model.Items;
import com.rigel.user.model.dto.SearchCriteria;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class BuyerDaoImpl implements IBuyerDao {

	@Autowired
	private EntityManager entityManager;

	@Override
	public BuyerInfo saveBuyerInfo(BuyerInfo buyerInfo) {
		try {
			return entityManager.merge(buyerInfo);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public BuyerInfo updateBuyerInfo(BuyerInfo buyerInfo) {
		try {
			return entityManager.merge(buyerInfo);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public int deleteBuyerInfo(List<Long> buyerId) {
		int query = entityManager.createQuery("delete from buyer_info where id in(" + buyerId + ")").executeUpdate();
		return query;
	}

	@Override
	public List<BuyerInfo> searchBuyerInfo(SearchCriteria criteria) {
		// TODO Auto-generated method stub
		return null;
	}

}