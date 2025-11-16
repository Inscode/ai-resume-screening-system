package com.insaf.resume_screening.dto;

import lombok.Data;

@Data
public class CandidateResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String resumeUrl;
    private Double matchScore;
    private JobResponse job;
}
