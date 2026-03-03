package com.example.tathastu_lovely_erp_backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.core.io.ByteArrayResource;

@Service
public class AiAgentService {
    
    private final ChatClient chatClient;
    
    public AiAgentService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }
    
    public String generateProductDescription(String productName, String businessUnit) {
        String prompt = "Write a compelling 2-sentence product description for " + productName + " sold by " + businessUnit + ".";
        return chatClient.prompt().user(prompt).call().content();
    }
    
    public Integer scoreLead(String chatSummary) { 
        String systemPrompt = "You are an expert AI sales analyst. Assign a Lead Score from 1 to 100 based on urgency. Return ONLY the raw integer.";
        try {
            String aiResponse = chatClient.prompt().system(systemPrompt).user("Chat: " + chatSummary).call().content();
            return Integer.parseInt(aiResponse.replaceAll("[^0-9]", ""));
        } catch (Exception e) { return 50; }
    }

    public String summarizeTracking(String rawEvents) {
        String systemPrompt = "Read these raw shipping logs and write a warm 1-sentence customer update.";
        try {
            return chatClient.prompt().system(systemPrompt).user("Logs: " + rawEvents).call().content();
        } catch (Exception e) { return "Tracking is updating."; }
    }

    // NEW: Multimodal Vision AI
    public String analyzeRoomAndRecommend(byte[] imageBytes) {
        String prompt = "You are an expert interior designer for 'Lovely Art Studio'. " +
                        "Analyze the lighting, color palette, and vibe of this room image. " +
                        "Then, recommend what kind of painting, canvas, or custom resin art from our studio would look perfect on these walls. " +
                        "Keep it friendly, enthusiastic, and under 3 sentences.";
        try {
            return chatClient.prompt()
                    .user(u -> u.text(prompt)
                                .media(MimeTypeUtils.IMAGE_JPEG, new ByteArrayResource(imageBytes)))
                    .call()
                    .content();
        } catch (Exception e) {
            System.err.println("Vision AI Error: " + e.getMessage());
            return "Wow, beautiful space! I'd recommend a vibrant abstract canvas or a sleek resin geode piece to complement those tones.";
        }
    }
}
