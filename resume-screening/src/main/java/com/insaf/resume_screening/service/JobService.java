package com.insaf.resume_screening.service;

import com.insaf.resume_screening.entity.Job;
import com.insaf.resume_screening.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository repo;

    public Job save(Job job){return repo.save(job);}
    public List<Job> getAll(){return repo.findAll();}
    public Optional<Job> get(Long id){return repo.findById(id);}
    public void delete(Long id){repo.deleteById(id);}

}
