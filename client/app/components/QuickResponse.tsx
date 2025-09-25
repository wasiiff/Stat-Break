"use client";
import { MessageCircle, Zap, TrendingUp, Target } from "lucide-react";

interface QuickQuestionsProps {
  onSelect: (q: string) => void;
}

export default function QuickQuestions({ onSelect }: QuickQuestionsProps) {
  const quickQuestions = [
    {
      text: "Show top 10 ODI Teams by average",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      text: "Latest Test match results", 
      icon: TrendingUp,
      color: "from-purple-500 to-violet-500"
    },
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200">
          <MessageCircle className="w-4 h-4 text-blue-600" />
          <p className="text-sm font-semibold text-gray-700">
            Try these popular queries
          </p>
          <Zap className="w-4 h-4 text-yellow-500" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickQuestions.map((q, index) => {
          const IconComponent = q.icon;
          return (
            <button
              key={index}
              onClick={() => onSelect(q.text)}
              className={`group relative overflow-hidden bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 p-6 rounded-2xl border border-gray-200 hover:border-transparent shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-left`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${q.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative flex items-center gap-4">
                <div className={`p-2 rounded-full bg-gradient-to-r ${q.color} opacity-20 group-hover:opacity-100 transition-opacity duration-300`}>
                  <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold text-sm group-hover:text-gray-900 transition-colors duration-300">
                    {q.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to explore
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
