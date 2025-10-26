import { NextResponse } from "next/server"
import pool from "@/lib/db"

// GET member overtime by overtime_id
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const overtime_id = searchParams.get("overtime_id") // ambil dari query param

    if (!overtime_id) {
      return NextResponse.json({ success: false, message: "overtime_id diperlukan!" })
    }

    const result = await pool.query(
      `SELECT * FROM tb_member_overtime WHERE overtime_id = $1 ORDER BY name ASC`,
      [overtime_id]
    )

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("❌ Error fetching member overtime:", error)
    return NextResponse.json({ success: false, message: "Gagal ambil data member overtime" })
  }
}

// POST add/update member overtime
export async function POST(req) {
  try {
    const body = await req.json()
    const { member_overtime_id, overtime_id, nik, name, start, finish } = body

    if (!overtime_id || !member_overtime_id) {
      return NextResponse.json({ success: false, message: "Data member tidak lengkap!" })
    }

    await pool.query(
      `INSERT INTO tb_member_overtime (member_overtime_id, overtime_id, nik, name, start, finish)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (member_overtime_id) DO UPDATE
       SET nik = EXCLUDED.nik,
           name = EXCLUDED.name,
           start = EXCLUDED.start,
           finish = EXCLUDED.finish`,
      [member_overtime_id, overtime_id, nik || null, name || null, start || null, finish || null]
    )

    return NextResponse.json({ success: true, message: "Member overtime berhasil disimpan!" })
  } catch (error) {
    console.error("❌ Error saving member overtime:", error)
    return NextResponse.json({ success: false, message: "Gagal menyimpan member overtime" })
  }
}
