package com.example.tathastu_lovely_erp_backend.controller;

import com.example.tathastu_lovely_erp_backend.entity.FulfillmentOrder;
import com.example.tathastu_lovely_erp_backend.repository.FulfillmentOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrderController {
    private final FulfillmentOrderRepository repository;

    @GetMapping("/all")
    public ResponseEntity<List<FulfillmentOrder>> getAllOrders() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<FulfillmentOrder> createOrder(@RequestBody FulfillmentOrder order) {
        if(order.getStatus() == null) {
            order.setStatus("NEW");
        }
        return ResponseEntity.ok(repository.save(order));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<FulfillmentOrder> updateStatus(@PathVariable Long id, @RequestBody String newStatus) {
        FulfillmentOrder order = repository.findById(id).orElseThrow();
        order.setStatus(newStatus.replace("\"", ""));
        return ResponseEntity.ok(repository.save(order));
    }

    // THE MISSING ENDPOINT RESTORED!
    @PutMapping("/{id}/ship")
    public ResponseEntity<FulfillmentOrder> shipOrder(@PathVariable Long id, @RequestBody FulfillmentOrder shippingDetails) {
        FulfillmentOrder order = repository.findById(id).orElseThrow();
        order.setStatus("SHIPPED");
        order.setTrackingId(shippingDetails.getTrackingId());
        order.setShippingCompany(shippingDetails.getShippingCompany());
        return ResponseEntity.ok(repository.save(order));
    }
}
