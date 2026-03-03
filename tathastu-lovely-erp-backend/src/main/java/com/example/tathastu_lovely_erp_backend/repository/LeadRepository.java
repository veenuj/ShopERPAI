package com.example.tathastu_lovely_erp_backend.repository;

import com.example.tathastu_lovely_erp_backend.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    Lead findByPhoneNumber(String phoneNumber);
}