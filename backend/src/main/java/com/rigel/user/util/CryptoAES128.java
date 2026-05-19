package com.rigel.user.util;
//package com.app.todoapp.util;
//
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import jakarta.annotation.PostConstruct;
//import javax.crypto.Cipher;
//import javax.crypto.KeyGenerator;
//import javax.crypto.SecretKey;
//import javax.crypto.spec.IvParameterSpec;
//
//import java.nio.charset.StandardCharsets;
//import java.security.SecureRandom;
//import java.util.Base64;
//
//@Slf4j
//@Service
//public class CryptoAES128 {
//
//    private static final String AES = "AES";
//    private static final String AES_CBC_PKCS5 = "AES/CBC/PKCS5Padding";
//
//    private SecretKey secretKey;
//    private IvParameterSpec iv;
//
//    @PostConstruct
//    public void init() {
//        try {
//            // Generate AES-128 key
//            KeyGenerator keyGen = KeyGenerator.getInstance(AES);
//            keyGen.init(128); // AES-128
//            secretKey = keyGen.generateKey();
//
//            // Generate random IV (16 bytes for AES)
//            byte[] ivBytes = new byte[16];
//            SecureRandom random = new SecureRandom();
//            random.nextBytes(ivBytes);
//            iv = new IvParameterSpec(ivBytes);
//
//            log.info("AES-128 key and IV initialized successfully");
//
//        } catch (Exception e) {
//            log.error("Error initializing AES: {}", e.getMessage(), e);
//        }
//    }
//
//    public String encrypt(String input) {
//        try {
//            Cipher cipher = Cipher.getInstance(AES_CBC_PKCS5);
//            cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
//
//            byte[] encryptedBytes = cipher.doFinal(input.getBytes(StandardCharsets.UTF_8));
//            return Base64.getEncoder().encodeToString(encryptedBytes);
//
//        } catch (Exception e) {
//            log.error("Encrypt error: {}", e.getMessage(), e);
//        }
//        return null;
//    }
//
//    public String decrypt(String encrypted) {
//        try {
//            Cipher cipher = Cipher.getInstance(AES_CBC_PKCS5);
//            cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
//
//            byte[] decodedBytes = Base64.getDecoder().decode(encrypted);
//            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
//
//            return new String(decryptedBytes, StandardCharsets.UTF_8);
//
//        } catch (Exception e) {
//            log.error("Decrypt error: {}", e.getMessage(), e);
//        }
//        return null;
//    }
//}
