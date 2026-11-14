package com.rigel.user.daoimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.rigel.user.dao.ISubscriptionPlanDao;
import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.UserSubscription;
import com.rigel.user.model.UserSubscriptionLog;
import com.rigel.user.model.dto.SearchCriteria;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public class SubscriptionPlanDaoImpl implements ISubscriptionPlanDao {
	
	@Autowired
	private EntityManager entityManager;

	@Override
	public UserSubscription saveUserSubscription(UserSubscription userSubscription) {
		return entityManager.merge(userSubscription);
	}
	
	@Override
	public void deactivateSubscription(Integer ownerId, String branchCode) {

	    entityManager.createQuery(
	            "UPDATE UserSubscription u " +
	            "SET u.status = false " +
	            "WHERE u.ownerId = :ownerId " +
	            "AND u.branchCode = :branchCode")
	        .setParameter("ownerId", ownerId)
	        .setParameter("branchCode", branchCode)
	        .executeUpdate();
	}

	@Override
	public UserSubscriptionLog saveUserSubscriptionLogPlan(UserSubscriptionLog userSubscriptionPlan) {
		return entityManager.merge(userSubscriptionPlan);
	}

	@Override
	public List<SubscriptionPlan> subscriptionPlanList() {
	    return entityManager.createQuery(
	            "SELECT s FROM SubscriptionPlan s WHERE s.status = true ORDER BY s.id ASC",
	            SubscriptionPlan.class
	        )
	        .getResultList();
	}

	@Override
	public List<UserSubscription> userSubscriptionPlanList(SearchCriteria searchCriteria) {

//		System.out.println("searchCriteria.getUserId()----"+searchCriteria.getUserId());
		StringBuilder jpql = new StringBuilder();
		jpql.append("SELECT us FROM UserSubscription us WHERE us.ownerId = :ownerId ");
		if (searchCriteria.getBranchCode() != null && !searchCriteria.getBranchCode().strip().isEmpty()) {
			jpql.append("AND us.branchCode = :branchCode ");
		}
		jpql.append("ORDER BY us.createdAt DESC");
		TypedQuery<UserSubscription> query = entityManager.createQuery(jpql.toString(), UserSubscription.class);
		query.setParameter("ownerId", searchCriteria.getUserId());
		if (searchCriteria.getBranchCode() != null && !searchCriteria.getBranchCode().strip().isEmpty()) {
			query.setParameter("branchCode", searchCriteria.getBranchCode());
		}

		return query.getResultList();
	}
}
