package com.rigel.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rigel.user.service.ISuperAdminService;

@RestController
@RequestMapping("/api/payment")
public class PaymentWebhookController {

    @Autowired
    private ISuperAdminService superAdminService;

    @PostMapping("/razorpay/webhook")
    public ResponseEntity<Map<String, Object>> razorpayWebhook(
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestBody(required = false) String payload) {

        Map<String, Object> result = superAdminService.processRazorpayWebhook(payload, signature);
        return ResponseEntity.ok(result);
    }
}
