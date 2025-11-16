package com.insaf.resume_screening.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveFile(MultipartFile file) throws IOException{
        Path uploadPath = Paths.get(uploadDir);
        if(!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IOException("Invalid file: filename is empty");
        }

        // ✅ SANITIZE: Remove spaces and special characters
        String sanitizedFilename = originalFilename
                .replaceAll("\\s+", "_")           // Replace all spaces with underscore
                .replaceAll("[^a-zA-Z0-9._-]", ""); // Keep only letters, numbers, dot, underscore, dash

        String fileName = System.currentTimeMillis() + "_" + sanitizedFilename;

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return web path with forward slashes
        return uploadDir + "/" + fileName;
    }
}
