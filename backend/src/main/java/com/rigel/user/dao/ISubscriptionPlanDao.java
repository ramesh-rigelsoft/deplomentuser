package com.rigel.user.dao;

import java.util.List;

import com.rigel.user.model.SubscriptionPlan;
import com.rigel.user.model.User;
import com.rigel.user.model.UserOtp;
import com.rigel.user.model.UserSubscription;
import com.rigel.user.model.UserSubscriptionLog;
import com.rigel.user.model.dto.SearchCriteria;

public interface ISubscriptionPlanDao {
	
    public UserSubscription saveUserSubscription(UserSubscription userSubscription);
    public void deactivateSubscription(Integer ownerId, String branchCode);
    public UserSubscriptionLog saveUserSubscriptionLogPlan(UserSubscriptionLog userSubscriptionPlan);
    public List<SubscriptionPlan> subscriptionPlanList();
    public List<UserSubscription> userSubscriptionPlanList(SearchCriteria searchCriteria);  
    
   	
}
