package com.example.tathastu_lovely_erp_backend.controller;

import com.example.tathastu_lovely_erp_backend.entity.Invoice;
import com.example.tathastu_lovely_erp_backend.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InvoiceController {
    
    private final InvoiceRepository invoiceRepository;

    @PostMapping("/generate")
    public ResponseEntity<Invoice> generateInvoice(@RequestBody Invoice invoice) {
        // Bulletproof Null Checks
        double base = invoice.getBasePrice() != null ? invoice.getBasePrice() : 0.0;
        double custom = invoice.getCustomizationFee() != null ? invoice.getCustomizationFee() : 0.0;
        boolean applyGst = invoice.getIsGst() != null ? invoice.getIsGst() : false;

        // Safe Math
        double tax = applyGst ? (base + custom) * 0.18 : 0.0;
        double total = base + custom + tax;
        
        invoice.setTaxAmount(tax);
        invoice.setTotalAmount(total);
        invoice.setStatus("PENDING");
        invoice.setPaymentLink("https://pay.tathastu.com/checkout/" + UUID.randomUUID().toString().substring(0, 8));
        
        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceRepository.findAll());
    }
}