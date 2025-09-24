"use client";
import { Send } from "lucide-react";

interface ChatInputProps {
  question: string;
  setQuestion: (q: string) => void;
  send: () => void;
  isLoading: boolean;
}

export default function ChatInput({ question, setQuestion, send, isLoading }: ChatInputProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) send();
          }}
          className="flex-1 border border-gray-300 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 bg-gray-50 focus:bg-white transition-all duration-200"
          placeholder="Ask about cricket stats (e.g., 'Top 5 Test Matches')"
          disabled={isLoading}
        />
        <button
          onClick={send}
          disabled={isLoading || !question.trim()}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl"
        >
          <Send className="w-5 h-5" />
          {isLoading ? "Searching..." : "Ask AI"}
        </button>
      </div>
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2 sm:gap-0">
        <span>Press Enter to send • Real cricket data from official sources</span>
        <span>{question.length}/500</span>
      </div>
    </div>
  );
}
