"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Translations
const translations = {
  en: {
    title: "Admin Login",
    username: "Username",
    password: "Password",
    login: "Login",
    invalidCredentials: "Invalid username or password",
    showPassword: "Show password",
    hidePassword: "Hide password"
  },
  ml: {
    title: "അഡ്മിൻ ലോഗിൻ",
    username: "ഉപയോക്തൃനാമം",
    password: "പാസ്വേഡ്",
    login: "ലോഗിൻ",
    invalidCredentials: "അസാധുവായ ഉപയോക്തൃനാമം അല്ലെങ്കിൽ പാസ്വേഡ്",
    showPassword: "പാസ്വേഡ് കാണിക്കുക",
    hidePassword: "പാസ്വേഡ് മറയ്ക്കുക"
  }
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"en" | "ml">("en");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "proskilladmin" && password === "Proskill@wydex") {
      localStorage.setItem("proskill_logged_in", "true"); // Set session
      router.push("/dashboard");
    } else {
      setError(t.invalidCredentials);
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
        
        {/* Language Switcher */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setLanguage(language === "en" ? "ml" : "en")}
            className="px-3 py-1 text-sm border border-black bg-white text-black hover:bg-black hover:text-white transition-colors duration-200"
          >
            {language === "en" ? "മലയാളം" : "English"}
          </button>
        </div>
        
        {/* Simple Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black">{t.title}</h1>
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
            <label className="block text-black mb-2 text-sm">{t.username}</label>
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
            <label className="block text-black mb-2 text-sm">{t.password}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-black bg-white text-black focus:outline-none pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t.hidePassword : t.showPassword}
              >
                {showPassword ? (
                  /* Eye Slash (Hide Password) */
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L3 3m6.878 6.878L12 12m0 0l3.878 3.878M12 12L9.878 9.878m8.242 8.242L21 21m-2.878-2.878A9.97 9.97 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 012.132-5.207m0 0A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-2.132 5.207" />
                  </svg>
                ) : (
                  /* Eye (Show Password) */
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 hover:bg-gray-800"
          >
            {t.login}
          </button>

        </div>
      </div>
    </div>
  );
}