package com.insaf.resume_screening.controller;

import com.insaf.resume_screening.entity.Candidate;
import com.insaf.resume_screening.entity.Job;
import com.insaf.resume_screening.exception.ResourceNotFoundException;
import com.insaf.resume_screening.service.CandidateService;
import com.insaf.resume_screening.service.FileStorageService;
import com.insaf.resume_screening.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateController {
    private final CandidateService service;

    private final FileStorageService fileService;

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<Candidate> create(@RequestBody Candidate c){
        return ResponseEntity.ok(service.save(c));
    }

    @PostMapping("/upload")
    public ResponseEntity<Candidate> uploadCandidateWithResume(
            @RequestParam("file")MultipartFile file,
            @RequestParam("jobId") Long jobId,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone)
            {

        try {

            Job job = jobService.get(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found with id " + jobId));

            String resumePath = fileService.saveFile(file);

            Double matchScore = service.getMatchScore(job.getDescription(), resumePath);


            Candidate candidate = new Candidate();
            candidate.setFullName(fullName);
            candidate.setEmail(email);
            candidate.setPhone(phone);
            candidate.setJob(job);
            candidate.setResumeUrl(resumePath);
            candidate.setMatchScore(matchScore);

            Candidate saved = service.save(candidate);
            return ResponseEntity.ok(saved);
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Candidate>> getAll(){
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getById(@PathVariable Long id){
        Candidate candidate = service.get(id)
                .orElseThrow(() -> new ResourceNotFoundException("candidate not found with the given id " + id));
        return ResponseEntity.ok(candidate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
