"use client";
import { BarChart3 } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg mr-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cricket Stats AI
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Real-time cricket statistics, player records, and match insights
          </p>
        </div>
      </div>
    </div>
  );
}
