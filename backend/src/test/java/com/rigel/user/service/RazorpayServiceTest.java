package com.rigel.user.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.rigel.user.config.RazorpayConfig;
import com.rigel.user.serviceimpl.RazorpayServiceImpl;

public class RazorpayServiceTest {

    private RazorpayConfig razorpayConfig;
    private RazorpayServiceImpl razorpayService;

    @BeforeEach
    public void setup() {
        razorpayConfig = new RazorpayConfig();
        razorpayConfig.setKeyId("rzp_test_Tq0RoZ2YthqiqP");
        razorpayConfig.setKeySecret("zYalDyZYGBKCOlwc05bN2TWT");
        razorpayConfig.setWebhookSecret("whsec_test_placeholder");
        razorpayConfig.setMockMode(true);

        razorpayService = new RazorpayServiceImpl();
        ReflectionTestUtils.setField(razorpayService, "razorpayConfig", razorpayConfig);
    }

    @Test
    public void testCreateMockOrder() {
        Map<String, String> notes = new HashMap<>();
        notes.put("userId", "123");
        notes.put("branchCode", "BR01");

        Map<String, Object> order = razorpayService.createOrder(499.0, "sub_123_test", "INR", notes);

        assertNotNull(order);
        assertNotNull(order.get("orderId"));
        assertEquals(49900L, order.get("amount"));
        assertEquals("INR", order.get("currency"));
        assertEquals("rzp_test_Tq0RoZ2YthqiqP", order.get("keyId"));
        assertEquals(true, order.get("mockMode"));
    }

    @Test
    public void testMockSignatureVerification() {
        boolean verified = razorpayService.verifyPaymentSignature("order_123", "pay_456", "mock_signature");
        assertTrue(verified);
    }

    @Test
    public void testRealHmacVerificationLogic() {
        razorpayConfig.setMockMode(false);

        String orderId = "order_9A33XWu170gUtm";
        String paymentId = "pay_29Ae35XduUtif5";
        String secret = "zYalDyZYGBKCOlwc05bN2TWT";

        // Generate expected signature for test
        String data = orderId + "|" + paymentId;
        String signature = null;
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            mac.init(new javax.crypto.spec.SecretKeySpec(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) sb.append('0');
                sb.append(hex);
            }
            signature = sb.toString();
        } catch (Exception e) {
            fail("Exception computing hash: " + e.getMessage());
        }

        boolean valid = razorpayService.verifyPaymentSignature(orderId, paymentId, signature);
        assertTrue(valid);

        boolean invalid = razorpayService.verifyPaymentSignature(orderId, paymentId, "invalid_signature");
        assertFalse(invalid);
    }
}

