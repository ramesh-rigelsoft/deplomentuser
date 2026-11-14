package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.Pages;
import com.rigel.user.model.RolesPagePermision;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.dto.MenuDto;
import com.rigel.user.model.dto.SearchCriteria;

public interface IRolesManagementService {

	public RolesPagePermision saveRolesPagePermission(RolesPagePermision polesPagePermision);
	
	public RolesPagePermision findRolesPagePermissionById(String id);

	public List<RolesPagePermision> searchRolesPagePermision(SearchCriteria criteria);
	
	public List<RolesPagePermision> fetchPermittedPagesRoleWise(SearchCriteria criteria);
	
	public int removePagesPermission(SearchCriteria criteria);
	
	public List<Pages> fetchPagesList(SearchCriteria criteria);
	
	public List<MenuDto> getMenus(Long roleId, Integer ownerId,String branchCode);
	
	public Long getRoleIdByRole(String role);
	
	public OfficeBranch saveOfficeBranch(OfficeBranch officeBranch);
	public List<OfficeBranch> searchOfficeBranch(SearchCriteria search);
	public OfficeBranch updateOfficeBranch(OfficeBranch officeBranch);
	
	//sub
	public SubscriptionPlan findBySubscriptionCode(String code);


}
