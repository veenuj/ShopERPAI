package com.example.tathastu_lovely_erp_backend.service;

import com.example.tathastu_lovely_erp_backend.entity.Lead;
import com.example.tathastu_lovely_erp_backend.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {
    private final LeadRepository leadRepository;
    private final AiAgentService aiAgentService;
    
    public Lead processIncomingLead(Lead lead) {
        lead.setAiLeadScore(aiAgentService.scoreLead(lead.getChatSummary()));
        if(lead.getStatus() == null) lead.setStatus("NEW_MESSAGE");
        return leadRepository.save(lead);
    }
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }
}
