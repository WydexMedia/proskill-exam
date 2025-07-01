"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FailureContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score") ?? "N/A";
  const name = searchParams.get("name") ?? "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Failure Icon */}
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
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-light text-black tracking-tight">
            Not Passed
          </h1>
          
          {name && (
            <p className="text-lg text-gray-600 font-light">
              Sorry, {name}
            </p>
          )}
          
          <p className="text-base text-gray-500">
            You did not meet the passing requirements
          </p>
        </div>

        {/* Score Display */}
        <div className="border border-gray-200 p-6 space-y-3">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wider text-gray-400 font-medium">
              Your Score
            </p>
            <p className="text-3xl font-light text-black">
              {score} <span className="text-lg text-gray-400">/ 15</span>
            </p>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Required: <span className="font-medium text-black">12</span> or higher
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-gray-50 border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            You may reapply after 24 hours
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => window.location.href = "/"}
          className="w-full bg-black text-white py-3 px-6 font-light tracking-wide hover:bg-gray-900 transition-colors duration-200"
        >
          Return Home
        </button>

        {/* Minimal Decoration */}
        <div className="pt-4">
          <div className="w-12 h-px bg-black mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailureContent />
    </Suspense>
  );
}