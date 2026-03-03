package com.example.tathastu_lovely_erp_backend.repository;

import com.example.tathastu_lovely_erp_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}