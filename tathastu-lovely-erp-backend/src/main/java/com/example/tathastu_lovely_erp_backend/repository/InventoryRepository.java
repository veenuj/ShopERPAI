package com.example.tathastu_lovely_erp_backend.repository;

import com.example.tathastu_lovely_erp_backend.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    // Custom query for the AI to search specific catalogs
    List<InventoryItem> findByBusinessUnitAndStockQuantityGreaterThan(String businessUnit, Integer stockQuantity);
}