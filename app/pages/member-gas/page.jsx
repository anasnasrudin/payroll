"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // ✅ tambahin ini
import Sidebar from "@/components/ui/sidebar" // pastiin path ini bener
import { ChevronLeft, ChevronRight, Pencil, Trash2, UserPlus, } from "lucide-react"

export default function MemberGASPage() {
  const router = useRouter()
  const [members, setMembers] = useState([
    { memgas_id: "MGAS001", nik: "EMP00000000000001", depart: "Produksi", section: "Cutting", nama: "Budi Santoso", no_hp: "08123456789" },
    { memgas_id: "MGAS002", nik: "EMP00000000000002", depart: "QC", section: "Inspection", nama: "Siti Aminah", no_hp: "08198765432" },
    { memgas_id: "MGAS003", nik: "EMP00000000000003", depart: "Warehouse", section: "Packing", nama: "Rian Firmansyah", no_hp: "085612345678" },
    { memgas_id: "MGAS004", nik: "EMP00000000000004", depart: "Maintenance", section: "Utility", nama: "Andi Setiawan", no_hp: "082345678912" },
    { memgas_id: "MGAS005", nik: "EMP00000000000005", depart: "Produksi", section: "Sewing", nama: "Nur Aisyah", no_hp: "085732198745" },
    { memgas_id: "MGAS006", nik: "EMP00000000000006", depart: "HRD", section: "Admin", nama: "Rizky Pratama", no_hp: "081223344556" },
    { memgas_id: "MGAS007", nik: "EMP00000000000007", depart: "Produksi", section: "Finishing", nama: "Dewi Lestari", no_hp: "085678912345" },
    { memgas_id: "MGAS008", nik: "EMP00000000000008", depart: "Warehouse", section: "Receiving", nama: "Agus Salim", no_hp: "081234876543" },
    { memgas_id: "MGAS009", nik: "EMP00000000000009", depart: "Maintenance", section: "Electrical", nama: "Fajar Nugrogo", no_hp: "087654321098" },
    { memgas_id: "MGAS010", nik: "EMP00000000000010", depart: "Produksi", section: "Cutting", nama: "Lina Marlina", no_hp: "081298765432" },
    ...Array.from({ length: 92 }, (_, i) => {
      const num = i + 11
      const padded = num.toString().padStart(3, "0")
      const nikPad = num.toString().padStart(17, "0") // EMP + 17 digit total
      const departments = ["Produksi", "QC", "Warehouse", "Maintenance", "HRD"]
      const sections = {
        Produksi: ["Cutting", "Sewing", "Finishing"],
        QC: ["Inspection", "Inline", "Final"],
        Warehouse: ["Packing", "Receiving"],
        Maintenance: ["Utility", "Electrical"],
        HRD: ["Admin", "Payroll"],
      }
      const depart = departments[i % departments.length]
      const sectionList = sections[depart]
      const section = sectionList[i % sectionList.length]
      return {
        memgas_id: `MGAS${padded}`,
        nik: `EMP${nikPad}`,
        depart,
        section,
        nama: `Karyawan ${padded}`,
        no_hp: `08${Math.floor(1000000000 + Math.random() * 8999999999)}`,
      }
    }),
  ].flat())

  const [form, setForm] = useState({ nik: "", depart: "", section: "", nama: "", no_hp: "" })
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [slideDirection, setSlideDirection] = useState("right")
  const [isSliding, setIsSliding] = useState(false)

  // jumlah baris yang selalu ditampilkan per halaman
  const rowsPerPage = 7

  // reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = () => {
    router.push("/pages/member-gas/create")
  }

  const filteredMembers = members.filter(
    (m) =>
      m.nik.toLowerCase().includes(search.toLowerCase()) ||
      m.nama.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / rowsPerPage))
  const indexOfLast = currentPage * rowsPerPage
  const indexOfFirst = indexOfLast - rowsPerPage
  const currentRows = filteredMembers.slice(indexOfFirst, indexOfLast)

  const handlePageChange = (newPage) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return
    setSlideDirection(newPage > currentPage ? "right" : "left")
    setIsSliding(true)
    setTimeout(() => {
      setCurrentPage(newPage)
      setIsSliding(false)
    }, 180)
  }

  // buat array panjang rowsPerPage: kalau data kurang, sisanya null => render empty rows
  const displayedRows = [
    ...currentRows,
    ...Array.from({ length: Math.max(0, rowsPerPage - currentRows.length) }).map(() => null),
  ]

  return (
    <>
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Konten utama — berikan margin-left sama dengan lebar sidebar (w-72) */}
      <div className="ml-72 min-h-screen bg-gray-100 p-8 flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Member Data</h1>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Searh NIK or Nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-80"
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg shadow-sm border border-blue-700 hover:bg-[#066dca] hover:text-white hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <UserPlus size={20} />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Table wrapper */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <tr>
                <th className="p-2 border text-center text-base">ID</th>
                <th className="p-2 border text-center text-base">NIK</th>
                <th className="p-2 border text-center text-base">Departmentn</th>
                <th className="p-2 border text-center text-base">Sections</th>
                <th className="p-2 border text-center text-base">Name</th>
                <th className="p-2 border text-center text-base">Phone Number</th>
                <th className="p-2 border text-center text-base w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((row, idx) =>
                row ? (
                  <tr
                    key={row.memgas_id}
                    className="border-b border-gray-100 hover:bg-blue-50 hover:shadow-sm transition-transform duration-150 transform-gpu hover:scale-[1.01]"
                  >
                    <td className="p-2.5 border text-center text-base align-middle truncate">{row.memgas_id}</td>
                    <td className="p-2.5 border text-center text-base align-middle truncate">{row.nik}</td>
                    <td className="p-2.5 border text-center text-base align-middle truncate">{row.depart}</td>
                    <td className="p-2.5 border text-center text-base align-middle truncate">{row.section}</td>
                    <td className="p-2.5 border text-center text-base align-middle truncate">{row.nama}</td>
                    <td className="p-2.5 border text-center text-base align-middle truncate">{row.no_hp}</td>
                    <td className="p-2.5 border text-center text-base align-middle">
                      <div className="flex justify-center gap-3">
                        <div className="relative group">
                          <button className="w-9 h-9 flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-white rounded-md transition duration-150 cursor-pointer shadow-md hover:scale-105">
                            <Pencil size={16} />
                          </button>
                          <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 whitespace-nowrap shadow-lg">
                            Edit
                          </span>
                        </div>

                        <div className="relative group">
                          <button className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-150 cursor-pointer shadow-md hover:scale-105">
                            <Trash2 size={16} />
                          </button>
                          <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 whitespace-nowrap shadow-lg">
                            Delete
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={`empty-${idx}`}
                    className="h-14 border-b border-transparent"
                  >
                    <td colSpan="7" className="text-center text-gray-500 italic">
                      {displayedRows.filter(r => r).length === 0 && idx === Math.floor(displayedRows.length / 2)
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
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"
              }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {(() => {
              const pages = []
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i)
              } else if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages)
              } else if (currentPage >= totalPages - 3) {
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
              } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
              }

              return pages.map((page, i) =>
                page === "..." ? (
                  <span key={i} className="text-gray-400 text-sm px-1 select-none">...</span>
                ) : (
                  <div
                    key={i}
                    onClick={() => handlePageChange(page)}
                    className={`transition-all cursor-pointer flex items-center justify-center ${currentPage === page
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-8 h-5 rounded-full font-semibold text-xs"
                      : "bg-gray-300 hover:bg-gray-400 w-3 h-3 rounded-full"
                      }`}
                  >
                    {currentPage === page && page}
                  </div>
                )
              )
            })()}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 cursor-pointer"
              }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  )
}
