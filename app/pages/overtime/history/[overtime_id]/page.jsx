"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function HistoryOvertimePage() {
    const router = useRouter()
    const [historyData, setHistoryData] = useState([])
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 7

    // Ambil semua history dari API
    const fetchHistory = async () => {
        try {
            const res = await fetch(`/api/history`)
            const data = await res.json()
            if (data.success) {
                setHistoryData(data.data)
            } else {
                console.error("Gagal ambil history:", data.message)
            }
        } catch (err) {
            console.error("Error fetch history:", err)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    const formatDate = (isoString) => {
        if (!isoString) return ""
        const date = new Date(isoString)
        return `${date.toLocaleDateString("id-ID")}`
    }

    // Filter berdasarkan search
    const filteredHistory = historyData.filter(item =>
        item.overtime_id.toLowerCase().includes(search.toLowerCase()) ||
        item.depart.toLowerCase().includes(search.toLowerCase())
    )

    // Pagination
    const totalPages = Math.ceil(filteredHistory.length / rowsPerPage)
    const indexOfLast = currentPage * rowsPerPage
    const indexOfFirst = indexOfLast - rowsPerPage
    const currentRows = filteredHistory.slice(indexOfFirst, indexOfLast)

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return
        setCurrentPage(newPage)
    }

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen bg-gray-100 flex items-center justify-center animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg p-14 w-full max-w-[1000px]">
                    {/* Header + Search */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            History Overtime
                        </h1>
                        <input
                            type="text"
                            placeholder="Search Overtime ID or Department..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-80"
                        />
                    </div>

                    {/* Table History */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-5xl mx-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm">
                                    <tr>
                                        <th className="p-2 border text-center whitespace-nowrap">ID</th>
                                        <th className="p-2 border text-center whitespace-nowrap">Overtime ID</th>
                                        <th className="p-2 border text-center whitespace-nowrap">Date</th>
                                        <th className="p-2 border text-center whitespace-nowrap">Department</th>
                                        <th className="p-2 border text-center whitespace-nowrap">Approval Head</th>
                                        <th className="p-2 border text-center whitespace-nowrap">Approval HR</th>
                                        <th className="p-2 border text-center whitespace-nowrap">Approval GM</th>
                                        <th className="p-2 border text-center whitespace-nowrap">Note Head</th>
                                        <th className="p-2 border text-center whitespace-nowrap">Note HR</th>
                                        <th className="p-2 border text-center whitespace-nowrap">Note GM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: rowsPerPage }).map((_, idx) => {
                                        const row = currentRows[idx]
                                        return row ? (
                                            <tr key={row.history_id} className="hover:bg-blue-50">
                                                <td className="p-2 border text-center truncate">{row.history_id}</td>
                                                <td className="p-2 border text-center truncate">{row.overtime_id}</td>
                                                <td className="p-2 border text-center truncate">{formatDate(row.date)}</td>
                                                <td className="p-2 border text-center truncate">{row.depart}</td>
                                                <td className="p-2 border text-center truncate">{row.approval_head}</td>
                                                <td className="p-2 border text-center truncate">{row.approval_hr}</td>
                                                <td className="p-2 border text-center truncate">{row.approval_gm}</td>
                                                <td className="p-2 border text-center truncate">{row.note_head}</td>
                                                <td className="p-2 border text-center truncate">{row.note_hr}</td>
                                                <td className="p-2 border text-center truncate">{row.note_gm}</td>
                                            </tr>
                                        ) : (
                                            <tr key={`empty-${idx}`} className="h-10 border-b border-transparent">
                                                <td colSpan="10" className="text-center text-gray-500 italic">
                                                    {currentRows.length === 0 && idx === Math.floor(rowsPerPage / 2)
                                                        ? "Tidak ada data history."
                                                        : ""}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination + Back */}
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={() => router.push("/pages/overtime")}
                            className="inline-flex items-center gap-1 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 
                            hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                        >
                            <ChevronLeft size={20} />
                            Back
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-full ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <div
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`cursor-pointer flex items-center justify-center ${currentPage === i + 1 ? "bg-blue-500 text-white w-8 h-5 rounded-full font-semibold text-xs" : "bg-gray-300 w-3 h-3 rounded-full"}`}
                                >
                                    {currentPage === i + 1 && i + 1}
                                </div>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-full ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
