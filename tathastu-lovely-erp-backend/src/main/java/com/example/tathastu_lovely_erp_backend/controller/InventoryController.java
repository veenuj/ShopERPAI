package com.example.tathastu_lovely_erp_backend.controller;

import com.example.tathastu_lovely_erp_backend.entity.InventoryItem;
import com.example.tathastu_lovely_erp_backend.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping("/add")
    public ResponseEntity<InventoryItem> addProduct(@RequestBody InventoryItem item) {
        return ResponseEntity.ok(inventoryService.addProduct(item));
    }
    @GetMapping("/all")
    public ResponseEntity<List<InventoryItem>> getAllProducts() {
        return ResponseEntity.ok(inventoryService.getAllProducts());
    }
}
