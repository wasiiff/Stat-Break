# 🏏 Cricket Stats AI – Conversation Workflow

This project is an **AI-powered cricket statistics assistant** that allows users to ask cricket-related questions and receive **real-time answers**, either in text or table format.  
It uses **NestJS (backend)** + **Next.js/React (frontend)** + **MongoDB** + **Gemini (LLM)**.

---

## 🚀 System Architecture

```mermaid
flowchart TD
    U[User Question] --> MS[MatchesService answerQuestion()]
    MS -->|1| RC[relevancyCheck (Gemini)]
    RC --> DF[detectFormat]
    DF --> RM[retrieveMemory]
    RM --> GMQ[generateMongoQuery (Gemini)]
    DF --> GMQ
    GMQ --> EMQ[executeMongoQuery (MongoDB)]
    EMQ --> FA[formatAnswer (Gemini formats as text/table)]
    FA --> SC[saveConversation (ConversationsService)]
    SC --> SUM[maybeSummarize (Gemini)]
    SUM --> DB[(MongoDB: Conversation + Summary)]
    SC --> DB
    DB --> HC[HistoryController (REST API)]
    HC --> FE[Frontend React App]
    FE --> U
