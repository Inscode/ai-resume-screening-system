package com.insaf.resume_screening.controller;

import com.insaf.resume_screening.entity.Job;
import com.insaf.resume_screening.exception.ResourceNotFoundException;
import com.insaf.resume_screening.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/jobs")
@RequiredArgsConstructor
public class JobController{
    private final JobService service;

    @PostMapping
    public ResponseEntity<Job> create(@RequestBody Job job){
        return ResponseEntity.ok(service.save(job));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAll(){
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getById(@PathVariable Long id){
        Job job = service.get(id)
                .orElseThrow(() -> new ResourceNotFoundException("job not found with the given id " + id));
        return ResponseEntity.ok(job);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> update(@PathVariable Long id, @RequestBody Job jobDetails){
        Job job = service.get(id).orElseThrow(() -> new ResourceNotFoundException("Job not found with id " + id));
        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setEmploymentType(jobDetails.getEmploymentType());
        job.setSkillsRequired(jobDetails.getSkillsRequired());
        job.setMinSalary(jobDetails.getMinSalary());
        job.setMaxSalary(jobDetails.getMaxSalary());
        job.setApplicationDeadline(jobDetails.getApplicationDeadline());
        return ResponseEntity.ok(service.save(job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
