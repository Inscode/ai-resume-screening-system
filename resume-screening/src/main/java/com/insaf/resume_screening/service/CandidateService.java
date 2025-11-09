package com.insaf.resume_screening.service;

import com.insaf.resume_screening.entity.Candidate;
import com.insaf.resume_screening.repository.CandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;


import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CandidateService {
    private final CandidateRepository repo;
    private final RestTemplate restTemplate = new RestTemplate();

    public Candidate save(Candidate c){return repo.save(c);}

    public Double getMatchScore(String jobDescription, String resumePath){
        try {
            String aiUrl = "http://localhost:5000/api/ai/match";

            File resumeFile = new File(resumePath);
            FileSystemResource resource = new FileSystemResource((resumeFile));

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("resume",resource);
            body.add("jobDescription", jobDescription);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(aiUrl, HttpMethod.POST, requestEntity, Map.class);

            return (Double) response.getBody().get("matchScore");

        } catch ( Exception e ) {
            e.printStackTrace();
            return 0.0;
        }
    }

    public List<Candidate> getAll(){return repo.findAll();}
    public Optional<Candidate> get(Long id){return repo.findById(id);}
    public void delete(Long id){repo.deleteById(id);}

}
