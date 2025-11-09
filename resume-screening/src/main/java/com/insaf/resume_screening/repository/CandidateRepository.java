package com.insaf.resume_screening.repository;

import com.insaf.resume_screening.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate,Long> {
}
