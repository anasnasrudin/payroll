"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"

export default function DetailOvertimePage() {
    const { overtime_id } = useParams()
    const router = useRouter()
    const [membersOvertime, setMembersOvertime] = useState([])
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 7

    // Dummy data overtime
    const allOvertimes = [
        { memov_id: "MEMOV001", overtime_id: "OT001", memgas_id: "MGAS001", start: "09/10/2025 16.00", finish: "09/10/2025 19.00" },
        { memov_id: "MEMOV002", overtime_id: "OT001", memgas_id: "MGAS003", start: "10/10/2025 16.00", finish: "10/10/2025 19.00" },
        { memov_id: "MEMOV003", overtime_id: "OT001", memgas_id: "MGAS010", start: "11/10/2025 16.00", finish: "11/10/2025 19.00" },
        ...Array.from({ length: 25 }, (_, i) => ({
            memov_id: `MEMOV${String(i + 4).padStart(3, "0")}`,
            overtime_id: "OT001",
            memgas_id: `MGAS${String(i + 11).padStart(3, "0")}`,
            start: "12/10/2025 16.00",
            finish: "12/10/2025 19.00"
        })),
    ]

    // Dummy data member GAS
    const membersGAS = [
        { memgas_id: "MGAS001", nama: "Budi Santoso" },
        { memgas_id: "MGAS002", nama: "Siti Aminah" },
        { memgas_id: "MGAS003", nama: "Rian Firmansyah" },
        { memgas_id: "MGAS004", nama: "Andi Setiawan" },
        { memgas_id: "MGAS005", nama: "Nur Aisyah" },
        { memgas_id: "MGAS006", nama: "Rizky Pratama" },
        { memgas_id: "MGAS007", nama: "Dewi Lestari" },
        { memgas_id: "MGAS008", nama: "Agus Salim" },
        { memgas_id: "MGAS009", nama: "Fajar Nugrogo" },
        { memgas_id: "MGAS010", nama: "Lina Marlina" },
        ...Array.from({ length: 92 }, (_, i) => ({
            memgas_id: `MGAS${String(i + 11).padStart(3, "0")}`,
            nama: `Karyawan ${String(i + 11).padStart(3, "0")}`,
        })),
    ]

    useEffect(() => {
        // Filter overtime sesuai ID
        const filtered = allOvertimes.filter((item) => item.overtime_id === overtime_id)

        // Gabungkan nama dari memberGAS
        const merged = filtered.map((item) => {
            const found = membersGAS.find((m) => m.memgas_id === item.memgas_id)
            return { ...item, memgas_nama: found ? found.nama : "-" }
        })

        setMembersOvertime(merged)
    }, [overtime_id])

    // Filter berdasarkan pencarian nama
    const filteredMembers = membersOvertime.filter((item) =>
        item.memgas_nama.toLowerCase().includes(search.toLowerCase())
    )

    // Pagination setup
    const totalPages = Math.ceil(filteredMembers.length / rowsPerPage)
    const indexOfLast = currentPage * rowsPerPage
    const indexOfFirst = indexOfLast - rowsPerPage
    const currentRows = filteredMembers.slice(indexOfFirst, indexOfLast)

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return
        setCurrentPage(newPage)
    }

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen bg-gray-100 flex items-center justify-center animate-fadeIn">

                {/* Header + Search */}
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl">
                    <div className="flex flex-col mb-6 gap-4">
                        {/* Header Title */}
                        <h1 className="text-3xl font-bold text-gray-800">
                            Detail Overtime
                        </h1>

                        {/* Search + Buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <input
                                type="text"
                                placeholder="Search member name..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-80"
                            />

                            <div className="flex gap-2">
                                <button
                                    // onClick={handleApprove}
                                    className="flex items-center gap-2 bg-white text-green-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-green-700 hover:bg-[#16a34a] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    <CheckCircle size={20} />
                                    <span>Approve</span>
                                </button>

                                <button
                                    // onClick={handleReject}
                                    className="flex items-center gap-2 bg-white text-red-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-red-700 hover:bg-[#dc2626] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    <XCircle size={20} />
                                    <span>Reject</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Member Overtime */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                        <table className="w-full table-fixed text-sm">
                            <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                <tr>
                                    <th className="p-2 border text-center text-base">Member Overtime ID</th>
                                    <th className="p-2 border text-center text-base">Overtime ID</th>
                                    <th className="p-2 border text-center text-base">Member Name</th>
                                    <th className="p-2 border text-center text-base">Start</th>
                                    <th className="p-2 border text-center text-base">Finish</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: rowsPerPage }).map((_, idx) => {
                                    const row = currentRows[idx]
                                    return row ? (
                                        <tr
                                            key={row.memov_id}
                                            className="border-b border-gray-100 hover:bg-blue-50 hover:shadow-sm transition-transform duration-150 transform-gpu hover:scale-[1.01]"
                                        >
                                            <td className="p-2.5 border text-center text-base align-middle font-semibold text-gray-800">
                                                {row.memov_id}
                                            </td>
                                            <td className="p-2.5 border text-center text-base align-middle">{row.overtime_id}</td>
                                            <td className="p-2.5 border text-center text-base align-middle">{row.memgas_nama}</td>
                                            <td className="p-2.5 border text-center text-base align-middle">{row.start}</td>
                                            <td className="p-2.5 border text-center text-base align-middle">{row.finish}</td>
                                        </tr>
                                    ) : (
                                        <tr
                                            key={`empty-${idx}`}
                                            className="h-11 border-b border-transparent"
                                        >
                                            <td colSpan="5" className="text-center text-gray-500 italic">
                                                {currentRows.length === 0 && idx === Math.floor(rowsPerPage / 2)
                                                    ? "Tidak ada data member overtime."
                                                    : ""}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Back + Pagination */}
                    <div className="mt-6 flex items-center justify-between w-full px-2">
                        {/* Back Button */}
                        <button
                            onClick={() => router.push("/pages/overtime")}
                            className="inline-flex items-center gap-1 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 
                            hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-base pr-2.5">Back</span>
                        </button>

                        {/* Pagination */}
                        <div className="flex items-center justify-end gap-4">
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
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`transition-all cursor-pointer flex items-center justify-center ${currentPage === i + 1
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-5 rounded-full font-semibold text-xs"
                                            : "bg-gray-300 hover:bg-gray-400 w-3 h-3 rounded-full"
                                            }`}
                                    >
                                        {currentPage === i + 1 && i + 1}
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
                </div>
            </div>
        </>
    )
}
