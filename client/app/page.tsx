"use client";
import ChatBox from "./components/Chatbox";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth || {});

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <ChatBox />
    </div>
  );
}
