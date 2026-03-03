package com.example.tathastu_lovely_erp_backend.controller;

import com.example.tathastu_lovely_erp_backend.service.AiAgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vision")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VisionController {

    private final AiAgentService aiAgentService;

    @PostMapping("/stylist")
    public ResponseEntity<Map<String, String>> analyzeRoom(@RequestParam("image") MultipartFile file) {
        try {
            String recommendation = aiAgentService.analyzeRoomAndRecommend(file.getBytes());
            Map<String, String> response = new HashMap<>();
            response.put("recommendation", recommendation);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
