package com.rigel.user.dao;

import java.util.List;

import com.rigel.user.model.BuyerInfo;
import com.rigel.user.model.RolesPagePermision;
import com.rigel.user.model.dto.SearchCriteria;

public interface IRolesManagementDao {

    public RolesPagePermision saveRolesPagePermission(RolesPagePermision polesPagePermision);
	public List<RolesPagePermision> searchRolesPagePermision(SearchCriteria criteria);

}
