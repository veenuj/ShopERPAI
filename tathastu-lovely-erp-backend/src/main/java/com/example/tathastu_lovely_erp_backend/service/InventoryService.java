package com.example.tathastu_lovely_erp_backend.service;

import com.example.tathastu_lovely_erp_backend.entity.InventoryItem;
import com.example.tathastu_lovely_erp_backend.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final AiAgentService aiAgentService;

    public InventoryItem addProduct(InventoryItem item) {
        if (item.getAiGeneratedDescription() == null) {
            item.setAiGeneratedDescription(aiAgentService.generateProductDescription(item.getName(), item.getBusinessUnit()));
        }
        return inventoryRepository.save(item);
    }
    public List<InventoryItem> getAllProducts() {
        return inventoryRepository.findAll();
    }
}
