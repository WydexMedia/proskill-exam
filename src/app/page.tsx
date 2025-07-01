'use client';
import { useRouter } from 'next/navigation';
import { ShieldCheckIcon, BoltIcon, GlobeAltIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const router = useRouter();

  const handleExamFormClick = () => {
    router.push("/exam-form");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="border-b border-black">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold"> Proskill ExamPortal</h1>
            <nav className="space-x-8">
              <a href="/login" className="hover:underline">Login</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6 leading-tight">
            Welcome to<br />
            <span className="border-b-4 border-black">Proskill ExamPortal</span>
          </h2>
          
          <p className="text-xl mb-12 text-gray-600 max-w-2xl mx-auto">
            Your gateway to seamless online examinations. 
            Take tests, track progress, and achieve your academic goals.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
            <button
              onClick={handleExamFormClick}
              className="bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors border-2 border-black w-full sm:w-auto"
            >
              Start Exam
            </button>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-black p-8 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-black mb-4 mx-auto flex items-center justify-center rounded">
                {/* Secure Testing Icon */}
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Secure Testing</h3>
              <p className="text-gray-600">Advanced security measures ensure fair and reliable examinations</p>
            </div>
            
            <div className="border border-black p-8 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-black mb-4 mx-auto flex items-center justify-center rounded">
                {/* Instant Results Icon */}
                <BoltIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Instant Results</h3>
              <p className="text-gray-600">Get immediate feedback and detailed performance analytics</p>
            </div>
            
            <div className="border border-black p-8 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-black mb-4 mx-auto flex items-center justify-center rounded">
                {/* Easy Access Icon */}
                <GlobeAltIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Easy Access</h3>
              <p className="text-gray-600">Take exams from anywhere with our user-friendly interface</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black mt-20">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">© 2025 Proskill ExamPortal. All rights reserved.</p>
              <p
                className="text-sm text-gray-600 cursor-pointer hover:underline"
                onClick={() => window.open("https://wydexmedia.com", "_blank")}
              >
                Desing and Devoloped by WYDEX
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm hover:underline">Privacy Policy</a>
              <a href="#" className="text-sm hover:underline">Terms of Service</a>
              <a href="#" className="text-sm hover:underline">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}