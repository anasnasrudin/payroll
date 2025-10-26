"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, Upload, ChevronRight, Save, UserPlus2, X } from "lucide-react"
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
    const [activeMode, setActiveMode] = useState("Import Member")
    const [showInputMember, setShowInputMember] = useState(false)
    const [inputMember, setInputMember] = useState({ Nama: "", NIK: "", Start: "", End: "" })
    const [filteredUsers, setFilteredUsers] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const rowsPerPage = 9

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch("/api/member")
                const data = await res.json()
                if (data.success) {
                    setAllUsers(data.data)
                } else {
                    console.error("Gagal fetch member:", data.message)
                }
            } catch (error) {
                console.error("Error fetching member data:", error)
            }
        }
        fetchMembers()
    }, [])

    const generateOvertimeID = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        return Array.from({ length: 9 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    }

    const generateRowID = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        return Array.from({ length: 9 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    }

    useEffect(() => {
        setFormData((prev) => ({ ...prev, overtime_id: generateOvertimeID() }))
        const userData = localStorage.getItem("user")
        if (userData) {
            try {
                const user = JSON.parse(userData)
                setFormData((prev) => ({ ...prev, departemen: user.department }))
            } catch (err) {
                console.error("Error parsing user data:", err)
            }
        }
    }, [])

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

                const formatted = data.map((row) => ({
                    member_overtime_id: generateRowID(),
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
        // Konfirmasi simpan → juga pakai toast
        const result = await Swal.fire({
            title: "Simpan data overtime?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#6b7280",
            toast: true,
            position: "top",
            showConfirmButton: true,
            timerProgressBar: true,
            width: "350px",
            padding: "1rem",
            customClass: { popup: "rounded-md" }
        })

        if (!result.isConfirmed) return

        try {
            // Payload overtime
            const overtimePayload = {
                overtime_id: formData.overtime_id,
                departemen: formData.departemen,
                date: formData.date,
            }

            const resOvertime = await fetch("/api/overtime", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(overtimePayload),
            })
            const dataOvertime = await resOvertime.json()

            if (!dataOvertime.success) {
                return Swal.fire({
                    icon: "error",
                    title: dataOvertime.message || "Gagal menyimpan overtime!",
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 2000,
                    width: "350px",
                    padding: "1rem",
                    customClass: { popup: "rounded-md" }
                })
            }

            // Payload history
            const resHistory = await fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    overtime_id: formData.overtime_id,
                    date: formData.date,
                    departemen: formData.departemen,
                }),
            })
            const dataHistory = await resHistory.json()

            if (!dataHistory.success) {
                return Swal.fire({
                    icon: "error",
                    title: dataHistory.message || "Gagal menyimpan history!",
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 2000,
                    width: "350px",
                    padding: "1rem",
                    customClass: { popup: "rounded-md" }
                })
            }

            // Kirim members satu per satu
            if (Array.isArray(members) && members.length > 0) {
                for (const row of members) {
                    const payloadMember = {
                        member_overtime_id: row.member_overtime_id || "",
                        overtime_id: formData.overtime_id,
                        nik: row.nik || null,
                        name: row.member_name || null,
                        start: row.start || null,
                        finish: row.finish || null,
                    }

                    const resMember = await fetch("/api/member-overtime", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payloadMember),
                    })

                    const dataMember = await resMember.json()

                    if (!dataMember.success) {
                        return Swal.fire({
                            icon: "error",
                            title: dataMember.message || "Gagal menyimpan member!",
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
            }

            // ✅ Success toast kecil
            Swal.fire({
                icon: "success",
                title: "Data overtime, member & history berhasil disimpan!",
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2000,
                width: "350px",
                padding: "1rem",
                background: "#dcfce7",
                color: "#15803d",
                customClass: { popup: "rounded-md" }
            })

            // Reset form
            setMembers([])
            setFormData(prev => ({ ...prev, overtime_id: generateOvertimeID(), date: "" }))

        } catch (err) {
            console.error("❌ Error handleSave:", err)
            Swal.fire({
                icon: "error",
                title: "Error! Cek console.",
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

    const totalPages = Math.ceil(members.length / rowsPerPage)
    const indexOfLast = currentPage * rowsPerPage
    const indexOfFirst = indexOfLast - rowsPerPage
    const currentRows = members.slice(indexOfFirst, indexOfLast)

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage)
    }

    const handleInputClick = () => {
        if (!formData.date) {
            Swal.fire({
                icon: "warning",
                title: "Tanggal belum diisi",
                text: "Harap isi field Date terlebih dahulu sebelum input member.",
                toast: true,
                position: "top",
                showConfirmButton: false,
                background: "#fef3c7",
                color: "#78350f",
                timer: 2500,
                width: "400px",
                customClass: { popup: "rounded-lg py-1" },
            })
            return
        }
        setShowInputMember(true)
    }

    // 🔹 Autocomplete logic
    const handleNamaChange = (e) => {
        const value = e.target.value
        setInputMember({ ...inputMember, Nama: value, NIK: "" })
        if (value.length > 0) {
            const filtered = allUsers.filter((u) =>
                u.name.toLowerCase().includes(value.toLowerCase())
            )
            setFilteredUsers(filtered)
        } else {
            setFilteredUsers([])
        }
    }

    const handleSelectUser = (user) => {
        setInputMember({ ...inputMember, Nama: user.name, NIK: user.nik })
        setFilteredUsers([])
    }

    const handleAddMember = () => {
        // validasi field kosong
        if (!inputMember.Nama || !inputMember.NIK || !inputMember.Start || !inputMember.End) {
            Swal.fire({
                icon: "warning",
                title: "Data belum lengkap",
                text: "Harap isi semua field member.",
                toast: true,
                position: "top",
                showConfirmButton: false,
                background: "#fef3c7",
                color: "#78350f",
                timer: 2500,
                width: "400px",
                customClass: { popup: "rounded-lg py-1" },
            })
            return
        }

        // validasi waktu (end harus lebih besar dari start)
        const startTime = new Date(inputMember.Start)
        const endTime = new Date(inputMember.End)

        if (endTime <= startTime) {
            Swal.fire({
                icon: "warning",
                title: "Waktu tidak valid",
                text: "Waktu finish tidak boleh sama atau kurang dari waktu start!",
                toast: true,
                position: "top",
                showConfirmButton: false,
                background: "#fef3c7",
                color: "#78350f",
                timer: 2500,
                width: "400px",
                customClass: { popup: "rounded-lg py-1" },
            })
            return
        }

        // kalau valid → push data
        const newMember = {
            member_overtime_id: generateRowID(),
            overtime_id: formData.overtime_id,
            member_name: inputMember.Nama,
            nik: inputMember.NIK,
            start: inputMember.Start,
            finish: inputMember.End,
            departemen: formData.departemen,
            date: formData.date,
        }

        setMembers((prev) => [...prev, newMember])
        setInputMember({ Nama: "", NIK: "", Start: "", End: "" })
        setFilteredUsers([])
        setShowInputMember(false)

        Swal.fire({
            icon: "success",
            title: "Member berhasil ditambahkan",
            toast: true,
            position: "top",
            showConfirmButton: false,
            background: "#dcfce7",
            color: "#15803d",
            timer: 1500,    
            width: "400px",
            customClass: { popup: "rounded-lg py-1" },
        })
    }

    const cancelInputMember = () => {
        setShowInputMember(false)
        setFilteredUsers([])
        setInputMember({ Nama: "", NIK: "", Start: "", End: "" })
    }

    const formatDateTime = (dt) => (dt ? dt.replace("T", " ") : "")

    return (
        <>
            <Sidebar />
            <div className="ml-72 bg-gray-100 py-6 px-8 animate-fadeIn min-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-bold text-gray-800">Create Overtime</h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white transition-all duration-300 cursor-pointer"
                        >
                            <ChevronLeft size={20} />
                            <span>Back</span>
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white transition-all duration-300 cursor-pointer"
                        >
                            <Save size={20} />
                            <span>Save</span>
                        </button>
                    </div>
                </div>

                {/* Form & Tabs */}
                <div className="flex items-end justify-between gap-4 mb-4">
                    <div className="flex gap-4 flex-1">
                        <div className="flex flex-col flex-1">
                            <label className="text-sm font-medium mb-3">Overtime ID</label>
                            <div className="h-[42px] px-3 border border-gray-300 rounded-lg text-sm bg-white shadow-sm flex items-center text-gray-700 select-none cursor-not-allowed">
                                {formData.overtime_id}
                            </div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="text-sm font-medium mb-3">Department</label>
                            <div className="h-[42px] px-3 border border-gray-300 rounded-lg text-sm bg-white shadow-sm flex items-center text-gray-700 select-none cursor-not-allowed">
                                {formData.departemen}
                            </div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="text-sm font-medium mb-3">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="h-[42px] px-3 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-1 focus:ring-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    {/* Tab & Button */}
                    <div className="flex flex-col">
                        <div className="flex gap-4 border-b border-gray-300 mb-3">
                            {["Import Member", "Input Member"].map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveMode(tab)}
                                    className={`pb-1 font-medium text-sm transition-all duration-200 ${activeMode === tab
                                        ? "text-blue-700 border-b-2 border-blue-700"
                                        : "text-black font-semibold hover:text-blue-700 hover:border-b-2 hover:border-blue-700"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeMode === "Import Member" ? (
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 bg-white text-blue-700 font-medium rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white transition-all duration-300 h-[42px] px-4 cursor-pointer"
                                onClick={() => {
                                    if (!formData.date) {
                                        Swal.fire({
                                            icon: "warning",
                                            title: "Tanggal belum diisi",
                                            text: "Harap isi field Date terlebih dahulu sebelum import CSV.",
                                            toast: true,
                                            position: "top",
                                            showConfirmButton: false,
                                            background: "#fef3c7",
                                            color: "#78350f",
                                            timer: 2500,
                                            width: "400px",
                                            customClass: { popup: "rounded-lg py-1" },
                                        })
                                        return
                                    }
                                    document.getElementById("csvInput").click()
                                }}
                            >
                                <Upload size={18} />
                                <span>Import CSV</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 bg-white text-blue-700 font-medium rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white transition-all duration-300 h-[42px] px-4 cursor-pointer"
                                onClick={handleInputClick}
                            >
                                <UserPlus2 size={18} />
                                <span>Input Member</span>
                            </button>
                        )}

                        <input id="csvInput" type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-bold text-gray-800">List Member Overtime</h1>
                </div>

                {/* Table */}
                <div className="bg-white shadow-md rounded-xl mt-2 overflow-x-auto min-h-[300px]">
                    <table className="w-full text-[14px] border-collapse">
                        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0">
                            <tr>
                                <th className="py-1.5 px-2 border text-center font-semibold">ID</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">Overtime ID</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">NIK</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">Nama</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">Start</th>
                                <th className="py-1.5 px-2 border text-center font-semibold">End</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.length === 0 ? (
                                <tr className="h-[300px]">
                                    <td colSpan="9" className="text-center text-gray-500 italic align-middle">
                                        Data member tidak tersedia.
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {currentRows.map((row, i) => (
                                        <tr
                                            key={row.member_overtime_id}
                                            className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-all`}
                                            style={{ height: "30px" }}
                                        >
                                            <td className="py-1.5 px-2 text-center">{row.member_overtime_id}</td>
                                            <td className="py-1.5 px-2 text-center">{row.overtime_id}</td>
                                            <td className="py-1.5 px-2 text-center">{row.nik}</td>
                                            <td className="py-1.5 px-2 text-center">{row.member_name}</td>
                                            <td className="py-1.5 px-2 text-center">{formatDateTime(row.start)}</td>
                                            <td className="py-1.5 px-2 text-center">{formatDateTime(row.finish)}</td>
                                        </tr>
                                    ))}
                                    {Array.from({ length: Math.max(0, 9 - currentRows.length) }).map((_, i) => (
                                        <tr key={`empty-${i}`} className={`${(currentRows.length + i) % 2 === 0 ? "bg-gray-50" : "bg-white"}`} style={{ height: "33px" }}>
                                            <td colSpan="9"></td>
                                        </tr>
                                    ))}
                                </>
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
                            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"}`}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <div
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`transition-all cursor-pointer flex items-center justify-center ${currentPage === page ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-5 rounded-full font-semibold text-xs" : "bg-gray-300 hover:bg-gray-400 w-3 h-3 rounded-full"}`}
                                >
                                    {currentPage === page && page}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"}`}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Input Member */}
            {showInputMember && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative">
                        <button
                            onClick={cancelInputMember}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-semibold mb-4 text-center">Input Member</h2>

                        <div className="flex flex-col gap-3 relative">
                            <div className="relative w-full">
                                <span className="block text-sm font-medium mb-1">Name</span>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={inputMember.Nama}
                                    onChange={handleNamaChange}
                                    className="h-[42px] px-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-600 outline-none w-full"
                                />
                                {filteredUsers.length > 0 && (
                                    <div className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-y-auto w-full mt-1">
                                        {filteredUsers.map((user, i) => (
                                            <div
                                                key={i}
                                                onClick={() => handleSelectUser(user)}
                                                className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                                            >
                                                {user.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {inputMember.NIK && (
                                <div>
                                    <span className="block text-sm font-medium mb-1">NIK</span>
                                    <input
                                        type="text"
                                        placeholder="NIK"
                                        value={inputMember.NIK}
                                        readOnly
                                        className="h-[42px] px-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed transition-all duration-200 w-full"
                                    />
                                </div>
                            )}

                            <div>
                                <span className="block text-sm font-medium mb-1">Start</span>
                                <input
                                    type="datetime-local"
                                    placeholder="Start"
                                    value={inputMember.Start}
                                    onChange={(e) =>
                                        setInputMember({ ...inputMember, Start: e.target.value })
                                    }
                                    className="h-[42px] px-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-600 outline-none w-full"
                                />
                            </div>

                            <div>
                                <span className="block text-sm font-medium mb-1">Finish</span>
                                <input
                                    type="datetime-local"
                                    placeholder="End"
                                    value={inputMember.End}
                                    onChange={(e) => {
                                        const newEnd = e.target.value
                                        const startTime = new Date(inputMember.Start)
                                        const endTime = new Date(newEnd)

                                        if (inputMember.Start && endTime <= startTime) {
                                            Swal.fire({
                                                icon: "warning",
                                                title: "Waktu tidak valid",
                                                text: "Waktu selesai tidak boleh sama atau lebih awal dari waktu mulai.",
                                                toast: true,
                                                position: "top",
                                                showConfirmButton: false,
                                                background: "#fef3c7",
                                                color: "#78350f",
                                                timer: 2500,
                                                width: "400px",
                                                customClass: { popup: "rounded-lg py-1" },
                                            })
                                            return
                                        }

                                        setInputMember({ ...inputMember, End: newEnd })
                                    }}
                                    className="h-[42px] px-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-600 outline-none w-full"
                                />
                            </div>

                            <button
                                onClick={handleAddMember}
                                className="bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-all"
                            >
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
