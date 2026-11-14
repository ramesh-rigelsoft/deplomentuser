package com.rigel.user.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import lombok.Getter;
import lombok.Setter;

@Configuration
@Getter
@Setter
public class RazorpayConfig {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayConfig.class);

    @Value("${razorpay.key-id:rzp_test_Tq0RoZ2YthqiqP}")
    private String keyId;

    @Value("${razorpay.key-secret:zYalDyZYGBKCOlwc05bN2TWT}")
    private String keySecret;

    @Value("${razorpay.webhook-secret:whsec_test_placeholder}")
    private String webhookSecret;

    @Value("${razorpay.mock-mode:false}")
    private boolean mockMode;

    @Bean
    public RazorpayClient razorpayClient() {
        if (mockMode) {
            logger.info("Razorpay is configured in MOCK MODE (razorpay.mock-mode=true). Real API calls will not be made.");
            return null;
        }
        try {
            if (keyId != null && !keyId.trim().isEmpty() && keySecret != null && !keySecret.trim().isEmpty()) {
                logger.info("Initializing RazorpayClient with Key ID: {}", keyId);
                return new RazorpayClient(keyId, keySecret);
            }
        } catch (RazorpayException e) {
            logger.error("Failed to initialize RazorpayClient: {}", e.getMessage(), e);
        }
        return null;
    }
}

