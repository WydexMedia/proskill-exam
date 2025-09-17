"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score") ?? "N/A";
  const name = searchParams.get("name") ?? "";
  const type = searchParams.get("type") ??"";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-black rounded-full">
          <svg 
            className="w-10 h-10 text-black" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-black tracking-tight">
            Success
          </h1>
          
          {name && (
            <p className="text-lg text-gray-600 font-light">
              Dear {name}
            </p>
          )}
          
          <p className="text-base text-gray-500">
            You have successfully passed the {type} examination
          </p>
          <p className="text-base text-gray-500">
          Your certificate will be sent to your email shortly.
          </p>
        </div>

        {/* Score Display */}
        <div className="border border-gray-200 p-6 space-y-2">
          <p className="text-sm uppercase tracking-wider text-gray-400 font-medium">
            Final Score
          </p>
          <p className="text-3xl font-light text-black">
            {score} <span className="text-lg text-gray-400">/ 15</span>
          </p>
        </div>

        {/* Minimal Action */}
        <div className="pt-4">
          <div className="w-12 h-px bg-black mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}