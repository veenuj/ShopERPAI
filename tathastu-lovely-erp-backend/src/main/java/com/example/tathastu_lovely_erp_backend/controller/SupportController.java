package main.java.com.example.tathastu_lovely_erp_backend.controller;

import com.example.tathastu_lovely_erp_backend.service.SupportAgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SupportController {

    private final SupportAgentService supportAgentService;

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askQuestion(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        String answer = supportAgentService.answerCustomerQuery(question);
        
        Map<String, String> response = new HashMap<>();
        response.put("answer", answer);
        
        return ResponseEntity.ok(response);
    }
}
