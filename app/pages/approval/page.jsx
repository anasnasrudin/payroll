"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ApprovalPage() {
    const [approvals, setApprovals] = useState([])
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 7

    // 🔹 Ambil data approval dari API
    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                const storedUser = localStorage.getItem("user")
                const role = storedUser ? JSON.parse(storedUser).role : ""

                const res = await fetch(`/api/approval?role=${role}`)
                const data = await res.json()
                if (data.success) {
                    setApprovals(data.data)
                } else {
                    console.error("Gagal ambil data:", data.message)
                }
            } catch (err) {
                console.error("Error fetch approval:", err)
            }
        }
        fetchApprovals()
    }, [])

    useEffect(() => setCurrentPage(1), [search])

    const filtered = approvals.filter(
        (a) =>
            a.approval_id.toLowerCase().includes(search.toLowerCase()) ||
            a.overtime_id.toLowerCase().includes(search.toLowerCase()) ||
            a.role.toLowerCase().includes(search.toLowerCase()) ||
            a.status.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
    const indexOfLast = currentPage * rowsPerPage
    const indexOfFirst = indexOfLast - rowsPerPage
    const currentRows = filtered.slice(indexOfFirst, indexOfLast)

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || newPage === currentPage) return
        setCurrentPage(newPage)
    }

    const displayedRows = [
        ...currentRows,
        ...Array.from({ length: Math.max(0, rowsPerPage - currentRows.length) }).map(() => null),
    ]

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen bg-gray-100 py-8 px-10 flex flex-col animate-fadeIn">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Approval List</h1>
                    <input
                        type="text"
                        placeholder="Search ID, Role, or Status..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-80"
                    />
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                    <table className="w-full table-fixed text-sm">
                        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <tr>
                                <th className="p-2 border text-center text-base">Approval ID</th>
                                <th className="p-2 border text-center text-base">Overtime ID</th>
                                <th className="p-2 border text-center text-base">Role</th>
                                <th className="p-2 border text-center text-base">Status</th>
                                <th className="p-2 border text-center text-base">Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRows.map((row, idx) =>
                                row ? (
                                    <tr
                                        key={row.approval_id}
                                        className="border-b border-gray-100 hover:bg-blue-50 transition-transform duration-150 transform-gpu hover:scale-[1.01]"
                                    >
                                        <td className="p-2.5 border text-center text-base">{row.approval_id}</td>
                                        <td className="p-2.5 border text-center text-base">{row.overtime_id}</td>
                                        <td className="p-2.5 border text-center text-base">{row.role}</td>
                                        <td className="p-2.5 border text-center text-base">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${row.status.toLowerCase() === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : row.status.toLowerCase() === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="p-2.5 border text-center text-base truncate">{row.remark}</td>
                                    </tr>
                                ) : (
                                    <tr key={`empty-${idx}`} className="h-14 border-b border-transparent">
                                        <td colSpan="5" className="text-center text-gray-500 italic">
                                            {displayedRows.filter(r => r).length === 0 && idx === Math.floor(displayedRows.length / 2)
                                                ? "Data tidak tersedia."
                                                : ""}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-start gap-4 pl-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"
                            }`}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <div
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`transition-all cursor-pointer flex items-center justify-center ${currentPage === page
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-5 rounded-full font-semibold text-xs"
                                        : "bg-gray-300 hover:bg-gray-400 w-3 h-3 rounded-full"
                                    }`}
                            >
                                {currentPage === page && page}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"
                            }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </>
    )
}
