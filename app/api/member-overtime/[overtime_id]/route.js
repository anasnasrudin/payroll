import { NextResponse } from "next/server"
import pool from "@/lib/db"

// GET member_overtime by overtime_id
export async function GET(req, { params }) {
  try {
    const { overtime_id } = params
    const result = await pool.query(
      "SELECT * FROM tb_member_overtime WHERE overtime_id = $1 ORDER BY name ASC",
      [overtime_id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Belum ada member untuk overtime ini",
        data: [],
      })
    }

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("❌ Error fetching member_overtime:", error)
    return NextResponse.json({ success: false, message: "Gagal ambil data member overtime" })
  }
}

// PATCH update member_overtime by overtime_id
export async function PATCH(req, { params }) {
  try {
    const { overtime_id } = params
    const body = await req.json()

    // body diharapkan berisi array of member overtime
    // misal: [{ member_overtime_id, nik, name, start, finish }]
    if (!Array.isArray(body)) {
      return NextResponse.json({ success: false, message: "Format data tidak valid" })
    }

    // Loop update tiap member
    for (const member of body) {
      const { member_overtime_id, nik, name, start, finish } = member
      await pool.query(
        `UPDATE tb_member_overtime
         SET nik=$1, name=$2, start=$3, finish=$4
         WHERE member_overtime_id=$5 AND overtime_id=$6`,
        [nik, name, start, finish, member_overtime_id, overtime_id]
      )
    }

    return NextResponse.json({
      success: true,
      message: "Data member overtime berhasil diupdate",
    })
  } catch (error) {
    console.error("❌ Error updating member_overtime:", error)
    return NextResponse.json({ success: false, message: "Gagal update data member overtime" })
  }
}

// DELETE all member_overtime by overtime_id
export async function DELETE(req, { params }) {
  try {
    const { overtime_id } = params
    await pool.query("DELETE FROM tb_member_overtime WHERE overtime_id = $1", [overtime_id])

    return NextResponse.json({
      success: true,
      message: "Semua data member overtime berhasil dihapus",
    })
  } catch (error) {
    console.error("❌ Error deleting member_overtime:", error)
    return NextResponse.json({ success: false, message: "Gagal hapus data member overtime" })
  }
}
