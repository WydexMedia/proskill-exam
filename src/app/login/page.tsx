"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "proskilladmin" && password === "Proskill@wydex") {
      localStorage.setItem("proskill_logged_in", "true"); // Set session
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  // Add auto-redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("proskill_logged_in") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        
        {/* Simple Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black">Admin Login</h1>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="text-center">
              <p className="text-black">{error}</p>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-black mb-2 text-sm">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-black bg-white text-black focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-black mb-2 text-sm">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-black bg-white text-black focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 hover:bg-gray-800"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}