package com.example.tathastu_lovely_erp_backend.controller;

import com.example.tathastu_lovely_erp_backend.entity.Lead;
import com.example.tathastu_lovely_erp_backend.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*") 
@RequiredArgsConstructor
public class LeadController {
    private final LeadService leadService;

    @PostMapping("/incoming")
    public ResponseEntity<Lead> receiveLead(@RequestBody Lead lead) {
        return ResponseEntity.ok(leadService.processIncomingLead(lead));
    }
    @GetMapping("/all")
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }
}
