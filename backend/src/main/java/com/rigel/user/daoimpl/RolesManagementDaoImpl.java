package com.rigel.user.daoimpl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.IRolesManagementDao;
import com.rigel.user.model.OfficeBranch;
import com.rigel.user.model.Pages;
import com.rigel.user.model.RolesPagePermision;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.UserSubscription;
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
	public RolesPagePermision findRolesPagePermissionById(String id) {

		String jpql = "SELECT r FROM RolesPagePermision r WHERE r.id = :id";

		return entityManager.createQuery(jpql, RolesPagePermision.class).setParameter("id", id)
				.getSingleResult();
	}

//	@Override
//	public List<MenuDto> getMenus(Long roleId, Integer ownerId) {
//
//		if (roleId == 1) {
//			return entityManager.createQuery("""
//					    SELECT new com.rigel.user.model.dto.MenuDto(
//					        p.tab,
//					        p.label,
//					        p.path,
//					        p.icon
//					    )
//					    FROM Pages p
//					    WHERE p.status = true
//					    ORDER BY p.id
//					""", MenuDto.class).getResultList();
//		}
//
//		return entityManager.createQuery("""
//				SELECT new com.rigel.user.model.dto.MenuDto(
//				    p.tab,
//				    p.label,
//				    p.path,
//				    p.icon
//				)
//				FROM RolesPagePermision rpp
//				JOIN rpp.pageId p
//				WHERE rpp.roleId.id = :roleId
//				  AND rpp.ownerId = :ownerId
//				  AND rpp.canView = true
//				ORDER BY p.id
//				""", MenuDto.class).setParameter("roleId", roleId).setParameter("ownerId", ownerId).getResultList();
//	}

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

	    if (search.getSearchKeyword() != null && !search.getSearchKeyword().trim().isEmpty()) {
	        jpql.append(
	            " AND (" +
	            "LOWER(o.branchCode) LIKE :keyword OR " +
	            "LOWER(o.branchName) LIKE :keyword OR " +
	            "LOWER(o.address) LIKE :keyword OR " +
	            "LOWER(o.additionalDetails) LIKE :keyword" +
	            ")"
	        );
	    }

	    if (search.getBranchCode() != null && !search.getBranchCode().isBlank()) {
	        jpql.append(" AND LOWER(o.branchCode) = :branchCode");
	    }

	    if (search.getItemId() != null && !search.getItemId().isBlank()) {
	        jpql.append(" AND o.id = :id");
	    }

	    TypedQuery<OfficeBranch> query =
	        entityManager.createQuery(jpql.toString(), OfficeBranch.class);

	    query.setParameter("ownerId", search.getUserId());

	    if (search.getSearchKeyword() != null && !search.getSearchKeyword().trim().isEmpty()) {
	        query.setParameter(
	            "keyword",
	            "%" + search.getSearchKeyword().trim().toLowerCase() + "%"
	        );
	    }

	    if (search.getBranchCode() != null && !search.getBranchCode().isBlank()) {
	        query.setParameter(
	            "branchCode",
	            search.getBranchCode().trim().toLowerCase()
	        );
	    }

	    if (search.getItemId() != null && !search.getItemId().isBlank()) {
	        query.setParameter("id", search.getItemId());
	    }

	    return query.setFirstResult(0)
	                .setMaxResults(11)
	                .getResultList();
	}

	
//	@Override
//	public List<OfficeBranch> searchOfficeBranch(SearchCriteria search) {
//
//		StringBuilder jpql = new StringBuilder("SELECT o FROM OfficeBranch o WHERE o.ownerId = :ownerId");
//
//		if (search.getSearchKeyword() != null && !search.getSearchKeyword().trim().isEmpty()) {
//
//			jpql.append(" AND (" + "LOWER(o.branchCode) LIKE :keyword OR " + "LOWER(o.branchName) LIKE :keyword OR "
//					+ "LOWER(o.address) LIKE :keyword OR " + "LOWER(o.additionalDetails) LIKE :keyword" + ")");
//		}
//		if (search.getItemId() != null && !search.getItemId().isBlank()) {
//			jpql.append(" AND o.id =: id ");
//		}
//
//		TypedQuery<OfficeBranch> query = entityManager.createQuery(jpql.toString(), OfficeBranch.class);
//
//		query.setParameter("ownerId", search.getUserId());
//
//		if (search.getSearchKeyword() != null && !search.getSearchKeyword().trim().isEmpty()) {
//
//			query.setParameter("keyword", "%" + search.getSearchKeyword().toLowerCase() + "%");
//		}
//		if (search.getItemId() != null && !search.getItemId().isBlank()) {
//			query.setParameter("id", search.getItemId());
//
//		}
//
//		return query.setFirstResult(0).setMaxResults(11).getResultList();
//	}

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
			System.out.println("code---"+code);
			return entityManager.createQuery(
					"SELECT sp FROM SubscriptionPlan sp WHERE sp.subscriptionCode = :code",
					SubscriptionPlan.class).setParameter("code", code).getSingleResult();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public List<MenuDto> getMenus(Long roleId, Integer ownerId,String branchCode) {

		List<Object[]> rows;

		if (roleId == 1) {

			rows = entityManager.createQuery("""
					SELECT p.tab,
					       p.label,
					       p.path,
					       p.icon,
					       p.parent
					FROM Pages p
					WHERE p.status = true
					ORDER BY p.id
					""", Object[].class).getResultList();

		} else {

			rows = entityManager.createQuery("""
					SELECT p.tab,
					       p.label,
					       p.path,
					       p.icon,
					       p.parent
					FROM RolesPagePermision rpp
					JOIN rpp.pageId p
					WHERE rpp.roleId.id = :roleId
					  AND rpp.ownerId = :ownerId
					  AND rpp.branchCode = :branchCode
					  AND rpp.canView = true
					  AND p.status = true
					ORDER BY p.id
					""", Object[].class)
					.setParameter("roleId", roleId)
					.setParameter("ownerId", ownerId)
					.setParameter("branchCode", branchCode)
					.getResultList();
		}

		Map<String, MenuDto> menuMap = new LinkedHashMap<>();
		List<MenuDto> result = new ArrayList<>();

		// Create all menus first
		for (Object[] row : rows) {

			String tab = (String) row[0];

			MenuDto dto = MenuDto.builder().tab(tab).label((String) row[1]).path((String) row[2]).icon((String) row[3])
					.children(new ArrayList<>()).build();

			menuMap.put(tab.toLowerCase(), dto);
		}

		// Create hierarchy
		for (Object[] row : rows) {

			String tab = (String) row[0];
			String parent = (String) row[4];

			MenuDto currentMenu = menuMap.get(tab.toLowerCase());

			// Child menu
			if (parent != null && !parent.trim().isEmpty()) {

				String parentKey = parent.toLowerCase();

				MenuDto parentMenu = menuMap.get(parentKey);

				// Parent not available, create dynamically
				if (parentMenu == null) {

					parentMenu = MenuDto.builder().tab(parentKey).label(parent.toLowerCase()).path(null).icon(null)
							.children(new ArrayList<>()).build();

					menuMap.put(parentKey, parentMenu);
					result.add(parentMenu);
				}

				parentMenu.getChildren().add(currentMenu);

			} else {

				// Root menu
				result.add(currentMenu);
			}
		}

		return result;
	}

	@Override
	public UserSubscription getSubscriptionPlanByOwnerId(Integer ownerId, String branchCode) {
	    try {
	        return entityManager
	                .createQuery("FROM UserSubscription s WHERE s.ownerId = :ownerId AND s.branchCode = :branchCode", UserSubscription.class)
	                .setParameter("ownerId", ownerId)
	                .setParameter("branchCode", branchCode)
	                .getSingleResult();
	    } catch (Exception e) {
	        return null;
	    }
	}

	@Override
	public List<RolesPagePermision> fetchPermittedPagesRoleWise(SearchCriteria criteria) {
		String jpql = """
			    SELECT r
			    FROM RolesPagePermision r
			    JOIN FETCH r.pageId p
			    WHERE r.roleId.id = :roleId
			    AND r.ownerId = :ownerId
			    AND r.branchCode = :branchCode
			""";

			return entityManager
			        .createQuery(jpql, RolesPagePermision.class)
			        .setParameter("roleId", Long.valueOf(criteria.getRoleId()))
			        .setParameter("ownerId", criteria.getUserId())
			        .setParameter("branchCode", criteria.getBranchCode())
			        .getResultList();
	}

	@Override
	public int removePagesPermission(SearchCriteria criteria) {

	    String jpql = """
	        DELETE FROM RolesPagePermision r
	        WHERE r.id = :id
	          AND r.ownerId = :ownerId
	          AND r.branchCode = :branchCode
	    """;

	    return entityManager
	            .createQuery(jpql)
	            .setParameter("id", criteria.getId())
	            .setParameter("ownerId", criteria.getUserId())
	            .setParameter("branchCode", criteria.getBranchCode())
	            .executeUpdate();
	}

}