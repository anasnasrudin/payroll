"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import Swal from "sweetalert2"
import { ChevronLeft, Save } from "lucide-react"

export default function EditMemberGASPage() {
  const router = useRouter()
  const params = useParams()
  const { member_id } = params

  const [formData, setFormData] = useState({
    member_id: "",
    nik: "",
    name: "",
    department: "",
    section: "",
    position: "",
    phone_number: ""
  })

  // Ambil data member by ID
  useEffect(() => {
    if (!member_id) return

    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/member/${member_id}`)
        const data = await res.json()

        if (!data.success) throw new Error(data.message)

        const member = data.data
        setFormData({
          member_id: member.member_id || "",
          nik: member.nik || "",
          name: member.name || "",
          department: member.department || "",
          section: member.section || "",
          position: member.position || "",
          phone_number: member.phone_number || ""
        })
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal ambil data member!",
          text: err.message,
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 2000,
          background: "#fee2e2",
          color: "#b91c1c",
          width: "380px",
          customClass: { popup: "rounded-xl py-1 text-sm" },
        })
        router.push("/pages/member-gas")
      }
    }

    fetchMember()
  }, [member_id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Update member
  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/member/${member_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      Swal.fire({
        icon: "success",
        title: "Data berhasil diupdate!",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        background: "#dcfce7",
        color: "#15803d",
        width: "380px",
        customClass: { popup: "rounded-xl py-1 text-sm" },
      })

      router.push("/pages/member-gas")
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal update!",
        text: err.message,
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        background: "#fee2e2",
        color: "#b91c1c",
        width: "380px",
        customClass: { popup: "rounded-xl py-1 text-sm" },
      })
    }
  }

  return (
    <>
      <Sidebar />
      <div className="ml-72 min-h-screen flex items-center justify-center bg-gray-100 py-12 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl px-8 py-8 flex flex-col min-h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 mt-8">
            <h1 className="text-3xl font-bold text-gray-800">Edit Member</h1>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <Save size={18} />
                <span>Update</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="mt-6 w-full">
            {/* Member ID di atas sendiri */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Member ID</label>
              <input
                type="text"
                name="member_id"
                value={formData.member_id}
                readOnly
                className="rounded-lg p-2.5 bg-gray-100 text-gray-600 select-none cursor-not-allowed w-[14ch]"
              />
            </div>

            {/* 6 input dibagi jadi 2 baris × 3 kolom */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
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

              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Departemen</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter your department"
                  required
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
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

              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Enter your position"
                  required
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
