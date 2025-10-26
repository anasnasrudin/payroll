"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import Swal from "sweetalert2"

export default function DetailOvertimePage() {
    const { overtime_id } = useParams()
    const router = useRouter()
    const [membersOvertime, setMembersOvertime] = useState([])
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 7

    useEffect(() => {
        const fetchMembers = async () => {
            if (!overtime_id) return
            try {
                const res = await fetch(`/api/member-overtime?overtime_id=${overtime_id}`)
                const data = await res.json()
                if (data.success) {
                    setMembersOvertime(
                        data.data.map((item) => ({
                            ...item,
                            memgas_nama: item.name || "-",
                        }))
                    )
                }
            } catch (err) {
                console.error("❌ Gagal fetch member overtime:", err)
            }
        }

        fetchMembers()
    }, [overtime_id])

    const filteredMembers = membersOvertime.filter((item) =>
        item.memgas_nama.toLowerCase().includes(search.toLowerCase()) ||
        item.member_overtime_id?.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.ceil(filteredMembers.length / rowsPerPage)
    const indexOfLast = currentPage * rowsPerPage
    const indexOfFirst = indexOfLast - rowsPerPage
    const currentRows = filteredMembers.slice(indexOfFirst, indexOfLast)

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return
        setCurrentPage(newPage)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        return date.toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })
    }

    const handleApproval = async (statusType) => {
        const storedUser = localStorage.getItem("user")
        const role = storedUser ? JSON.parse(storedUser).role : null
        const overtime_id_value = overtime_id

        if (!overtime_id_value || !role) {
            return Swal.fire({
                icon: "error",
                title: "Data tidak lengkap (role/overtime_id)!",
                toast: true,
                position: "top",
                timer: 2000,
                showConfirmButton: false,
                width: "350px",
                padding: "1rem",
                customClass: { popup: "rounded-md" }
            })
        }

        const { value: remark } = await Swal.fire({
            title: statusType === "approved" ? "Setujui lembur ini?" : "Tolak lembur ini?",
            input: "textarea",
            inputPlaceholder: "Enter remark",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            confirmButtonColor: statusType === "approved" ? "#16a34a" : "#dc2626",
            inputValidator: (value) => {
                if (!value) return "Catatan wajib diisi!"
            },
            inputAttributes: {
                style: "height: 60px; resize: none;"
            },
            toast: true,
            position: "top",
            width: "350px",
            padding: "1rem",
            customClass: { popup: "rounded-md" }
        })

        if (!remark) return

        try {
            // 1️⃣ POST ke /api/history
            const historyRes = await fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    overtime_id: overtime_id_value,
                    date: new Date().toISOString().split("T")[0],
                    departemen: "MAINTENANCE & IT", // bisa diubah sesuai data
                    role: role,
                    approval: statusType,
                    note: remark
                })
            })

            const historyData = await historyRes.json()
            if (!historyData.success) throw new Error(historyData.message || "Gagal update history")

            // 2️⃣ POST ke /api/approval
            const approvalRes = await fetch("/api/approval", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    overtime_id: overtime_id_value,
                    role: role,
                    status: statusType,
                    remark: remark
                })
            })

            const approvalData = await approvalRes.json()
            if (!approvalData.success) throw new Error(approvalData.message || "Gagal proses approval")

            // Kalau keduanya sukses
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "History & approval berhasil disimpan",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 1500,
                width: "350px",
                padding: "1rem",
                customClass: { popup: "rounded-md" },
                background: "#dcfce7",
                color: "#15803d"
            })

            setTimeout(() => router.push("/pages/overtime"), 1600)

        } catch (error) {
            console.error("❌ Error approval/history:", error)
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.message || "Terjadi kesalahan saat memproses",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2000,
                width: "350px",
                padding: "1rem",
                customClass: { popup: "rounded-md" }
            })
        }
    }

    const displayRows = [...currentRows]
    while (displayRows.length < rowsPerPage) {
        displayRows.push(null)
    }

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen bg-gray-100 flex items-center justify-center animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl">
                    <div className="flex flex-col mb-6 gap-4">
                        <h1 className="text-3xl font-bold text-gray-800">Detail Overtime</h1>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <input
                                type="text"
                                placeholder="Search ID or member name..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-80"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApproval("approved")}
                                    className="flex items-center gap-2 bg-white text-green-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-green-700 hover:bg-[#16a34a] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    <CheckCircle size={20} />
                                    <span>Approve</span>
                                </button>

                                <button
                                    onClick={() => handleApproval("rejected")}
                                    className="flex items-center gap-2 bg-white text-red-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-red-700 hover:bg-[#dc2626] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    <XCircle size={20} />
                                    <span>Reject</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col min-h-[355px]">
                        <table className="w-full table-fixed text-sm">
                            <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                <tr>
                                    <th className="p-2 border text-center text-base">ID</th>
                                    <th className="p-2 border text-center text-base">Overtime ID</th>
                                    <th className="p-2 border text-center text-base">Member Name</th>
                                    <th className="p-2 border text-center text-base">Start</th>
                                    <th className="p-2 border text-center text-base">Finish</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayRows.map((row, idx) => (
                                    row ? (
                                        <tr key={row.member_overtime_id} className="border-b border-gray-100 hover:bg-blue-50 hover:shadow-sm transition-transform duration-150 transform-gpu hover:scale-[1.01] h-[38px]">
                                            <td className="p-2.5 border text-center text-base font-semibold text-gray-800">{row.member_overtime_id}</td>
                                            <td className="p-2.5 border text-center text-base">{row.overtime_id}</td>
                                            <td className="p-2.5 border text-center text-base truncate">{row.memgas_nama}</td>
                                            <td className="p-2.5 border text-center text-base">{formatDate(row.start)}</td>
                                            <td className="p-2.5 border text-center text-base">{formatDate(row.finish)}</td>
                                        </tr>
                                    ) : (
                                        <tr key={`empty-${idx}`} className="border-b border-transparent h-[38px]">
                                            <td colSpan="5" className="text-center text-gray-400 italic">&nbsp;</td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex items-center justify-between w-full px-2">
                        <button
                            onClick={() => router.push("/pages/overtime")}
                            className="inline-flex items-center gap-1 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-base pr-2.5">Back</span>
                        </button>

                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"}`}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`transition-all cursor-pointer flex items-center justify-center ${currentPage === i + 1 ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-5 rounded-full font-semibold text-xs" : "bg-gray-300 hover:bg-gray-400 w-3 h-3 rounded-full"}`}
                                    >
                                        {currentPage === i + 1 && i + 1}
                                    </div>
                                ))}
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
                </div>
            </div>
        </>
    )
}
