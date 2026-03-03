package com.example.tathastu_lovely_erp_backend.repository;

import com.example.tathastu_lovely_erp_backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
