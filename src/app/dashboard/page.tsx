"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from 'lucide-react';
import { NextResponse } from "next/server";

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
  // certificate?: string; // base64 string for download
};

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'passed', 'failed'
  const [sorting, setSorting] = useState(true)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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

  // Filtered submissions: always apply both status and search filters
  const filteredSubmissions = submissions.filter((s) => {

    // Status filter
    if (statusFilter === "passed" && !s.passed) return false;
    if (statusFilter === "failed" && s.passed) return false;
    // score filtering 
    const AscendingOrder = submissions.sort((a, b) => sorting ? b.score - a.score : a.score - b.score)
    if (sorting) return AscendingOrder
    // Search filter
    if (search) {
      const q = search.toLowerCase();

      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.mobile.toLowerCase().includes(q) ||
        s.batch.toLowerCase().includes(q) ||
        s.tutor.toLowerCase().includes(q)

      );

    }

    return true;
  });

  // modal oepning and closing code 
  const openConfirmationModal = () => {
    setIsConfirmModalOpen(true);
  };

  // modal closing code 
  const closeConfirmationModal = () => {
    setIsConfirmModalOpen(false);
  };



  // setting true or false
  const Ascending = () => { setSorting(!sorting) }

  // Count passed and failed in filtered submissions
  const passedCount = filteredSubmissions.filter((s) => s.passed).length;
  const failedCount = filteredSubmissions.filter((s) => !s.passed).length;

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


  const deleteUser = async () => {
    try {
      const res = await fetch("/api/deleteUser", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUserId })
      }
      )
      const data = await res.json()

      if (!res.ok) {
        console.error("Failed to delete user:", data.error || data)
        return;
      }

      setSelectedUserId("")
      closeConfirmationModal()
    } catch (err) {
      console.error("Something went wrong:", err)
      NextResponse.json({ message: err }, { status: 500 })
    }
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
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="text"
                placeholder="Search by name, email, batch, etc."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded px-3 text-black py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSearching(true);
                }}
              />
              <button
                className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-900 transition-colors duration-200"
                onClick={() => setSearching(true)}
              >
                Search
              </button>
              <button
                className="ml-2 text-xs text-gray-500 underline hover:text-black"
                onClick={() => { setSearch(""); setSearching(false); }}
                style={{ display: search ? 'inline' : 'none' }}
              >
                Clear
              </button>
              {/* Passed/Failed summary boxes */}
              <div className="flex gap-2 ml-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-medium flex items-center min-w-[60px] justify-center">
                  Passed: {passedCount}
                </div>
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-medium flex items-center min-w-[60px] justify-center">
                  Failed: {failedCount}
                </div>
              </div>
              <button
                className="bg-black text-white px-6 py-2 font-light tracking-wide hover:bg-gray-900 transition-colors duration-200 sm:ml-4"
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Status filter above table/card views */}
        <div className="mb-4 flex items-center">
          <label htmlFor="statusFilter" className="mr-2 text-sm text-gray-700 font-medium">Show:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
            style={{ minWidth: 110 }}
          >
            <option value="all">All Students</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        {filteredSubmissions.length === 0 ? (
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

                  <button className="flex " onClick={Ascending}>
                    <span className="">SCORE</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* <!-- Ascending Arrow (Up) --> */}
                      <path d="M12 8L12 4" stroke="black" stroke-width="2" />
                      <path d="M8 8L12 4L16 8" stroke="black" stroke-width="2" />
                      <path d="M12 16L12 20" stroke="black" stroke-width="2" />
                      <path d="M8 16L12 20L16 16" stroke="black" stroke-width="2" />
                    </svg>
                  </button>




                  <div>Status</div>
                  {/* <div>Action</div> */}
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredSubmissions.map((s, index) => (
                  <div
                    key={s._id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
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
                      {/* <div>
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
                      </div> */}

                      {/* Delete */}
                      <div>
                        <button
                          className="inline-flex justify-center items-center no-underline text-xs font-medium text-black hover:text-gray-600 transition-colors duration-200  h-[40px] w-[40px]  border-black hover:border-gray-600"
                          onClick={() => {
                            setSelectedUserId(s._id)
                            openConfirmationModal();
                          }}

                        >
                          <Trash2 className="text-red-700" size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Code  */}
            {isConfirmModalOpen && (
              <div className="fixed inset-0 z-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsConfirmModalOpen(false)}></div>
                <div className="relative bg-white border border-black p-6 w-full max-w-md mx-4 z-50">
                  <h3 className="text-lg font-semibold mb-4 text-black">Please confirm before proceed?</h3>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      className="px-4 py-2 border border-black text-black hover:bg-gray-100"
                      onClick={() => setIsConfirmModalOpen(false)}

                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-black text-white hover:bg-gray-800"
                      onClick={() => {
                        if (selectedUserId) {
                          deleteUser()
                        }
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredSubmissions.map((s) => (
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
                      <button
                        className="inline-flex justify-center items-center no-underline text-xs font-medium text-black hover:text-gray-600 transition-colors duration-200  h-[40px] w-[40px]  border-black hover:border-gray-600"
                        onClick={() => {
                          setSelectedUserId(s._id);
                          openConfirmationModal();
                        }
                        } >
                        <Trash2 className="text-red-700" size={18} />
                      </button>
                    </div>
                    {/* <div>
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
                    </div> */}
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