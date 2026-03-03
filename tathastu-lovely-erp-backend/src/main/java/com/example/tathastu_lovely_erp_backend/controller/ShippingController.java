package main.java.com.example.tathastu_lovely_erp_backend.controller;

import com.example.tathastu_lovely_erp_backend.service.AiAgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import com.example.tathastu_lovely_erp_backend.service.AiAgentService;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ShippingController {
    private final AiAgentService aiAgentService;

    @GetMapping("/track/{trackingId}")
    public ResponseEntity<Map<String, Object>> trackPackage(@PathVariable String trackingId) {
        
        // Mocking the ugly raw data we would normally get from Shiprocket/Delhivery
        String rawCourierLogs = "[2026-03-01 08:15] Manifest Generated. " +
                                "[2026-03-01 14:30] Shipment Picked Up from origin. " +
                                "[2026-03-02 03:45] Bag sealed at DEL-HUB-01. " +
                                "[2026-03-02 09:12] In transit to destination city facility.";

        // Feed the ugly logs to Gemini
        String aiSummary = aiAgentService.summarizeTracking(rawCourierLogs);

        Map<String, Object> response = new HashMap<>();
        response.put("trackingId", trackingId);
        response.put("rawLogs", rawCourierLogs);
        response.put("aiSummary", aiSummary);
        response.put("status", "IN_TRANSIT");

        return ResponseEntity.ok(response);
    }
}
