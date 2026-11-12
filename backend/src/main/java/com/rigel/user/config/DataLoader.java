package com.rigel.user.config;

import java.sql.Timestamp;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.rigel.user.model.User;
import com.rigel.user.service.ISubscriptionPlanService;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    @Autowired
    private ISubscriptionPlanService subscriptionPlanService;

    @Autowired
    private EntityManager entityManager;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("Checking subscription plans in database...");
            List<com.rigel.user.model.SubscriptionPlan> existingPlans = entityManager.createQuery(
                    "SELECT sp FROM SubscriptionPlan sp", com.rigel.user.model.SubscriptionPlan.class
            ).getResultList();

            if (existingPlans == null || existingPlans.isEmpty()) {
                logger.info("No subscription plans found. Initializing defaults...");
                subscriptionPlanService.saveSubscriptionPlan();
                logger.info("Default subscription plans initialized successfully.");
            } else {
                logger.info("Found {} existing subscription plan(s). Preserving existing statuses and pricing.", existingPlans.size());
            }
        } catch (Exception e) {
            logger.error("Error checking/initializing subscription plans: {}", e.getMessage(), e);
        }

        try {
            logger.info("Checking for Super Admin user...");
            List<User> superAdmins = entityManager.createQuery(
                    "SELECT u FROM User u WHERE u.role = 'SUPER_ADMIN'",
                    User.class
            ).getResultList();

            if (superAdmins.isEmpty()) {
                logger.info("No Super Admin found. Creating default Super Admin account...");
                User superAdmin = new User();
                superAdmin.setName("System Super Admin");
                superAdmin.setEmail_id("superadmin@rigelsoft.com");
                superAdmin.setMobile_no("9999999999");
                superAdmin.setCountry_code("91");
                superAdmin.setPassword(passwordEncoder.encode("SuperAdmin@123"));
                superAdmin.setRole("SUPER_ADMIN");
                superAdmin.setStatus(1); // 1 = Active
                superAdmin.setCreated_at(new Timestamp(System.currentTimeMillis()));
                superAdmin.setBranchCount(999);
                superAdmin.setOwnerId(0);
                entityManager.persist(superAdmin);
                superAdmin.setOwnerId(superAdmin.getId());
                entityManager.merge(superAdmin);
                logger.info("Super Admin created successfully: superadmin@rigelsoft.com");
            } else {
                logger.info("Super Admin already exists: {}", superAdmins.get(0).getEmail_id());
            }
        } catch (Exception e) {
            logger.error("Error ensuring Super Admin user: {}", e.getMessage(), e);
        }
    }
}
