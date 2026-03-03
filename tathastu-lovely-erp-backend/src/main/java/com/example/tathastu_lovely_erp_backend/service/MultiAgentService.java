package com.example.tathastu_lovely_erp_backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class MultiAgentService {
    
    private final ChatClient chatClient;
    
    public MultiAgentService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    // AGENT 1: ARIA (The Sales Growth Agent)
    // Task: Analyze a lead and draft a personalized, high-conversion WhatsApp follow-up.
    public String ariaDraftFollowUp(String customerName, String summary, Integer score) {
        String prompt = String.format(
            "You are Aria, the Sales Growth Agent for Tathastu Gifts. " +
            "Customer: %s. Last Interaction: %s. Lead Score: %d. " +
            "If the score is > 80, be very direct and offer a 5%% 'close-the-deal' discount. " +
            "If the score is < 50, be helpful and ask if they need gift ideas. " +
            "Draft a warm, personal WhatsApp message in 1-2 sentences. Use emojis.",
            customerName, summary, score
        );
        return chatClient.prompt().user(prompt).call().content();
    }

    // AGENT 2: LEO (The Operations Manager)
    // Task: Analyze the fulfillment board and identify bottlenecks.
    public String leoAnalyzeBottlenecks(long pendingOrders, long productionOrders) {
        String prompt = String.format(
            "You are Leo, the Operations Manager for Lovely Art Studio. " +
            "Current Pipeline: %d orders in 'New', %d orders in 'Production'. " +
            "Give a brief, professional status update on the studio's workload. " +
            "If total orders > 10, warn Anuj that the studio is reaching capacity.",
            pendingOrders, productionOrders
        );
        return chatClient.prompt().user(prompt).call().content();
    }
}
