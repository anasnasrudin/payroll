import { NextResponse } from "next/server"
import pool from "@/lib/db"

// GET
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM tb_member ORDER BY name ASC")
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("❌ Error fetching members:", error)
    return NextResponse.json({ success: false, message: "Gagal ambil data member" })
  }
}

// POST
export async function POST(req) {
  try {
    const body = await req.json()
    const { member_id, nik, name, department, section, position, phone_number } = body

    // validasi
    if (!member_id || !name || !department || !section || !position) {
      return NextResponse.json({
        success: false,
        message: "Member ID, Nama, Department, Section, dan Position wajib diisi!",
      })
    }

    await pool.query(
      `INSERT INTO tb_member (member_id, nik, name, department, section, position, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [member_id, nik, name, department, section, position, phone_number]
    )

    return NextResponse.json({
      success: true,
      message: "Data member berhasil ditambahkan!",
      data: { member_id, nik, name, department, section, position, phone_number },
    })
  } catch (error) {
    console.error("❌ Error inserting member:", error)
    return NextResponse.json({ success: false, message: "Gagal menambah data member" })
  }
}
