package com.example.tathastu_lovely_erp_backend.repository;

import com.example.tathastu_lovely_erp_backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByCustomerId(Long customerId);
}