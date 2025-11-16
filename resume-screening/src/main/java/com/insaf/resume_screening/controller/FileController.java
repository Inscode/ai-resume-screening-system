package com.insaf.resume_screening.controller;

import com.insaf.resume_screening.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;

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

    @GetMapping("/resume/**")
    public ResponseEntity<Resource> getResume(HttpServletRequest request) {
        try {
            // Extract filename
            String filename = request.getRequestURI()
                    .substring("/api/files/resume/".length());

            Path filePath = Paths.get("uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

}
