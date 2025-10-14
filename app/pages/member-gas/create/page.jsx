"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, UserPlus, Save } from "lucide-react"

export default function CreateMemberGASPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        memgas_id: "",
        nik: "",
        departemen: "",
        section: "",
        nama: "",
        no_hp: ""
    })

    // Function generate 9 digit alfanumerik
    const generateID = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let id = ""
        for (let i = 0; i < 9; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return id
    }

    useEffect(() => {
        setFormData((prev) => ({ ...prev, memgas_id: generateID() }))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Member created:", formData)
        alert("Data member berhasil dibuat!")
        router.push("/pages/member-gas")
    }

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen flex items-center justify-center bg-gray-100 py-12 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl px-8 py-8 flex flex-col min-h-[500px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 mt-8">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-gray-800">Create Member</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <ChevronLeft size={20} />
                                <span>Back</span>
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <Save size={18} />
                                <span>Save</span>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 w-full">
                        {/* Member ID */}
                        <div className="min-w-0">
                            <label className="block text-sm font-medium mb-1">Member ID</label>
                            <input
                                type="text"
                                name="memgas_id"
                                value={formData.memgas_id}
                                readOnly
                                className="w-full border rounded-lg p-2.5 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        {/* NIK */}
                        <div className="min-w-0">
                            <label className="block text-sm font-medium mb-1">NIK</label>
                            <input
                                type="text"
                                name="nik"
                                value={formData.nik}
                                onChange={handleChange}
                                placeholder="Enter your NIK"
                                required
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Departemen */}
                        <div className="min-w-0">
                            <label className="block text-sm font-medium mb-1">Departemen</label>
                            <input
                                type="text"
                                name="departemen"
                                value={formData.departemen}
                                onChange={handleChange}
                                placeholder="Enter your department"
                                required
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Section */}
                        <div className="min-w-0">
                            <label className="block text-sm font-medium mb-1">Section</label>
                            <input
                                type="text"
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                placeholder="Enter your section"
                                required
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Nama */}
                        <div className="min-w-0">
                            <label className="block text-sm font-medium mb-1">Nama</label>
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* No HP */}
                        <div className="min-w-0">
                            <label className="block text-sm font-medium mb-1">No HP</label>
                            <input
                                type="text"
                                name="no_hp"
                                value={formData.no_hp}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
