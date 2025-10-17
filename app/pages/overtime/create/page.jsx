"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import { ChevronLeft, Save, Users, X } from "lucide-react"

export default function CreateOvertimePage() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        timestamp: "",
        id: "",
        departement: "PPC",
        date: "",
        time_rest: "00:00:00",
    })

    const [showMemberForm, setShowMemberForm] = useState(false)
    const [memberData, setMemberData] = useState({
        timestamp: "",
        overtime_id: "",
        nama: "",
        start: "",
        end: "",
        note: "",
        time_rest: "00:00:00",
        overtime_output: "00:00:00",
    })
    const [memberList, setMemberList] = useState([])

    const generateID = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
        let id = ""
        for (let i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
        return id
    }

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }

    const timeToSeconds = (time) => {
        const [h, m, s] = time.split(":").map(Number)
        return (h || 0) * 3600 + (m || 0) * 60 + (s || 0)
    }

    useEffect(() => {
        if (memberData.start && memberData.end) {
            const startTime = new Date(memberData.start)
            const endTime = new Date(memberData.end)
            let diffSec = Math.max((endTime - startTime) / 1000, 0)

            const restSec = timeToSeconds(memberData.time_rest || formData.time_rest || "00:00:00")
            diffSec = Math.max(diffSec - restSec, 0)

            setMemberData((prev) => ({
                ...prev,
                overtime_output: formatTime(Math.floor(diffSec)),
            }))
        } else {
            setMemberData((prev) => ({ ...prev, overtime_output: "00:00:00" }))
        }
    }, [memberData.start, memberData.end, memberData.time_rest, formData.time_rest])

    useEffect(() => {
        const now = new Date()
        const formatted = now.toISOString().slice(0, 19)
        const id = generateID()
        setFormData({
            timestamp: formatted,
            id,
            departement: "PPC",
            date: now.toISOString().split("T")[0],
            time_rest: "00:00:00",
        })
        setMemberData((prev) => ({
            ...prev,
            overtime_id: id,
            timestamp: formatted,
        }))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleMemberChange = (e) => {
        const { name, value } = e.target
        setMemberData({ ...memberData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("data overtime:", formData)
        console.log("member list:", memberList)
        alert("data overtime berhasil dibuat!")
    }

    const handleMemberSubmit = (e) => {
        e.preventDefault()
        setMemberList((prev) => [...prev, memberData])
        setShowMemberForm(false)
        const now = new Date().toISOString().slice(0, 19)
        setMemberData({
            timestamp: now,
            overtime_id: formData.id,
            nama: "",
            start: "",
            end: "",
            note: "",
            time_rest: "00:00:00",
            overtime_output: "00:00:00",
        })
    }

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen flex items-center justify-center bg-gray-100 py-12 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl px-8 py-10 relative">
                    {/* header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">create overtime</h1>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-blue-700 hover:text-white transition-all"
                            >
                                <ChevronLeft size={18} />
                                back
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-blue-800 transition-all"
                            >
                                <Save size={18} />
                                save
                            </button>
                        </div>
                    </div>

                    {/* form utama */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium mb-1">timestamps</label>
                            <input
                                type="datetime-local"
                                name="timestamp"
                                value={formData.timestamp}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2.5 bg-gray-50"
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <label className="block text-sm font-medium mb-1">id *</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    readOnly
                                    className="w-full border rounded-lg p-2.5 bg-gray-100 text-gray-600"
                                />
                            </div>

                            <div className="col-span-6 flex items-end">
                                <div className="ml-auto text-sm">
                                    <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                                        id overtime: {formData.id}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">departement</label>
                            <input
                                type="text"
                                name="departement"
                                value={formData.departement}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">time rest</label>
                            <input
                                type="time"
                                step="1"
                                name="time_rest"
                                value={formData.time_rest}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2.5"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => setShowMemberForm(true)}
                                className="w-full flex items-center justify-center gap-2 bg-gray-100 border text-blue-700 border-blue-700 font-medium py-2.5 rounded-lg hover:bg-blue-700 hover:text-white transition-all"
                            >
                                <Users size={18} />
                                input member
                            </button>
                        </div>
                    </form>

                    {/* tabel member sementara */}
                    {memberList.length > 0 && (
                        <div className="mt-8 border-t pt-4">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">member list</h3>

                            {/* scrollable container */}
                            <div className="overflow-x-auto rounded-lg border">
                                <table className="min-w-[1000px] w-full text-sm border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border p-2">timestamps</th>
                                            <th className="border p-2">id</th>
                                            <th className="border p-2">id overtime</th>
                                            <th className="border p-2">nama</th>
                                            <th className="border p-2">nik</th>
                                            <th className="border p-2">start</th>
                                            <th className="border p-2">end</th>
                                            <th className="border p-2">time rest</th>
                                            <th className="border p-2">note</th>
                                            <th className="border p-2">overtime output</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {memberList.map((m, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="border p-2 whitespace-nowrap">{m.timestamp}</td>
                                                <td className="border p-2 whitespace-nowrap">{formData.id}</td>
                                                <td className="border p-2 whitespace-nowrap">{m.overtime_id}</td>
                                                <td className="border p-2 whitespace-nowrap">{m.nama}</td>
                                                <td className="border p-2 whitespace-nowrap">{m.nik}</td>
                                                <td className="border p-2 whitespace-nowrap">{m.start}</td>
                                                <td className="border p-2 whitespace-nowrap">{m.end}</td>
                                                <td className="border p-2 whitespace-nowrap">{m.time_rest}</td>
                                                <td className="border p-2 whitespace-nowrap">{m.note}</td>
                                                <td className="border p-2 whitespace-nowrap">{m.overtime_output}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* popup form member */}
                    {showMemberForm && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-end pr-[20%] z-50">
                            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative animate-fadeIn border border-gray-200">
                                <button
                                    onClick={() => setShowMemberForm(false)}
                                    className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
                                >
                                    <X size={22} />
                                </button>

                                <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
                                    input member
                                </h2>

                                <form onSubmit={handleMemberSubmit} className="flex flex-col gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">timestamp</label>
                                        <input
                                            type="datetime-local"
                                            name="timestamp"
                                            value={memberData.timestamp}
                                            readOnly
                                            className="w-full border rounded-lg p-2.5 bg-gray-100 text-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">overtime id</label>
                                        <input
                                            type="text"
                                            name="overtime_id"
                                            value={memberData.overtime_id}
                                            readOnly
                                            className="w-full border rounded-lg p-2.5 bg-gray-100 text-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">nama</label>
                                        <input
                                            type="text"
                                            name="nama"
                                            value={memberData.nama}
                                            onChange={handleMemberChange}
                                            required
                                            placeholder="masukan nama"
                                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                                        />
                                    </div>

                                    {/* kolom nik baru */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">nik</label>
                                        <input
                                            type="text"
                                            name="nik"
                                            value={memberData.nik || ""}
                                            onChange={handleMemberChange}
                                            required
                                            placeholder="masukan nik"
                                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">start</label>
                                            <input
                                                type="datetime-local"
                                                name="start"
                                                value={memberData.start}
                                                onChange={handleMemberChange}
                                                required
                                                className="w-full border rounded-lg p-2.5"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">end</label>
                                            <input
                                                type="datetime-local"
                                                name="end"
                                                value={memberData.end}
                                                onChange={handleMemberChange}
                                                required
                                                className="w-full border rounded-lg p-2.5"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">note</label>
                                        <input
                                            type="text"
                                            name="note"
                                            value={memberData.note}
                                            onChange={handleMemberChange}
                                            className="w-full border rounded-lg p-2.5"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">time rest</label>
                                            <input
                                                type="time"
                                                step="1"
                                                name="time_rest"
                                                value={memberData.time_rest}
                                                onChange={handleMemberChange}
                                                className="w-full border rounded-lg p-2.5"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">overtime output</label>
                                            <input
                                                type="text"
                                                name="overtime_output"
                                                value={memberData.overtime_output}
                                                readOnly
                                                className="w-full border rounded-lg p-2.5 bg-gray-100 text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowMemberForm(false)}
                                            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                                        >
                                            batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                                        >
                                            simpan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}
