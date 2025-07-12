'use client';
import { useRouter } from 'next/navigation';
import { ShieldCheckIcon, BoltIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import { useState } from 'react';

// Translations
const translations = {
  en: {
    title: "Proskill ExamPortal",
    login: "Login",
    welcome: "Welcome to",
    subtitle: "Your gateway to seamless online examinations. Take tests, track progress, and achieve your academic goals.",
    startExam: "Start Exam",
    secureTesting: "Secure Testing",
    secureTestingDesc: "Advanced security measures ensure fair and reliable examinations",
    instantResults: "Instant Results",
    instantResultsDesc: "Get immediate feedback and detailed performance analytics",
    easyAccess: "Easy Access",
    easyAccessDesc: "Take exams from anywhere with our user-friendly interface",
    copyright: "© 2025 Proskill ExamPortal. All rights reserved.",
    developedBy: "Desing and Devoloped by WYDEX",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    support: "Support"
  },
  ml: {
    title: "പ്രോസ്കിൽ പരീക്ഷാ പോർട്ടൽ",
    login: "ലോഗിൻ",
    welcome: "സ്വാഗതം",
    subtitle: "നിങ്ങളുടെ നിരുപാധികമായ ഓൺലൈൻ പരീക്ഷകളുടെ വാതിൽ. പരീക്ഷകൾ എഴുതുക, പുരോഗതി ട്രാക്ക് ചെയ്യുക, നിങ്ങളുടെ അക്കാദമിക ലക്ഷ്യങ്ങൾ കൈവരിക്കുക.",
    startExam: "പരീക്ഷ ആരംഭിക്കുക",
    secureTesting: "സുരക്ഷിതമായ പരീക്ഷണം",
    secureTestingDesc: "വിപുലമായ സുരക്ഷാ നടപടികൾ നീതിയുള്ളതും വിശ്വസനീയവുമായ പരീക്ഷകൾ ഉറപ്പാക്കുന്നു",
    instantResults: "തൽക്ഷണ ഫലങ്ങൾ",
    instantResultsDesc: "തൽക്ഷണ ഫീഡ്ബാക്കും വിശദമായ പ്രകടന വിശകലനവും നേടുക",
    easyAccess: "എളുപ്പമുള്ള ആക്സസ്",
    easyAccessDesc: "ഞങ്ങളുടെ ഉപയോക്തൃ-സൗഹൃദ ഇന്റർഫേസ് ഉപയോഗിച്ച് എവിടെ നിന്നും പരീക്ഷകൾ എഴുതുക",
    copyright: "© 2025 പ്രോസ്കിൽ പരീക്ഷാ പോർട്ടൽ. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തമാണ്.",
    developedBy: "ഡിസൈൻ ചെയ്തത് വൈഡെക്സ്",
    privacyPolicy: "സ്വകാര്യതാ നയം",
    termsOfService: "സേവന നിബന്ധനകൾ",
    support: "പിന്തുണ"
  }
};

export default function Home() {
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "ml">("en");

  const t = translations[language];

  const handleExamFormClick = () => {
    router.push("/exam-form");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="border-b border-black">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t.title}</h1>
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === "en" ? "ml" : "en")}
                className="px-3 py-1 text-sm border border-black bg-white text-black hover:bg-black hover:text-white transition-colors duration-200"
              >
                {language === "en" ? "മലയാളം" : "English"}
              </button>
              <nav className="space-x-8">
                <a href="/login" className="hover:underline">{t.login}</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6 leading-tight">
            {t.welcome}<br />
            <span className="border-b-4 border-black">{t.title}</span>
          </h2>
          
          <p className="text-xl mb-12 text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
            <button
              onClick={handleExamFormClick}
              className="bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors border-2 border-black w-full sm:w-auto"
            >
              {t.startExam}
            </button>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-black p-8 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-black mb-4 mx-auto flex items-center justify-center rounded">
                {/* Secure Testing Icon */}
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{t.secureTesting}</h3>
              <p className="text-gray-600">{t.secureTestingDesc}</p>
            </div>
            
            <div className="border border-black p-8 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-black mb-4 mx-auto flex items-center justify-center rounded">
                {/* Instant Results Icon */}
                <BoltIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{t.instantResults}</h3>
              <p className="text-gray-600">{t.instantResultsDesc}</p>
            </div>
            
            <div className="border border-black p-8 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-black mb-4 mx-auto flex items-center justify-center rounded">
                {/* Easy Access Icon */}
                <GlobeAltIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{t.easyAccess}</h3>
              <p className="text-gray-600">{t.easyAccessDesc}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black mt-20">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">{t.copyright}</p>
              <p
                className="text-sm text-gray-600 cursor-pointer hover:underline"
                onClick={() => window.open("https://wydexmedia.com", "_blank")}
              >
                {t.developedBy}
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm hover:underline">{t.privacyPolicy}</a>
              <a href="#" className="text-sm hover:underline">{t.termsOfService}</a>
              <a href="#" className="text-sm hover:underline">{t.support}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}