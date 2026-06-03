package com.rigel.user.daoimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.IBuyerDao;
import com.rigel.user.dao.IItemsDao;
import com.rigel.user.dao.IRolesManagementDao;
import com.rigel.user.model.BuyerInfo;
import com.rigel.user.model.Items;
import com.rigel.user.model.RolesPagePermision;
import com.rigel.user.model.dto.SearchCriteria;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class RolesManagementDaoImpl implements IRolesManagementDao {

	@Autowired
	private EntityManager entityManager;

	@Override
	public RolesPagePermision saveRolesPagePermission(RolesPagePermision polesPagePermision) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<RolesPagePermision> searchRolesPagePermision(SearchCriteria criteria) {
		// TODO Auto-generated method stub
		return null;
	}

	

}