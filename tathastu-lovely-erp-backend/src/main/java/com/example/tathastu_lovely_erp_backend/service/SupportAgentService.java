package com.example.tathastu_lovely_erp_backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class SupportAgentService {

    private final ChatClient chatClient;

    private final String companyKnowledge = """
            TATHASTU GIFTS & LOVELY ART STUDIO - COMPANY POLICIES:
            1. Custom portraits and resin art take 5 to 7 business days to manufacture.
            2. Shipping is a flat ₹80 via Delhivery or Blue Dart. Standard delivery takes 3 days.
            3. We do not offer refunds on personalized or custom-engraved items.
            4. Urgent delivery (within 24 hours) is available but costs an additional ₹500 rush fee.
            5. We accept UPI, Net Banking, and Credit Cards via our secure payment link.
            6. Our physical workshop is located in Meerut, UP, but we ship all over India.
            """;

    public SupportAgentService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String answerCustomerQuery(String customerQuestion) {
        String systemPrompt = "You are a highly professional, friendly customer support AI for Tathastu Gifts and Lovely Art Studio. " +
                "You must answer the customer's question STRICTLY using the provided Company Policies context below. " +
                "If the answer is not contained in the policies, do not guess. Instead, politely say: 'I am not sure about that, let me connect you with Anuj to assist you further.'\n\n" +
                "COMPANY POLICIES CONTEXT:\n" + companyKnowledge;

        try {
            return chatClient.prompt()
                    .system(systemPrompt)
                    .user(customerQuestion)
                    .call()
                    .content();
        } catch (Exception e) {
            return "Our support system is currently taking a quick break. Please reach out to us on WhatsApp!";
        }
    }
}
