"use client";
import { Activity, Trophy, Users, TrendingUp } from "lucide-react";

export default function StatsCards() {
  const cards = [
    { icon: <Activity className="w-6 h-6 text-green-600 mb-2 mx-auto" />, title: "Live Matches", value: "Real-time" },
    { icon: <Trophy className="w-6 h-6 text-yellow-600 mb-2 mx-auto" />, title: "Records", value: "Historical" },
    { icon: <Users className="w-6 h-6 text-blue-600 mb-2 mx-auto" />, title: "Players", value: "Global" },
    { icon: <TrendingUp className="w-6 h-6 text-purple-600 mb-2 mx-auto" />, title: "Analytics", value: "Advanced" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c, i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
          {c.icon}
          <p className="text-sm text-gray-600">{c.title}</p>
          <p className="text-xl font-bold text-gray-800">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
