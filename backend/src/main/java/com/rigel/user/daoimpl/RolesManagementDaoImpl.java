package com.rigel.user.daoimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.IBuyerDao;
import com.rigel.user.dao.IItemsDao;
import com.rigel.user.dao.IRolesManagementDao;
import com.rigel.user.model.BuyerInfo;
import com.rigel.user.model.Items;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.Pages;
import com.rigel.user.model.RolesPagePermision;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.dto.MenuDto;
import com.rigel.user.model.dto.SearchCriteria;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class RolesManagementDaoImpl implements IRolesManagementDao {

	@Autowired
	private EntityManager entityManager;

	@Override
	public RolesPagePermision saveRolesPagePermission(RolesPagePermision rolesPagePermision) {
		return entityManager.merge(rolesPagePermision);
	}

	@Override
	public List<RolesPagePermision> searchRolesPagePermision(SearchCriteria criteria) {

		String jpql = """
				    SELECT rpp
				    FROM RolesPagePermision rpp
				    WHERE rpp.ownerId = :ownerId
				    AND rpp.roleId.id = :roleId
				    AND rpp.pageId.id = :pageId
				""";

		return entityManager.createQuery(jpql, RolesPagePermision.class).setParameter("ownerId", criteria.getUserId())
				.setParameter("roleId", criteria.getRoleId()).setParameter("pageId", criteria.getPageId())
				.getResultList();
	}

	@Override
	public List<Pages> fetchPagesList(SearchCriteria criteria) {

		String jpql = """
				SELECT p
				FROM Pages p
				WHERE p.status = true
				ORDER BY p.tab DESC
				""";

		return entityManager.createQuery(jpql, Pages.class).getResultList();
	}

	@Override
	public RolesPagePermision findRolesPagePermissionById(Long id) {

		String jpql = "SELECT r FROM RolesPagePermision r WHERE r.id = :id";

		return entityManager.createQuery(jpql, RolesPagePermision.class).setParameter("id", Long.valueOf(id))
				.getSingleResult();
	}

	@Override
	public List<MenuDto> getMenus(Long roleId, Integer ownerId) {

		if (roleId == 1) {
			return entityManager.createQuery("""
					    SELECT new com.rigel.user.model.dto.MenuDto(
					        p.tab,
					        p.label,
					        p.path,
					        p.icon
					    )
					    FROM Pages p
					    WHERE p.status = true
					    ORDER BY p.id
					""", MenuDto.class).getResultList();
		}

		return entityManager.createQuery("""
				SELECT new com.rigel.user.model.dto.MenuDto(
				    p.tab,
				    p.label,
				    p.path,
				    p.icon
				)
				FROM RolesPagePermision rpp
				JOIN rpp.pageId p
				WHERE rpp.roleId.id = :roleId
				  AND rpp.ownerId = :ownerId
				  AND rpp.canView = true
				ORDER BY p.id
				""", MenuDto.class).setParameter("roleId", roleId).setParameter("ownerId", ownerId).getResultList();
	}

	@Override
	public Long getRoleIdByRole(String role) {

		try {
			return entityManager.createQuery("""
					SELECT r.id
					FROM Roles r
					WHERE UPPER(r.role) = UPPER(:role)
					""", Long.class).setParameter("role", role).getSingleResult();

		} catch (Exception e) {
			return null;
		}
	}
// office section
	@Override
	public OfficeBranch saveOfficeBranch(OfficeBranch officeBranch) {
		return entityManager.merge(officeBranch);
	}

	@Override
	public List<OfficeBranch> searchOfficeBranch(SearchCriteria search) {

	    StringBuilder jpql = new StringBuilder(
	            "SELECT o FROM OfficeBranch o WHERE o.ownerId = :ownerId"
	    );

	    if (search.getSearchKeyword() != null &&
	        !search.getSearchKeyword().trim().isEmpty()) {

	        jpql.append(
	            " AND (" +
	            "LOWER(o.branchCode) LIKE :keyword OR " +
	            "LOWER(o.branchName) LIKE :keyword OR " +
	            "LOWER(o.address) LIKE :keyword OR " +
	            "LOWER(o.additionalDetails) LIKE :keyword" +
	            ")"
	        );
	    }
	    if (search.getItemId() != null&&!search.getItemId().isBlank()) {
	    	 jpql.append(" AND o.id =: id ");
	    }

	    TypedQuery<OfficeBranch> query =
	            entityManager.createQuery(jpql.toString(), OfficeBranch.class);

	    query.setParameter("ownerId", search.getUserId());

	    if (search.getSearchKeyword() != null &&
	        !search.getSearchKeyword().trim().isEmpty()) {

	        query.setParameter(
	                "keyword",
	                "%" + search.getSearchKeyword().toLowerCase() + "%"
	        );
	    }
	    if (search.getItemId() != null&&!search.getItemId().isBlank()) {
	    	query.setParameter("id", search.getItemId());

	    }

	    return query
	            .setFirstResult(0)
	            .setMaxResults(11)
	            .getResultList();
	}

	@Override
	public OfficeBranch updateOfficeBranch(OfficeBranch officeBranch) {
		return entityManager.merge(officeBranch);
	}

	@Override
	public SubscriptionPlan saveSubscriptionPlan(SubscriptionPlan subscription) {
		return entityManager.merge(subscription);
	}

	@Override
	public SubscriptionPlan findBySubscriptionCode(String code) {
	    try {
	        return entityManager.createQuery(
	                "SELECT sp FROM SubscriptionPlan sp WHERE sp.status=true AND sp.subscriptionCode = :code",
	                SubscriptionPlan.class)
	                .setParameter("code", code)
	                .getSingleResult();
	    } catch (Exception e) {
	        return null;
	    }
	}

}