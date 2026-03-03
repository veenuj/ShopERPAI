package com.example.tathastu_lovely_erp_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "inventory_items")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    // The AI agent will automatically generate and update this field
    @Column(length = 1000)
    private String aiGeneratedDescription; 
    
    @Column(unique = true)
    private String sku;
    
    private BigDecimal price;
    private Integer stockQuantity;
    
    // Helps the AI know which catalog to search (e.g., "TATHASTU_GIFTS" or "LOVELY_ART")
    private String businessUnit; 
}