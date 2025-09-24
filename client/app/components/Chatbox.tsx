"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAskQuestionMutation } from "../services/chatApi";
import ChatHeader from "./ChatHeader";
import StatsCards from "./StatsCard";
import QuickQuestions from "./QuickResponse";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { Message } from "../@types/types";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [askQuestion, { isLoading }] = useAskQuestionMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const send = async () => {
    if (!question.trim() || isLoading) return;
    const q = question.trim();
    setHistory((h) => [...h, { role: "user", payload: q }]);
    setQuestion("");

    try {
      const data = await askQuestion({ question: q }).unwrap();
      setHistory((h) => [...h, { role: "assistant", payload: data }]);
    } catch (err) {
      console.log(err);
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          payload: { type: "text", text: "Error contacting backend. Please try again." },
        },
      ]);
    }
  };

  const formatCellValue = (value: unknown) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "number") {
      return value > 999 ? value.toLocaleString() : value.toString();
    }
    return value.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <ChatHeader />
        <StatsCards />
        {history.length === 0 && <QuickQuestions onSelect={(q) => setQuestion(q)} />}
        <ChatMessages history={history} isLoading={isLoading} messagesEndRef={messagesEndRef} formatCellValue={formatCellValue} />
        <ChatInput question={question} setQuestion={setQuestion} send={send} isLoading={isLoading} />

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-gray-600 font-medium">Powered by Netixsol Pvt Ltd</p>
          <p className="text-xs text-gray-500">Get real-time scores and historical records</p>
        </div>
      </div>
    </div>
  );
}
