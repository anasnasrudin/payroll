"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, ChevronRight, Pencil, Trash2, Eye } from "lucide-react"

export default function ApprovalPage() {
    const [approvals, setApprovals] = useState([
        { approval_id: "APR001", overtime_id: "OT001", role: "Manager", status: "Approved", remark: "Disetujui tanpa catatan" },
        { approval_id: "APR002", overtime_id: "OT002", role: "HRD", status: "Pending", remark: "Menunggu tanda tangan" },
        { approval_id: "APR003", overtime_id: "OT003", role: "General Manager", status: "Rejected", remark: "Jam tidak valid" },
        { approval_id: "APR004", overtime_id: "OT004", role: "Manager", status: "Approved", remark: "Lembur disetujui" },
        { approval_id: "APR005", overtime_id: "OT005", role: "HRD", status: "Pending", remark: "Perlu konfirmasi ulang" },
        ...Array.from({ length: 40 }, (_, i) => {
            const num = i + 6
            const padded = num.toString().padStart(3, "0")
            const roles = ["Manager", "HRD", "General Manager"]
            const statuses = ["Approved", "Pending", "Rejected"]
            const remarks = [
                "Menunggu verifikasi",
                "Disetujui otomatis",
                "Perlu revisi waktu",
                "Menunggu approval HR",
                "Catatan tambahan dikirim",
            ]
            return {
                approval_id: `APR${padded}`,
                overtime_id: `OT${padded}`,
                role: roles[i % roles.length],
                status: statuses[i % statuses.length],
                remark: remarks[i % remarks.length],
            }
        }),
    ])

    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 7
    const [slideDirection, setSlideDirection] = useState("right")
    const [isSliding, setIsSliding] = useState(false)

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
        if (newPage === currentPage || newPage < 1 || newPage > totalPages) return
        setSlideDirection(newPage > currentPage ? "right" : "left")
        setIsSliding(true)
        setTimeout(() => {
            setCurrentPage(newPage)
            setIsSliding(false)
        }, 180)
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

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search ID, Role, or Status..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-80"
                        />
                    </div>
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
                                <th className="p-2 border text-center text-base w-44">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRows.map((row, idx) =>
                                row ? (
                                    <tr
                                        key={row.approval_id}
                                        className="border-b border-gray-100 hover:bg-blue-50 hover:shadow-sm transition-transform duration-150 transform-gpu hover:scale-[1.01]"
                                    >
                                        <td className="p-2.5 border text-center text-base align-middle">{row.approval_id}</td>
                                        <td className="p-2.5 border text-center text-base align-middle">{row.overtime_id}</td>
                                        <td className="p-2.5 border text-center text-base align-middle">{row.role}</td>
                                        <td className="p-2.5 border text-center text-base align-middle">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${row.status === "Approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : row.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="p-2.5 border text-center text-base align-middle truncate">{row.remark}</td>
                                        <td className="p-2.5 border text-center text-base align-middle">
                                            <div className="flex justify-center gap-3">
                                                {/* <div className="relative group">
                                                    <button className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-150 cursor-pointer shadow-md hover:scale-105">
                                                        <Eye size={16} />
                                                    </button>
                                                    <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 whitespace-nowrap shadow-lg">
                                                        Details
                                                    </span>
                                                </div> */}

                                                <div className="relative group">
                                                    <button className="w-9 h-9 flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-white rounded-md transition duration-150 cursor-pointer shadow-md hover:scale-105">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 whitespace-nowrap shadow-lg">
                                                        Edit
                                                    </span>
                                                </div>

                                                <div className="relative group">
                                                    <button className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-150 cursor-pointer shadow-md hover:scale-105">
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 whitespace-nowrap shadow-lg">
                                                        Delete
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr
                                        key={`empty-${idx}`}
                                        className="h-14 border-b border-transparent"
                                    >
                                        <td colSpan="6" className="text-center text-gray-500 italic">
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
                        {(() => {
                            const pages = []
                            if (totalPages <= 7) {
                                for (let i = 1; i <= totalPages; i++) pages.push(i)
                            } else if (currentPage <= 4) {
                                pages.push(1, 2, 3, 4, 5, "...", totalPages)
                            } else if (currentPage >= totalPages - 3) {
                                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
                            } else {
                                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
                            }

                            return pages.map((page, i) =>
                                page === "..." ? (
                                    <span key={i} className="text-gray-400 text-sm px-1 select-none">...</span>
                                ) : (
                                    <div
                                        key={i}
                                        onClick={() => handlePageChange(page)}
                                        className={`transition-all cursor-pointer flex items-center justify-center ${currentPage === page
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-5 rounded-full font-semibold text-xs"
                                            : "bg-gray-300 hover:bg-gray-400 w-3 h-3 rounded-full"
                                            }`}
                                    >
                                        {currentPage === page && page}
                                    </div>
                                )
                            )
                        })()}
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
