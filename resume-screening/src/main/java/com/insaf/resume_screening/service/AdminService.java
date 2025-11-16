package com.insaf.resume_screening.service;

import com.insaf.resume_screening.entity.Admin;
import com.insaf.resume_screening.repository.AdminRepository;
import com.insaf.resume_screening.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register(String username, String password) {
        if (adminRepo.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        adminRepo.save(admin);

        return "Admin registered successfully";
    }

    public String login(String username, String password) {
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return jwtUtil.generateToken(username);
    }
}
