package com.insaf.resume_screening.mapper;

import com.insaf.resume_screening.dto.CandidateResponse;
import com.insaf.resume_screening.dto.JobResponse;
import com.insaf.resume_screening.entity.Candidate;
import com.insaf.resume_screening.entity.Job;
import com.insaf.resume_screening.repository.CandidateRepository;

public class CandidateMapper {

    public static CandidateResponse toDto(Candidate c) {
        CandidateResponse dto = new CandidateResponse();

        dto.setId(c.getId());
        dto.setFullName(c.getFullName());
        dto.setEmail(c.getEmail());
        dto.setPhone(c.getPhone());
        dto.setResumeUrl(c.getResumeUrl());
        dto.setMatchScore(c.getMatchScore());

        Job job = c.getJob();
        if (job != null) {
            JobResponse jobDto = new JobResponse();
            jobDto.setId(job.getId());
            jobDto.setTitle(job.getTitle());
            jobDto.setDescription(job.getDescription());
            jobDto.setSkillsRequired(job.getSkillsRequired());
            jobDto.setEmploymentType(job.getEmploymentType());
            jobDto.setMaxSalary(job.getMaxSalary());
            jobDto.setMinSalary(job.getMinSalary());
            jobDto.setApplicationDeadline(job.getApplicationDeadline().toString());

            dto.setJob(jobDto);
        }

        return dto;
    }
}
