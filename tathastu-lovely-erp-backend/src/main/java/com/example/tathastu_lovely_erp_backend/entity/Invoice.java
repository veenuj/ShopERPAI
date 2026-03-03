package com.example.tathastu_lovely_erp_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String customerName;
    private String phoneNumber;
    private String itemName;
    
    @Column(columnDefinition = "double default 0.0")
    private Double basePrice = 0.0;
    
    @Column(columnDefinition = "double default 0.0")
    private Double customizationFee = 0.0;
    
    @Column(columnDefinition = "boolean default false")
    private Boolean isGst = false; 
    
    private Double taxAmount = 0.0;
    private Double totalAmount = 0.0;
    
    private String status;
    private String paymentLink;
    private LocalDateTime createdAt = LocalDateTime.now();
}
