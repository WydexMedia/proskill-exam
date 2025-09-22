'use client';
import { useRouter } from 'next/navigation';
import { ShieldCheckIcon, BoltIcon, GlobeAltIcon, CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from 'react';

// Translations
const translations = {
  en: {
    title: "Proskill ExamPortal",
    login: "Login",
    welcome: "Welcome to",
    subtitle: "Your gateway to seamless online examinations. Take tests, track progress, and achieve your academic goals.",
    startExam: "Start Exam",
    resinExam: "Resin Art Exam",
    mehndiExam: "Mehndi Art Exam",
    oceanExam: "Ocean Theme Exam",
    enterCode: "Enter exam code",
    submit: "Submit",
    cancel: "Cancel",
    invalidCode: "Invalid code",
    comingSoon: "Ocean Theme exam is coming soon.",
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
    resinExam: "റെസിൻ ആർട്ട് പരീക്ഷ",
    mehndiExam: "മെഹന്തി ആർട്ട് പരീക്ഷ",
    oceanExam: "ഒഷ്യൻ തീം പരീക്ഷ",
    enterCode: "പരീക്ഷ കോഡ് നൽകുക",
    submit: "സമർപ്പിക്കുക",
    cancel: "റദ്ദാക്കുക",
    invalidCode: "തെറ്റായ കോഡ്",
    comingSoon: "ഒഷ്യൻ തീം പരീക്ഷ ഉടൻ വരുന്നു.",
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
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [activeExam, setActiveExam] = useState<null | 'resin' | 'mehndi' | "ocean">(null);
  const [examCodeInput, setExamCodeInput] = useState('');
  const [toast, setToast] = useState<null | { message: string; type: 'error' | 'info' }>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const t = translations[language];

  const showToast = (message: string, type: 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
      setTimeout(() => setToast(null), 300);
    }, 3000);
  };

  const openCodeModal = (type: 'resin' | 'mehndi' | 'ocean') => {
    setActiveExam(type);
    setExamCodeInput('');
    setIsCodeModalOpen(true);
  };

  const submitCode = () => {
    if (!activeExam) return;
    const code = examCodeInput.trim();
    if (activeExam === 'resin' && code === 'PRORESIN2025') {
      setIsCodeModalOpen(false);
      sessionStorage.setItem("type","resin")
      router.push('/exam-form');
      return;
    }
    if (activeExam === 'mehndi' && code === 'MEHANDIPRO2025') {
      setIsCodeModalOpen(false);
      sessionStorage.setItem("type","mehandi")
      router.push('/mehandi-exam');
      return;
    }
    if(activeExam === 'ocean' && code === "OCEANPRO2025"){
      setIsCodeModalOpen(false);
      sessionStorage.setItem("type","ocean")
      router.push('/ocean-exam');
      return;
    }
    showToast(t.invalidCode, 'error');
  };

  const handleExamFormClick = () => {
    router.push("/exam-form");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out transform ${
          isToastVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
        }`}>
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border-l-4 ${
            toast.type === 'error' 
              ? 'bg-red-50 border-red-500 text-red-800' 
              : 'bg-blue-50 border-blue-500 text-blue-800'
          }`}>
            <div className={`flex-shrink-0 ${toast.type === 'error' ? 'text-red-500' : 'text-blue-500'}`}>
              {toast.type === 'error' ? (
                <ExclamationTriangleIcon className="w-5 h-5" />
              ) : (
                <CheckCircleIcon className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 text-sm font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => {
                setIsToastVisible(false);
                setTimeout(() => setToast(null), 300);
              }}
              className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                toast.type === 'error' ? 'hover:bg-red-500' : 'hover:bg-blue-500'
              }`}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
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

          {/* Exam Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <button
              onClick={() => openCodeModal('resin')}
              className="bg-black text-white px-6 py-4 text-base font-medium hover:bg-gray-800 transition-colors border-2 border-black"
            >
              {t.resinExam}
            </button>
            <button
              onClick={() => openCodeModal('mehndi')}
              className="bg-black text-white px-6 py-4 text-base font-medium hover:bg-gray-800 transition-colors border-2 border-black"
            >
              {t.mehndiExam}
            </button>
            <button
              onClick={() => openCodeModal('ocean')}
              className="bg-black text-white button-default px-6 py-4 text-base font-medium hover:bg-gray-800 transition-colors border-2 border-black"
            >
              {t.oceanExam}
            </button>
          </div>

          {/* Code Modal */}
          {isCodeModalOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsCodeModalOpen(false)}></div>
              <div className="relative bg-white border border-black p-6 w-full max-w-md mx-4 z-50">
                <h3 className="text-lg font-semibold mb-4 text-black">{t.enterCode}</h3>
                <input
                  type="text"
                  value={examCodeInput}
                  onChange={(e) => setExamCodeInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') submitCode(); }}
                  className="w-full border border-black px-3 py-2 text-black focus:outline-none"
                  autoFocus
                />
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 border border-black text-black hover:bg-gray-100"
                    onClick={() => setIsCodeModalOpen(false)}
                  >
                    {t.cancel}
                  </button>
                  <button
                    className="px-4 py-2 bg-black text-white hover:bg-gray-800"
                    onClick={submitCode}
                  >
                    {t.submit}
                  </button>
                </div>
              </div>
            </div>
          )}

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