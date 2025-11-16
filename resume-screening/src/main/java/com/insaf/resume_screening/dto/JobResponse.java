package com.insaf.resume_screening.dto;

import lombok.Data;

@Data
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String skillsRequired;
    private String employmentType;
    private Double minSalary;
    private Double maxSalary;
    private String applicationDeadline;
}
