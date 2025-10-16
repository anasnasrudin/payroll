"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, Upload, ChevronRight, Save } from "lucide-react"
import Papa from "papaparse"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"

export default function CreateOvertimePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        overtime_id: "",
        date: "",
        departemen: "",
    })
    const [members, setMembers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 11

    const generateID = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let id = ""
        for (let i = 0; i < 9; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return id
    }

    useEffect(() => {
        setFormData((prev) => ({ ...prev, overtime_id: generateID() }))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleCSVImport = (e) => {
        const file = e.target.files[0]
        if (!file) return

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const data = result.data
                if (!data.length || !data[0].Nama || !data[0].NIK) {
                    Swal.fire({
                        icon: "error",
                        title: "Import Gagal",
                        text: "Format CSV salah! Gunakan kolom: Nama, NIK, Start, End.",
                        toast: true,
                        position: "top",
                        showConfirmButton: false,
                        background: "#fee2e2",
                        color: "#b91c1c",
                        timer: 2500,
                        width: "420px",
                        customClass: { popup: "rounded-lg py-1" },
                    })
                    document.getElementById("csvInput").value = ""
                    return
                }

                const formatted = data.map((row, index) => ({
                    id: index + 1,
                    overtime_id: formData.overtime_id,
                    member_name: row.Nama,
                    nik: row.NIK,
                    start: row.Start,
                    finish: row.End,
                    departemen: formData.departemen,
                    date: formData.date,
                }))

                setMembers(formatted)
                Swal.fire({
                    icon: "success",
                    title: "Import Berhasil",
                    text: `${formatted.length} member berhasil diimport.`,
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    background: "#dcfce7",
                    color: "#15803d",
                    timer: 2000,
                    width: "420px",
                    customClass: { popup: "rounded-lg py-1" },
                })

                document.getElementById("csvInput").value = ""
            },
        })
    }

    const handleSave = async () => {
        if (!formData.date || !formData.departemen || members.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Data belum lengkap",
                text: "Pastikan semua field dan data member sudah diisi.",
                confirmButtonColor: "#2563eb",
            })
            return
        }

        const result = await Swal.fire({
            title: "Simpan data overtime?",
            text: "Pastikan semua data sudah benar sebelum disimpan.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, simpan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#d1d5db",
        })

        if (result.isConfirmed) {
            Swal.fire({
                icon: "success",
                title: "Data berhasil disimpan!",
                showConfirmButton: false,
                timer: 2000,
            })
            // nanti di sini tambahin post ke API kalau udah ready
        }
    }

    const totalPages = Math.ceil(members.length / rowsPerPage)
    const indexOfLast = currentPage * rowsPerPage
    const indexOfFirst = indexOfLast - rowsPerPage
    const currentRows = members.slice(indexOfFirst, indexOfLast)

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage)
    }

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen bg-gray-100 py-6 px-8 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-bold text-gray-800">Create Overtime</h1>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 
              hover:bg-[#066dca] hover:text-white transition-all duration-300 cursor-pointer"
                        >
                            <ChevronLeft size={20} />
                            <span>Back</span>
                        </button>

                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 
              hover:bg-[#066dca] hover:text-white transition-all duration-300 cursor-pointer"
                        >
                            <Save size={20} />
                            <span>Save</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Overtime ID</label>
                        <input
                            type="text"
                            name="overtime_id"
                            value={formData.overtime_id}
                            readOnly
                            className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Department</label>
                        <input
                            type="text"
                            name="departemen"
                            value={formData.departemen}
                            onChange={handleChange}
                            placeholder="Enter department"
                            required
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Input Member</label>
                        <button
                            className="flex items-center justify-center gap-2 w-full h-[42px] bg-white text-blue-700 font-medium rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white transition-all duration-300 cursor-pointer"
                            onClick={() => document.getElementById("csvInput").click()}
                        >
                            <Upload size={18} />
                            <span>Import CSV</span>
                        </button>
                        <input
                            id="csvInput"
                            type="file"
                            accept=".csv"
                            onChange={handleCSVImport}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow-md rounded-xl overflow-hidden mt-2 min-h-[400px]">
                    <table className="w-full text-[14px] border-collapse">
                        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <tr>
                                <th className="py-1.5 px-2 border text-center font-semibold">ID</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">Nama</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">NIK</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">Start</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">End</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">Department</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.length > 0 ? (
                                currentRows.map((row, i) => (
                                    <tr
                                        key={i}
                                        className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-all`}
                                    >
                                        <td className="py-1.5 px-2 text-center">{(currentPage - 1) * rowsPerPage + i + 1}</td>
                                        <td className="py-1.5 px-2 text-center">{row.member_name}</td>
                                        <td className="py-1.5 px-2 text-center">{row.nik}</td>
                                        <td className="py-1.5 px-2 text-center">{row.start}</td>
                                        <td className="py-1.5 px-2 text-center">{row.finish}</td>
                                        <td className="py-1.5 px-2 text-center">{row.departemen}</td>
                                        <td className="py-1.5 px-2 text-center">{row.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-2 text-center text-gray-500 italic">
                                        Belum ada data import.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {members.length > 0 && (
                    <div className="mt-3 flex items-center justify-start gap-4 pl-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"
                                }`}
                        >
                            <ChevronLeft size={18} />
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
                            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"
                                }`}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
