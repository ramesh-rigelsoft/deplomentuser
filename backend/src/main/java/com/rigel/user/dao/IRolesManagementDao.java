package com.rigel.user.dao;

import java.util.List;

import com.rigel.user.model.BuyerInfo;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.Pages;
import com.rigel.user.model.RolesPagePermision;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.dto.MenuDto;
import com.rigel.user.model.dto.SearchCriteria;

public interface IRolesManagementDao {

	public RolesPagePermision saveRolesPagePermission(RolesPagePermision polesPagePermision);

	public RolesPagePermision findRolesPagePermissionById(Long id);

	public List<RolesPagePermision> searchRolesPagePermision(SearchCriteria criteria);

	public List<Pages> fetchPagesList(SearchCriteria criteria);

	public List<MenuDto> getMenus(Long roleId, Integer ownerId);
	
	public Long getRoleIdByRole(String role);
	
	//branch Section
	public OfficeBranch saveOfficeBranch(OfficeBranch officeBranch);
	public List<OfficeBranch> searchOfficeBranch(SearchCriteria search);
	public OfficeBranch updateOfficeBranch(OfficeBranch officeBranch);
    // subcription management
	public SubscriptionPlan saveSubscriptionPlan(SubscriptionPlan subscription);
	public SubscriptionPlan findBySubscriptionCode(String code);


}
