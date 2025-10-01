"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ArrowUpDown } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button as ShadcnButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  type: string;
  // certificate?: string; // base64 string for download
};

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'passed', 'failed'
  const [examTypeFilter, setExamTypeFilter] = useState("all"); // 'all', 'resin', 'mehandi', 'ocean'
  const [sorting, setSorting] = useState(true) // true = descending score, false = ascending score
  const [dateSorting, setDateSorting] = useState(true) // true = latest first, false = oldest first
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers()
  }, []);

  // fetch users 
  const fetchUsers = () => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data.submissions);
        setLoading(false);
      });
  }
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("proskill_logged_in") !== "true") {
      router.push("/login");
    }
  }, [router]);

  // Filtered submissions: apply status, exam type, and search filters
  const filteredSubmissions = submissions.filter((s) => {
    // Status filter
    if (statusFilter === "passed" && !s.passed) return false;
    if (statusFilter === "failed" && s.passed) return false;
    
    // Exam type filter
    if (examTypeFilter !== "all" && s.type !== examTypeFilter) return false;
   
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

  // Sort filtered submissions
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    // Sort by score first, then by date
    const scoreDiff = sorting ? b.score - a.score : a.score - b.score;
    if (scoreDiff !== 0) return scoreDiff;
    
    // If scores are equal, sort by date
    const dateA = new Date(a.submittedAt).getTime();
    const dateB = new Date(b.submittedAt).getTime();
    return dateSorting ? dateB - dateA : dateA - dateB;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = sortedSubmissions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, examTypeFilter, search]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  

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
  const toggleDateSorting = () => { setDateSorting(!dateSorting) }

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
      fetchUsers()
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
        {/* Status and Exam Type filters above table/card views */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-700 font-medium">Show:</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ShadcnButton 
                  variant="outline" 
                  className="bg-black border-gray-600 text-white hover:bg-gray-800 min-w-[140px] justify-between"
                >
                  {statusFilter === 'all' ? 'All Students' : 
                   statusFilter === 'passed' ? 'Passed' : 'Failed'}
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </ShadcnButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black border-gray-600">
                <DropdownMenuItem 
                  className="text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => setStatusFilter('all')}
                >
                  All Students
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => setStatusFilter('passed')}
                >
                  Passed
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => setStatusFilter('failed')}
                >
                  Failed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-700 font-medium">Exam Type:</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ShadcnButton 
                  variant="outline" 
                  className="bg-black border-gray-600 text-white hover:bg-gray-800 min-w-[160px] justify-between"
                >
                  {examTypeFilter === 'all' ? 'All Exams' : 
                   examTypeFilter === 'resin' ? 'Resin Art' :
                   examTypeFilter === 'mehandi' ? 'Mehndi Art' : 'Ocean Theme'}
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </ShadcnButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black border-gray-600">
                <DropdownMenuItem 
                  className="text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => setExamTypeFilter('all')}
                >
                  All Exams
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => setExamTypeFilter('resin')}
                >
                  Resin Art
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => setExamTypeFilter('mehandi')}
                >
                  Mehndi Art
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => setExamTypeFilter('ocean')}
                >
                  Ocean Theme
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="text-sm text-gray-600 sm:ml-auto">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedSubmissions.length)} of {sortedSubmissions.length} submissions ({itemsPerPage} per page)
          </div>
        </div>
        {sortedSubmissions.length === 0 ? (
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
            <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <div className="grid grid-cols-10 gap-6 text-xs uppercase tracking-wider text-gray-500 font-medium min-w-[1200px]">
                  <div className="col-span-2 flex items-center justify-between">
                    <span>Student Info</span>
                    <button 
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors ml-2" 
                      onClick={toggleDateSorting}
                      title={dateSorting ? "Show oldest first" : "Show latest first"}
                    >
                      {dateSorting ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="col-span-2">Contact</div>
                  <div>Batch</div>
                  <div>Tutor</div>
                  <div className="flex items-center justify-center">
                    <button 
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors" 
                      onClick={Ascending}
                      title={sorting ? "Sort by lowest score first" : "Sort by highest score first"}
                    >
                      <span>SCORE</span>
                      {sorting ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div>Status</div>
                  <div>Type</div>
                  <div className="text-center">Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {currentSubmissions.map((s, index) => (
                  <div
                    key={s._id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                  >
                    <div className="grid grid-cols-10 gap-6 items-center text-sm min-w-[1200px]">
                      {/* Student Info - Column 1-2 */}
                      <div className="col-span-2">
                        <div className="font-medium text-black truncate">{s.name}</div>
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

                      {/* Contact - Column 3-4 */}
                      <div className="col-span-2">
                        <div className="text-gray-600 font-light text-xs truncate">{s.email}</div>
                        <div className="text-gray-600 font-light text-xs mt-1">{s.mobile}</div>
                      </div>

                      {/* Batch - Column 5 */}
                      <div className="text-gray-600 font-light truncate">{s.batch}</div>

                      {/* Tutor - Column 6 */}
                      <div className="text-gray-600 font-light truncate">{s.tutor}</div>

                      {/* Score - Column 7 */}
                      <div className="font-medium text-black text-center">
                        {s.score}<span className="text-gray-400 font-light">/15</span>
                      </div>

                      {/* Status - Column 8 */}
                      <div className="flex justify-center">
                        {s.passed ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-black text-white rounded">
                            PASSED
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium border border-gray-300 text-gray-600 rounded">
                            FAILED
                          </span>
                        )}
                      </div>

                      {/* Type - Column 9 */}
                      <div className="text-gray-600 font-light capitalize">{s.type}</div>

                      {/* Delete Action - Column 10 (should be in Action column) */}
                      <div className="flex justify-center">
                        <button
                          className="inline-flex justify-center items-center text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200 h-8 w-8 rounded-full"
                          onClick={() => {
                            setSelectedUserId(s._id);
                            openConfirmationModal();
                          }}
                          title="Delete submission"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 font-medium">
                    Items per page:
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ShadcnButton 
                        variant="outline" 
                        className="bg-black border-gray-600 text-white hover:bg-gray-800 min-w-16 text-sm justify-between"
                      >
                        {itemsPerPage}
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </ShadcnButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-20 bg-black border-gray-600">
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(5)}
                      >
                        5
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(10)}
                      >
                        10
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(20)}
                      >
                        20
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(50)}
                      >
                        50
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(100)}
                      >
                        100
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Pagination controls */}
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current page
                      const shouldShow = 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1);
                      
                      if (!shouldShow) {
                        // Show ellipsis for gaps
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }
                      
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Show items per page selector even when there's only one page */}
            {totalPages <= 1 && sortedSubmissions.length > 0 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 font-medium">
                    Items per page:
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ShadcnButton 
                        variant="outline" 
                        className="bg-black border-gray-600 text-white hover:bg-gray-800 min-w-16 text-sm justify-between"
                      >
                        {itemsPerPage}
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </ShadcnButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-20 bg-black border-gray-600">
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(5)}
                      >
                        5
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(10)}
                      >
                        10
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(20)}
                      >
                        20
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(50)}
                      >
                        50
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => setItemsPerPage(100)}
                      >
                        100
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}

            {/* Confirmation Modal */}
            <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this submission? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsConfirmModalOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (selectedUserId) {
                        deleteUser()
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {currentSubmissions.map((s) => (
                <div key={s._id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-sm">
                  {/* Header with name, status, and exam type */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black truncate">{s.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{s.type} Exam</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      {s.passed ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-black text-white rounded">
                          PASSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium border border-gray-300 text-gray-600 rounded">
                          FAILED
                        </span>
                      )}
                      <div className="font-medium text-black text-sm">
                        {s.score}<span className="text-gray-400 font-light">/15</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 block">Email</span>
                      <span className="text-sm text-gray-600 font-light break-all">{s.email}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Mobile</span>
                      <span className="text-sm text-gray-600 font-light">{s.mobile}</span>
                    </div>
                  </div>

                  {/* Batch and Tutor Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 block">Batch</span>
                      <span className="text-sm text-gray-600 font-light">{s.batch}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Tutor</span>
                      <span className="text-sm text-gray-600 font-light">{s.tutor}</span>
                    </div>
                  </div>

                  {/* Footer with date and actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 block">Submitted</span>
                      <div className="text-xs text-gray-600 font-light">
                        {new Date(s.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <button
                      className="inline-flex justify-center items-center text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200 h-8 w-8 rounded-full"
                      onClick={() => {
                        setSelectedUserId(s._id);
                        openConfirmationModal();
                      }}
                      title="Delete submission"
                    >
                      <Trash2 size={16} />
                    </button>
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