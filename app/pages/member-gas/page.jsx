"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import Swal from "sweetalert2"
import { ChevronLeft, ChevronRight, Pencil, Trash2, UserPlus } from "lucide-react"

export default function MemberGASPage() {
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 8

  // ✅ ambil data dari API member
  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/member")
      const data = await res.json()
      if (data.success) {
        const formatted = data.data.map((m) => ({
          member_id: m.member_id,
          nik: m.nik || "-",
          nama: m.name || "-",
          depart: m.department || "-",
          section: m.section || "-",
          posisi: m.position || "-",
          no_hp: m.phone_number || "-",
        }))
        setMembers(formatted)
      }
    } catch (err) {
      console.error("❌ Error fetch member:", err)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => setCurrentPage(1), [search])

  const handleAdd = () => router.push("/pages/member-gas/create")

  const filteredMembers = members.filter(
    (m) =>
      m.nik.toLowerCase().includes(search.toLowerCase()) ||
      m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.depart.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / rowsPerPage))
  const indexOfLast = currentPage * rowsPerPage
  const indexOfFirst = indexOfLast - rowsPerPage
  const currentRows = filteredMembers.slice(indexOfFirst, indexOfLast)

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return
    setCurrentPage(newPage)
  }

  const handleDelete = async (member_id) => {
    const result = await Swal.fire({
      title: "Hapus member?",
      text: "Data akan dihapus permanen.",
      icon: "warning",
      toast: true,
      position: "top",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      background: "#fff",
      timerProgressBar: true,
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/member/${member_id}`, { method: "DELETE" })
        const data = await res.json()

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Member dihapus!",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 1500,
          })
          fetchMembers()
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal hapus!",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 1500,
          })
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: err.message,
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 2000,
        })
      }
    }
  }

  const displayedRows = [
    ...currentRows,
    ...Array.from({ length: Math.max(0, rowsPerPage - currentRows.length) }).map(() => null),
  ]

  return (
    <>
      <Sidebar />
      <div className="ml-72 min-h-screen bg-gray-100 p-8 flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Member Data</h1>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search NIK, Name or Depart..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-80"
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white transition-all duration-300 cursor-pointer"
            >
              <UserPlus size={20} />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <tr>
                <th className="p-2 border text-center">ID</th>
                <th className="p-2 border text-center">NIK</th>
                <th className="p-2 border text-center">Name</th>
                <th className="p-2 border text-center">Department</th>
                <th className="p-2 border text-center">Section</th>
                <th className="p-2 border text-center">Position</th>
                <th className="p-2 border text-center">Phone Number</th>
                <th className="p-2 border text-center w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((row, idx) =>
                row ? (
                  <tr key={row.member_id} className="border-b hover:bg-blue-50">
                    <td className="p-1.5 border text-center truncate">{row.member_id}</td>
                    <td className="p-1.5 border text-center truncate">{row.nik}</td>
                    <td className="p-1.5 border text-center truncate">{row.nama}</td>
                    <td className="p-1.5 border text-center truncate">{row.depart}</td>
                    <td className="p-1.5 border text-center truncate">{row.section}</td>
                    <td className="p-1.5 border text-center truncate">{row.posisi}</td>
                    <td className="p-1.5 border text-center truncate">{row.no_hp}</td>
                    <td className="p-1.5 border text-center flex justify-center gap-2">
                      <button
                        onClick={() => router.push(`/pages/member-gas/${row.member_id}`)}
                        className="w-9 h-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition duration-150 cursor-pointer shadow-md hover:scale-105"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row.member_id)}
                        className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-150 cursor-pointer shadow-md hover:scale-105"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={`empty-${idx}`} className="h-[51px] border-b border-transparent">
                    <td colSpan="8" className="text-center text-gray-500 italic">
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
        <div className="mt-4 flex items-center gap-4 pl-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <div
              key={page}
              onClick={() => handlePageChange(page)}
              className={`cursor-pointer flex items-center justify-center ${currentPage === page ? "bg-blue-600 text-white w-8 h-5 rounded-full" : "bg-gray-300 w-3 h-3 rounded-full"
                }`}
            >
              {currentPage === page && page}
            </div>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  )
}
