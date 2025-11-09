package com.insaf.resume_screening.controller;

import com.insaf.resume_screening.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file){
        try {
            String path = fileService.saveFile(file);
            return ResponseEntity.ok("File Uploaded Successfully "+ path);
        } catch (Exception e){
            return ResponseEntity.internalServerError().body("Upload failed" + e.getMessage());
        }
    }

}
