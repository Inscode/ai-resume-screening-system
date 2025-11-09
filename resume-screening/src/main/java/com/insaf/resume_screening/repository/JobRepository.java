package com.insaf.resume_screening.repository;

import com.insaf.resume_screening.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

}
