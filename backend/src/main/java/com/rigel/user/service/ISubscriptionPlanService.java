package com.rigel.user.service;

import java.util.List;

import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.UserSubscription;
import com.rigel.user.model.UserSubscriptionLog;
import com.rigel.user.model.dto.SearchCriteria;

public interface ISubscriptionPlanService {
	
  public SubscriptionPlan saveSubscriptionPlan();
  
  public List<SubscriptionPlan> subscriptionPlanList();
  
  public List<UserSubscription> userSubscriptionPlanList(SearchCriteria searchCriteria);  
  
  public UserSubscription getSubscriptionPlanByOwnerId(Integer ownerId,String branchCode);
  
  public UserSubscription saveUserSubscriptionPlan(UserSubscription userSubscriptionPlan);
  public UserSubscriptionLog saveUserSubscriptionLogPlan(UserSubscriptionLog userSubscriptionPlan);
  
  public void deactivateSubscription(Integer ownerId, String branchCode);

}
