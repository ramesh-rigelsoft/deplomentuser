package com.rigel.user.util;

import java.security.SecureRandom;

public class LicenseKeyGenerator {
    private static final String PREFIX = "RIGEL";
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom random = new SecureRandom();

    public static String generateLicenseKey() {
        return PREFIX + "-" + randomBlock() + "-" + randomBlock();
    }

    private static String randomBlock() {
        StringBuilder sb = new StringBuilder(4);
        for (int i = 0; i < 4; i++) {
            int idx = random.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(idx));
        }
        return sb.toString();
    }
}