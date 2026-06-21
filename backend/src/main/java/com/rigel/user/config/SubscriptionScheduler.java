//package com.rigel.user.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import com.rigel.user.service.ISubscriptionPlanService;
//
//@Component
//public class SubscriptionScheduler {
//
//	@Autowired
//	ISubscriptionPlanService subscriptionPlanService;
//
//	@Scheduled(fixedRate = 7500)
//	public void runEveryMinute() {
//		System.out.println("Abc----");
//		subscriptionPlanService.saveSubscriptionPlan();
//	}
//
//}
