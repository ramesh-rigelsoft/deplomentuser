package com.rigel.user.util;

import java.io.*;
import java.security.KeyStore;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Properties;

public class PropertiesToKeystore {

    public static void createCertificate() throws Exception {

        // Load properties file
        Properties props = new Properties();
        props.load(new FileInputStream(Constaints.BASE_DIR+Constaints.BASE_RESOURCES));

        // Create keystore
        KeyStore ks = KeyStore.getInstance("PKCS12");
        ks.load(null, null);

        String password = "https://www.rigelautomation.com";

        // Store each property as a secret key
        for (String key : props.stringPropertyNames()) {
            String value = props.getProperty(key);

            SecretKey secretKey = new SecretKeySpec(
                    value.getBytes(), "AES"
            );

            KeyStore.SecretKeyEntry entry =
                    new KeyStore.SecretKeyEntry(secretKey);

            KeyStore.ProtectionParameter prot =
                    new KeyStore.PasswordProtection(password.toCharArray());

            ks.setEntry(key, entry, prot);
        }

        // Save keystore
        try (FileOutputStream fos = new FileOutputStream("secure.p12")) {
            ks.store(fos, password.toCharArray());
        }

        System.out.println("Converted to secure.p12 ✅");
    }
    
    public static void main(String[] args) {
    	try {
    	PropertiesToKeystore.createCertificate();
    	}catch(Exception e) {
    		
    	}
	}
}