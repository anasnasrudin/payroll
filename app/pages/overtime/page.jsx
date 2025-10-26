"use client"
import React, { useState, useEffect } from "react"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, ChevronRight, Eye, Pencil, ClockPlus, History } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OvertimePage() {
    const router = useRouter()

    const [overtimes, setOvertimes] = useState([])
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 7
    const [role, setRole] = useState("")

    // Ambil data user role
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            setRole(parsedUser.role)
        }
    }, [])

    // Fetch data overtime dari API
    useEffect(() => {
        if (!role) return

        const fetchOvertimes = async () => {
            try {
                const res = await fetch(`/api/overtime?role=${role}`)
                const data = await res.json()
                if (data.success) {
                    setOvertimes(data.data.map((item) => ({
                        overtime_id: item.overtime_id,
                        date: item.date,
                        depart: item.department,
                        status: item.status,
                    })))
                }
            } catch (err) {
                console.error("❌ Gagal fetch overtime:", err)
            }
        }

        fetchOvertimes()
    }, [role])


    const formatDate = (isoString) => {
        if (!isoString) return ""
        const date = new Date(isoString)
        return `${date.toLocaleDateString("id-ID")}`
    }

    const filteredOvertimes = overtimes.filter(
        (o) =>
            o.overtime_id.toLowerCase().includes(search.toLowerCase()) ||
            o.depart.toLowerCase().includes(search.toLowerCase()) ||
            o.status.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.max(1, Math.ceil(filteredOvertimes.length / rowsPerPage))
    const indexOfLast = currentPage * rowsPerPage
    const indexOfFirst = indexOfLast - rowsPerPage
    const currentRows = filteredOvertimes.slice(indexOfFirst, indexOfLast)

    const displayedRows = [
        ...currentRows,
        ...Array.from({ length: Math.max(0, rowsPerPage - currentRows.length) }).map(() => null),
    ]

    const handlePageChange = (newPage) => {
        if (newPage === currentPage || newPage < 1 || newPage > totalPages) return
        setCurrentPage(newPage)
    }

    const handleAdd = () => router.push("/pages/overtime/create")

    return (
        <>
            <Sidebar />

            <div className="ml-72 min-h-screen bg-gray-100 py-8 px-10 flex flex-col animate-fadeIn">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Overtime Data</h1>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search ID, Departemen, or Status..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-80"
                        />

                        {role === "ADMIN" && (
                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white transition-all duration-300 cursor-pointer"
                            >
                                <ClockPlus size={20} />
                                <span>Create</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                    <table className="w-full table-fixed text-sm">
                        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <tr>
                                <th className="p-2 border text-center text-base">ID</th>
                                <th className="p-2 border text-center text-base">Department</th>
                                <th className="p-2 border text-center text-base">Date</th>
                                <th className="p-2 border text-center text-base">Status</th>
                                <th className="p-2 border text-center text-base">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRows.map((row, idx) =>
                                row ? (
                                    <tr
                                        key={row.overtime_id}
                                        className="border-b border-gray-100 hover:bg-blue-50 hover:shadow-sm transition-transform duration-150 transform-gpu hover:scale-[1.01]"
                                    >
                                        <td className="p-2.5 border text-center text-base align-middle">{row.overtime_id}</td>
                                        <td className="p-2.5 border text-center text-base align-middle">{row.depart}</td>
                                        <td className="p-2.5 border text-center text-base align-middle">{formatDate(row.date)}</td>
                                        <td className="p-2.5 border text-center text-base align-middle">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${row.status.toLowerCase() === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : row.status.toLowerCase() === "waiting"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="p-2.5 border text-center text-base align-middle">
                                            <div className="flex justify-center gap-3">
                                                {role !== "ADMIN" && (
                                                    <button
                                                        title="Detail"
                                                        className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-150 cursor-pointer shadow-md hover:scale-105"
                                                        onClick={() => router.push(`/pages/overtime/detail/${row.overtime_id}`)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    title="History"
                                                    className="w-9 h-9 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded-md transition duration-150 cursor-pointer shadow-md hover:scale-105"
                                                    onClick={() => router.push(`/pages/overtime/history/${row.overtime_id}`)}
                                                >
                                                    <History size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={`empty-${idx}`} className="h-14 border-b border-transparent">
                                        <td colSpan="5" className="text-center text-gray-500 italic">
                                            {displayedRows.filter((r) => r).length === 0 && idx === Math.floor(displayedRows.length / 2)
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
