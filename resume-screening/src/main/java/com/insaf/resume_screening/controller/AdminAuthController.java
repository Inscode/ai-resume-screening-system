package com.insaf.resume_screening.controller;

import com.insaf.resume_screening.dto.AuthRequest;
import com.insaf.resume_screening.dto.AuthResponse;
import com.insaf.resume_screening.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminService adminService;

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        return adminService.register(request.getUsername(), request.getPassword());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String token = adminService.login(request.getUsername(), request.getPassword());
        return new AuthResponse(token);
    }
}
