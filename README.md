# 🚀 ShopERP AI: The Intelligent Gifting Command Center

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=java&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![AI-Powered](https://img.shields.io/badge/Google_Gemini-Vision_%26_Pro-8E75E9?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**ShopERP AI** is a next-generation Enterprise Resource Planning system specifically engineered for **Tathastu Gift Shop** and **Lovely Art Studio**. It transforms traditional retail management into a high-performance AI ecosystem, leveraging **Multimodal Vision**, **RAG Knowledge Bases**, and **Multi-Agent Orchestration**.

---

## 🌟 The "AI Employees" (Multi-Agent Architecture)

Unlike standard ERPs, ShopERP AI employs specialized autonomous agents that collaborate to run your business:



* **🤵‍♂️ Leo (Operations Manager Agent):** Leo monitors the live fulfillment pipeline. He analyzes production bottlenecks and provides management with high-level daily briefings and workload warnings.
* **✨ Aria (Sales Growth Agent):** Aria lives within the CRM. She calculates lead scores based on customer sentiment and drafts high-conversion, personalized WhatsApp follow-ups autonomously.

---

## 🧠 Core Intelligence Modules

### 🖼 AI Room Stylist (Multimodal Vision)
Leveraging **Gemini Vision**, customers can upload a photo of their living space. The AI analyzes lighting, color palettes, and architectural "vibe" to recommend the perfect art piece from the *Lovely Art Studio* inventory.

### 💬 RAG-Powered Auto-Support
Built on a **Retrieval-Augmented Generation (RAG)** pipeline. The support bot is grounded in strict business policies regarding shipping, custom engraving timelines, and refund rules, ensuring 100% accurate, hallucination-free customer service.

### 📦 Smart Logistics & Tracking
Translates "robotic" courier logs from services like Delhivery/Shiprocket into warm, human-friendly summaries for customers, which can be dispatched via WhatsApp with one click.

---

## 📊 Dashboard Overview

* **Premium Analytics:** Bento-box style metrics tracking total revenue, average order value, and pipeline health.
* **Kanban Fulfillment:** A visual "Order Board" for managing production stages (New → Production → QA → Shipped).
* **Dynamic Billing:** Instant invoice generation with automated 18% GST calculation and secure payment link synthesis.

---

## 🏗 System Architecture

The application is built using a decoupled Full-Stack architecture:

* **Frontend:** React 18 with Vite, utilizing a "Glassmorphic" UI design and Tailwind CSS animations.
* **Backend:** Spring Boot 3.4 with Spring AI, managing stateful orchestration between Gemini LLMs and the local H2 Database.
* **Security:** Environment-variable based secret management (keys never stored in repository).

---

## 🚀 Getting Started

### Prerequisites
* JDK 17 or higher
* Node.js 18+
* Google Gemini API Key

### Installation

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/your-username/ShopERP-AI.git](https://github.com/your-username/ShopERP-AI.git)
    cd ShopERP-AI
    ```

2.  **Backend Configuration**
    Create a `.env` file in the `/Backend` folder:
    ```env
    GEMINI_API_KEY=your_key_here
    ```

3.  **Run Application**
    * **Backend:** `./gradlew bootRun`
    * **Frontend:** `npm install && npm run dev`

---

## 👤 Developer
**Anuj Dhiman**
*Full Stack Developer & AI Researcher*

[LinkedIn](https://www.linkedin.com/in/anuj-dhiman3112/) | [GitHub](https://github.com/veenuj)

---
> "Gifts that speak. Art that inspires. AI that scales."
