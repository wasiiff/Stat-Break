"use client";

interface QuickQuestionsProps {
  onSelect: (q: string) => void;
}

export default function QuickQuestions({ onSelect }: QuickQuestionsProps) {
  const quickQuestions = [
    "Show top 10 ODI Teams by average",
    "Latest Test match results",
  ];

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-700 mb-3 text-center">
        Try these popular queries:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quickQuestions.map((q, index) => (
          <button
            key={index}
            onClick={() => onSelect(q)}
            className="bg-white hover:bg-blue-50 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium transition-all duration-200 hover:border-blue-300 hover:shadow-md text-left"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
