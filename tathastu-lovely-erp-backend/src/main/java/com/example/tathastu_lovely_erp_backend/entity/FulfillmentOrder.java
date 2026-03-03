package com.example.tathastu_lovely_erp_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "fulfillment_orders")
public class FulfillmentOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerName;
    private String itemName;
    private String status;
    private String shippingCompany;
    private String trackingId;
}
