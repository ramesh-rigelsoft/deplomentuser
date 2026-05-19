package com.rigel.user.util;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;


public class UploadFileUtlity {
	
//    private static final Path uploadDir = Paths.get("uploads");
//	
//	public static String uploadFiles(MultipartFile files) {
//        try {
//                // Generate unique file name
//                String originalFilename = StringUtils.cleanPath(files.getOriginalFilename());
//                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
//                String filename = UUID.randomUUID().toString() + extension;
//
//                // Create directories if not exists
//                Path uploadPath = Paths.get(uploadDir.toString());
//                if (!Files.exists(uploadPath)) {
//                    Files.createDirectories(uploadPath);
//                }
//
//                // Save file
//                Path filePath = uploadPath.resolve(filename);
//                Files.copy(files.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//                // Save URL
//                String fileUrl = "/files/" + filename;
//                return filename;
//        } catch (IOException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
	
	public static String uploadFiles(MultipartFile files, String location,String fileName) {
        if (files == null || files.isEmpty()) {
            return null;
        }

        try {
            // Clean filename and extract extension safely
            String originalFilename = StringUtils.cleanPath(files.getOriginalFilename());
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex > 0) {
                extension = originalFilename.substring(dotIndex);
            }

            String filename = fileName==null?UUID.randomUUID().toString():fileName + extension;

            // Create directories if not exist
            Path uploadPath = Paths.get(getPath(location));
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(filename);

            // Copy file safely with try-with-resources
            try (InputStream inputStream = files.getInputStream()) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            return filename;

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String getPath(String type) {
        switch (type) {
            case "logo":
                return Constaints.LOGO_PATH;
            case "invoice":
                return Constaints.INVOICE_FILE_PATH;
            case "product":
                return Constaints.PRODUCT_IMAGES_PATH;
            case "expense":
                return Constaints.EXPENSE_IMAGES_PATH;       
            default:
                throw new IllegalArgumentException("Invalid type: " + type);
        }
    }
	
	

}
