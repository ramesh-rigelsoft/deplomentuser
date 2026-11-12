package com.rigel.user.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.rigel.user.service.ISubscriptionPlanService;

import jakarta.transaction.Transactional;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    @Autowired
    private ISubscriptionPlanService subscriptionPlanService;

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("Initializing default subscription plans in database...");
            subscriptionPlanService.saveSubscriptionPlan();
            logger.info("Default subscription plans initialized successfully.");
        } catch (Exception e) {
            logger.error("Error initializing subscription plans: {}", e.getMessage(), e);
        }
    }
}
