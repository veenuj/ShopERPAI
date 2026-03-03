package com.example.tathastu_lovely_erp_backend.controller;

import com.example.tathastu_lovely_erp_backend.service.MultiAgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AgentController {

    private final MultiAgentService multiAgentService;

    @PostMapping("/aria/draft")
    public ResponseEntity<Map<String, String>> getAriaDraft(@RequestBody Map<String, Object> req) {
        String name = (String) req.get("name");
        String summary = (String) req.get("summary");
        Integer score = (Integer) req.get("score");
        
        String draft = multiAgentService.ariaDraftFollowUp(name, summary, score);
        return ResponseEntity.ok(Map.of("draft", draft));
    }

    @GetMapping("/leo/status")
    public ResponseEntity<Map<String, String>> getLeoStatus(@RequestParam long pending, @RequestParam long production) {
        String status = multiAgentService.leoAnalyzeBottlenecks(pending, production);
        return ResponseEntity.ok(Map.of("status", status));
    }
}
