package com.rigel.user.serviceimpl;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.rigel.user.config.RazorpayConfig;
import com.rigel.user.exception.BadGatewayRequest;
import com.rigel.user.service.IRazorpayService;

@Service
public class RazorpayServiceImpl implements IRazorpayService {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayServiceImpl.class);

    @Autowired
    private RazorpayConfig razorpayConfig;

    @Autowired(required = false)
    private RazorpayClient razorpayClient;

    @Override
    public Map<String, Object> createOrder(double amount, String receipt, String currency, Map<String, String> notes) {
        Map<String, Object> response = new HashMap<>();
        long amountInPaise = Math.round(amount * 100);

        if (razorpayConfig.isMockMode() || razorpayClient == null) {
            String mockOrderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            logger.info("Created Mock Razorpay Order: id={}, amount={}, currency={}", mockOrderId, amountInPaise, currency);
            response.put("id", mockOrderId);
            response.put("orderId", mockOrderId);
            response.put("amount", amountInPaise);
            response.put("currency", currency != null ? currency : "INR");
            response.put("receipt", receipt);
            response.put("status", "created");
            response.put("keyId", razorpayConfig.getKeyId());
            response.put("mockMode", true);
            return response;
        }

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", currency != null && !currency.isEmpty() ? currency : "INR");
            orderRequest.put("receipt", receipt != null && !receipt.isEmpty() ? receipt : "receipt_" + System.currentTimeMillis());

            if (notes != null && !notes.isEmpty()) {
                JSONObject notesJson = new JSONObject();
                notes.forEach(notesJson::put);
                orderRequest.put("notes", notesJson);
            }

            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = String.valueOf(order.get("id"));
            logger.info("Created Razorpay Order successfully: id={}", orderId);

            response.put("id", orderId);
            response.put("orderId", orderId);
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("receipt", order.get("receipt"));
            response.put("status", order.get("status"));
            response.put("keyId", razorpayConfig.getKeyId());
            response.put("mockMode", false);
            return response;
        } catch (Exception e) {
            logger.error("Error creating Razorpay Order: {}", e.getMessage(), e);
            throw new BadGatewayRequest("Failed to create Razorpay Order: " + e.getMessage());
        }
    }

    @Override
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        if (orderId == null || paymentId == null || signature == null) {
            logger.warn("Razorpay verification failed: Missing required fields (orderId={}, paymentId={}, signature={})",
                    orderId, paymentId, signature);
            return false;
        }

        if (razorpayConfig.isMockMode()) {
            logger.info("Razorpay in MOCK MODE: Payment signature automatically verified for orderId={}", orderId);
            return true;
        }

        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);
            boolean verified = Utils.verifyPaymentSignature(attributes, razorpayConfig.getKeySecret());
            if (verified) {
                return true;
            }
        } catch (Exception e) {
            logger.warn("Utils.verifyPaymentSignature threw exception: {}. Falling back to manual HMAC SHA256", e.getMessage());
        }

        return verifyHmacSha256(orderId + "|" + paymentId, signature, razorpayConfig.getKeySecret());
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signature) {
        if (payload == null || signature == null) {
            return false;
        }
        if (razorpayConfig.isMockMode()) {
            return true;
        }
        try {
            return Utils.verifyWebhookSignature(payload, signature, razorpayConfig.getWebhookSecret());
        } catch (Exception e) {
            logger.error("Error verifying Razorpay webhook signature: {}", e.getMessage(), e);
            return false;
        }
    }

    private boolean verifyHmacSha256(String data, String signature, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString().equalsIgnoreCase(signature);
        } catch (Exception e) {
            logger.error("Error computing HMAC SHA256 signature: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public String getKeyId() {
        return razorpayConfig.getKeyId();
    }

    @Override
    public boolean isMockMode() {
        return razorpayConfig.isMockMode();
    }
}

