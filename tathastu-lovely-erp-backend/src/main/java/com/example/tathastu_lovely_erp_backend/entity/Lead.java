package com.example.tathastu_lovely_erp_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leads")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phoneNumber; // Primary identifier for WhatsApp
    private String customerName;
    
    // e.g., "NEW", "ENGAGED", "CONVERTED"
    private String status; 
    
    // The multi-agent system will score the lead (1-100) based on chat intent
    private Integer aiLeadScore; 
    
    @Column(length = 500)
    private String chatSummary; // AI summarizes the WhatsApp chat here
}