package com.rigel.user.serviceimpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rigel.user.dao.IBuyerDao;
import com.rigel.user.dao.IInventoryDao;
import com.rigel.user.dao.IRolesManagementDao;
import com.rigel.user.dao.ISalesDao;
import com.rigel.user.model.BuyerInfo;
import com.rigel.user.model.Inventory;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.Pages;
import com.rigel.user.model.RolesPagePermision;
import com.rigel.user.model.SalesInfo;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.dto.MenuDto;
import com.rigel.user.model.dto.SalesRequest;
import com.rigel.user.model.dto.SalesResponse;
import com.rigel.user.model.dto.SearchCriteria;
import com.rigel.user.service.IBuyerInfoService;
import com.rigel.user.service.IRolesManagementService;

import jakarta.validation.ValidationException;

@Service
//@CacheConfig(cacheNames = "userCache", keyGenerator = "TransferKeyGenerator")
public class RolesManagementServiceImpl implements IRolesManagementService {
	
	@Autowired
	private IRolesManagementDao rolesManagementDao;

	@Override
	public RolesPagePermision saveRolesPagePermission(RolesPagePermision rolesPagePermision) {
		if(rolesPagePermision.getOwnerId()<1) {
			throw new ValidationException("Session Expired, Please Login again then try....");			
		}
		return rolesManagementDao.saveRolesPagePermission(rolesPagePermision);
	}

	@Override
	public List<RolesPagePermision> searchRolesPagePermision(SearchCriteria criteria) {
		return rolesManagementDao.searchRolesPagePermision(criteria);
	}

	@Override
	public List<Pages> fetchPagesList(SearchCriteria criteria) {
		return rolesManagementDao.fetchPagesList(criteria);
	}

	@Override
	public RolesPagePermision findRolesPagePermissionById(Long id) {
		return rolesManagementDao.findRolesPagePermissionById(id);
	}

	@Override
	public List<MenuDto> getMenus(Long roleId, Integer ownerId) {
		return rolesManagementDao.getMenus(roleId, ownerId);
	}

	@Override
	public Long getRoleIdByRole(String role) {
		return rolesManagementDao.getRoleIdByRole(role);
	}

	@Override
	public OfficeBranch saveOfficeBranch(OfficeBranch officeBranch) {
		officeBranch.setStatus(true);
		officeBranch.setCreatedAt(LocalDateTime.now());
		return rolesManagementDao.saveOfficeBranch(officeBranch);
	}

	@Override
	public List<OfficeBranch> searchOfficeBranch(SearchCriteria search) {
		return rolesManagementDao.searchOfficeBranch(search);
	}

	@Override
	public OfficeBranch updateOfficeBranch(OfficeBranch officeBranch) {
		return rolesManagementDao.updateOfficeBranch(officeBranch);
	}

	@Override
	public SubscriptionPlan findBySubscriptionCode(String code) {
		return rolesManagementDao.findBySubscriptionCode(code);
	}

	
	
}