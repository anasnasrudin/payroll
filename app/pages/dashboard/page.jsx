"use client"

import React from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import { Clock, Users, CheckSquare, User } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export default function DashboardGAS() {
    const router = useRouter()

    const cards = [
        { title: "Overtime", icon: <Clock size={28} className="text-white" />, color: "bg-blue-500", route: "/pages/overtime", count: 102 },
        { title: "Detail Member", icon: <Users size={28} className="text-white" />, color: "bg-green-500", route: "/pages/dashboard", count: 28 },
        { title: "Approval", icon: <CheckSquare size={28} className="text-white" />, color: "bg-yellow-500", route: "/pages/approval", count: 42 },
        { title: "Member", icon: <User size={28} className="text-white" />, color: "bg-purple-500", route: "/pages/member-gas   ", count: 100 },
    ]

    const chartData = cards.map(card => ({ name: card.title, total: card.count }))

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="ml-72 p-8 flex-1 bg-gray-100 flex flex-col gap-6 animate-fadeIn">
                <h1 className="text-3xl font-bold mb-1">Dashboard GAS</h1>

                {/* Cards kecil */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                    {cards.map((card, idx) => (
                        <div
                            key={idx}
                            onClick={() => router.push(card.route)}
                            className={`cursor-pointer p-4 rounded-xl shadow-md flex flex-col items-start gap-2 hover:scale-105 transition transform ${card.color}`}
                        >
                            <div>{card.icon}</div>
                            <h2 className="text-white text-lg font-semibold">{card.title}</h2>
                            <span className="text-white font-medium">{card.count}</span>
                        </div>
                    ))}
                </div>

                {/* Chart besar */}
                <div className="bg-white p-6 rounded-2xl shadow-md flex-1">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Ringkasan Data GAS</h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#4f46e5" radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
