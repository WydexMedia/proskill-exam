"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Submission = {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  batch: string;
  tutor: string;
  score: number;
  passed: boolean;
  submittedAt: string;
  certificate?: string; // base64 string for download
};

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data.submissions);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("proskill_logged_in") !== "true") {
      router.push("/login");
    }
  }, [router]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-8 h-8 border-2 border-black rounded-full animate-spin">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500 font-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light text-black tracking-tight">
                Exam Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-light">
                {submissions.length} submissions
              </p>
            </div>
           <button
              className="bg-black text-white px-6 py-2 font-light tracking-wide hover:bg-gray-900 transition-colors duration-200"
              onClick={() => {
                localStorage.removeItem("proskill_logged_in");
                router.push("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-gray-200 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-light">No submissions found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <div className="grid grid-cols-8 gap-4 text-xs uppercase tracking-wider text-gray-500 font-medium">
                  <div className="col-span-1">Student Info</div>
                  <div className="col-span-2">Contact</div>
                  <div>Batch</div>
                  <div>Tutor</div>
                  <div>Score</div>
                  <div>Status</div>
                  <div>Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {submissions.map((s, index) => (
                  <div
                    key={s._id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <div className="grid grid-cols-8 gap-4 items-center text-sm">
                      {/* Student Info */}
                      <div className="col-span-1">
                        <div className="font-medium text-black">{s.name}</div>
                        <div className="text-xs text-gray-500 font-light mt-1">
                          {new Date(s.submittedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      {/* Contact */}
                      <div className="col-span-2">
                        <div className="text-gray-600 font-light text-xs">{s.email}</div>
                        <div className="text-gray-600 font-light text-xs mt-1">{s.mobile}</div>
                      </div>
                      
                      {/* Batch */}
                      <div className="text-gray-600 font-light">{s.batch}</div>
                      
                      {/* Tutor */}
                      <div className="text-gray-600 font-light">{s.tutor}</div>
                      
                      {/* Score */}
                      <div className="font-medium text-black">
                        {s.score}<span className="text-gray-400 font-light">/15</span>
                      </div>
                      
                      {/* Status */}
                      <div>
                        {s.passed ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-black text-white">
                            PASSED
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium border border-gray-300 text-gray-600">
                            FAILED
                          </span>
                        )}
                      </div>
                      
                      {/* Action */}
                      <div>
                        {s.passed && s.certificate ? (
                          <button
                            className="inline-flex items-center text-xs font-medium text-black hover:text-gray-600 transition-colors duration-200 border-b border-black hover:border-gray-600"
                            onClick={() => alert('Certificate download would trigger here')}
                          >
                            Download
                          </button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {submissions.map((s) => (
                <div key={s._id} className="bg-white border border-gray-200 p-4 space-y-3">
                  {/* Header with name and status */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-black">{s.name}</h3>
                    {s.passed ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-black text-white">
                        PASSED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium border border-gray-300 text-gray-600">
                        FAILED
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="flex items-center justify-between py-2 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Score</span>
                    <span className="font-medium text-black">
                      {s.score}<span className="text-gray-400 font-light">/15</span>
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm text-gray-600 font-light">{s.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Mobile</span>
                      <span className="text-sm text-gray-600 font-light">{s.mobile}</span>
                    </div>
                  </div>

                  {/* Batch and Tutor */}
                  <div className="space-y-2 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Batch</span>
                      <span className="text-sm text-gray-600 font-light">{s.batch}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Tutor</span>
                      <span className="text-sm text-gray-600 font-light">{s.tutor}</span>
                    </div>
                  </div>

                  {/* Submitted date and certificate */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500">Submitted</span>
                      <div className="text-xs text-gray-500 font-light">
                        {new Date(s.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div>
                      {s.passed && s.certificate ? (
                        <a
                          href={`data:application/pdf;base64,${s.certificate}`}
                          download={`certificate-${s.name}.pdf`}
                          className="inline-flex items-center text-xs font-medium text-black hover:text-gray-600 transition-colors duration-200 border-b border-black hover:border-gray-600"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}