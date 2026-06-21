package com.rigel.user.util;

public class SkuGenerator {

    public static String generateSku(
            String brand,
            String model,
            String ram,
            String storage,
            String color,
            String screenSize) {

        String brandCode = brand.substring(0, 3).toUpperCase();

        // Galaxy A56 -> A56
        String modelCode = model.replace(brand, "")
                                .strip()
                                .replaceAll("\\s+", "")
                                .toUpperCase();

        String ramCode = ram.replace("GB", "");
        String storageCode = storage.replace("GB", "");

        String colorCode = color.substring(0, 3).toUpperCase();
        String screenSizeCode = screenSize.substring(0, 3).toUpperCase();
        
        return brandCode + "-" + modelCode 
        		+ (ram!=null?("-" + ramCode):"")
        		+ (storage!=null?("-" + storageCode):"")
        		+ (screenSize!=null?("-" + screenSizeCode):"")
        		+ (color!=null?("-" + colorCode):"");
    }

  
}