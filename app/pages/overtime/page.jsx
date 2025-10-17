"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, ChevronRight, Eye, ClockPlus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OvertimePage() {
    const router = useRouter()

    const [overtimes, setOvertimes] = useState([
        {
            id: "be002c90",
            timestamps: "23/4/2025 10.25.31",
            date: "21/4/2025",
            time_rest: "0:00:00",
            departement: "MAINTENANCE & IT",
            approval_manager: "Reject",
            approval_hr: "",
            approval_gm: "",
            note_hr: "",
            note_gm: "",
        },
        {
            id: "ddcd9190",
            timestamps: "28/4/2025 09.38.54",
            date: "26/4/2025",
            time_rest: "12:00:00",
            departement: "MAINTENANCE & IT",
            approval_manager: "Reject",
            approval_hr: "",
            approval_gm: "",
            note_hr: "",
            note_gm: "",
        },
        {
            id: "6088e93a",
            timestamps: "28/4/2025 13.03.16",
            date: "26/4/2025",
            time_rest: "1:00:00",
            departement: "MAINTENANCE & IT",
            approval_manager: "Approve",
            approval_hr: "Approve",
            approval_gm: "Approve",
            note_hr: "Sesuai",
            note_gm: "sesuai",
        },
        // contoh data tambahan (opsional)
    ])

    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 7

    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    const handleAdd = () => {
        router.push("/pages/overtime/create")
    }

    const filtered = overtimes.filter((o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.departement.toLowerCase().includes(search.toLowerCase()) ||
        (o.approval_manager || "").toLowerCase().includes(search.toLowerCase()) ||
        (o.approval_hr || "").toLowerCase().includes(search.toLowerCase()) ||
        (o.approval_gm || "").toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
    const indexOfLast = currentPage * rowsPerPage
    const indexOfFirst = indexOfLast - rowsPerPage
    const currentRows = filtered.slice(indexOfFirst, indexOfLast)

    const handlePageChange = (newPage) => {
        if (newPage === currentPage || newPage < 1 || newPage > totalPages) return
        setCurrentPage(newPage)
    }

    return (
        <>
            <Sidebar />

            <div className="ml-72 min-h-screen bg-gray-100 py-8 px-6 flex flex-col animate-fadeIn">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">overtime data</h1>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="search id, departement, atau approval..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-80"
                        />

                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 
             hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                        >
                            <ClockPlus size={18} />
                            <span>create</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-[1100px] w-full text-sm table-fixed">
                        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <tr>
                                <th className="p-3 border text-left">id</th>
                                <th className="p-3 border text-left">timestamps</th>
                                <th className="p-3 border text-left">date</th>
                                <th className="p-3 border text-left">time rest</th>
                                <th className="p-3 border text-left">departement</th>
                                <th className="p-3 border text-left">approval manager</th>
                                <th className="p-3 border text-left">approval hr</th>
                                <th className="p-3 border text-left">approval gm</th>
                                <th className="p-3 border text-left">note hr</th>
                                <th className="p-3 border text-left">note gm</th>
                                <th className="p-3 border text-center">action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="p-6 text-center text-gray-500 italic">
                                        data tidak tersedia.
                                    </td>
                                </tr>
                            ) : (
                                currentRows.map((row) => (
                                    <tr key={row.id} className="border-b hover:bg-blue-50 transition-colors">
                                        <td className="p-2.5 border align-middle text-xs font-medium">{row.id}</td>
                                        <td className="p-2.5 border align-middle text-xs">{row.timestamps}</td>
                                        <td className="p-2.5 border align-middle text-xs">{row.date}</td>
                                        <td className="p-2.5 border align-middle text-xs">{row.time_rest}</td>
                                        <td className="p-2.5 border align-middle text-xs">{row.departement}</td>

                                        <td className="p-2.5 border align-middle text-xs">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.approval_manager === "Approve" ? "bg-green-100 text-green-700" : row.approval_manager === "Reject" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {row.approval_manager || "—"}
                                            </span>
                                        </td>

                                        <td className="p-2.5 border align-middle text-xs">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.approval_hr === "Approve" ? "bg-green-100 text-green-700" : row.approval_hr === "Reject" ? "bg-red-100 text-red-700" : "bg-transparent text-gray-500"}`}>
                                                {row.approval_hr || "—"}
                                            </span>
                                        </td>

                                        <td className="p-2.5 border align-middle text-xs">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.approval_gm === "Approve" ? "bg-green-100 text-green-700" : row.approval_gm === "Reject" ? "bg-red-100 text-red-700" : "bg-transparent text-gray-500"}`}>
                                                {row.approval_gm || "—"}
                                            </span>
                                        </td>

                                        <td className="p-2.5 border align-middle text-xs">{row.note_hr || "-"}</td>
                                        <td className="p-2.5 border align-middle text-xs">{row.note_gm || "-"}</td>

                                        <td className="p-2.5 border align-middle text-xs">
                                            <div className="flex justify-center gap-2">
                                                <button className="w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-150 cursor-pointer shadow-md" onClick={() => router.push(`/pages/overtime/${row.id}`)}>
                                                    <Eye size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* paginate */}
                <div className="mt-4 flex items-center justify-start gap-4 pl-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"}`}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const page = i + 1
                            return (
                                <div
                                    key={i}
                                    onClick={() => handlePageChange(page)}
                                    className={`transition-all cursor-pointer flex items-center justify-center ${currentPage === page ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-5 rounded-full font-semibold text-xs" : "bg-gray-300 hover:bg-gray-400 w-3 h-3 rounded-full"}`}
                                >
                                    {currentPage === page && page}
                                </div>
                            )
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </>
    )
}
