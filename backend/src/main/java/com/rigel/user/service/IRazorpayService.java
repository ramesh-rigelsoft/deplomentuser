package com.rigel.user.service;

import java.util.Map;

public interface IRazorpayService {

    Map<String, Object> createOrder(double amount, String receipt, String currency, Map<String, String> notes);

    boolean verifyPaymentSignature(String orderId, String paymentId, String signature);

    boolean verifyWebhookSignature(String payload, String signature);

    String getKeyId();

    boolean isMockMode();
}

