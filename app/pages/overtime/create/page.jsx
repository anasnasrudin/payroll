"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, Save, Clock } from "lucide-react"

export default function CreateOvertimePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        overtime_id: "",
        date: "",
        departemen: ""
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
        setFormData((prev) => ({ ...prev, overtime_id: generateID() }))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // otomatis status = Pending
        const dataToSave = { ...formData, status: "Pending" }
        console.log("Overtime created:", dataToSave)
        alert("Data overtime berhasil dibuat!")
        router.push("/pages/overtime")
    }

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen flex items-center justify-center bg-gray-100 py-12 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl px-8 py-10 flex flex-col min-h-[400px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-gray-800">Create Overtime</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700
                hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <ChevronLeft size={20} />
                                <span>Back</span>
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700
                hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <Save size={18} />
                                <span>Save</span>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6 w-full">
                        {/* Overtime ID */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Overtime ID</label>
                            <input
                                type="text"
                                name="overtime_id"
                                value={formData.overtime_id}
                                readOnly
                                className="w-full border rounded-lg p-2.5 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Departemen */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Department</label>
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
                    </form>
                </div>
            </div>
        </>
    )
}
