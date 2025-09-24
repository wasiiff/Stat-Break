"use client";
import { BarChart3, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function ChatHeader() {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg mr-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cricket Stats AI
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Real-time cricket statistics, player records, and match insights
          </p>
        </div>
      </div>
      <button
        onClick={() => dispatch(logout())}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
}
