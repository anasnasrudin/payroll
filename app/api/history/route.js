import { NextResponse } from "next/server"
import pool from "@/lib/db"

// POST tetap untuk insert/update
export async function POST(req) {
  try {
    const body = await req.json()
    const { overtime_id, date, departemen, role, approval, note } = body

    if (!overtime_id || !date || !departemen) {
      return NextResponse.json({ success: false, message: "Data history tidak lengkap!" })
    }

    // Cek apakah overtime_id sudah ada
    const check = await pool.query(
      `SELECT history_id FROM tb_history WHERE overtime_id = $1`,
      [overtime_id]
    )

    let result
    if (check.rowCount > 0) {
      // Update history dasar (date & depart)
      result = await pool.query(
        `UPDATE tb_history
         SET date = $1, depart = $2
         WHERE overtime_id = $3
         RETURNING *`,
        [date, departemen, overtime_id]
      )

      // Jika ada role → update approval/note sesuai role
      if (role && ["HEAD", "HR", "GM"].includes(role.toUpperCase())) {
        const roleMap = {
          HEAD: ["approval_head", "note_head"],
          HR: ["approval_hr", "note_hr"],
          GM: ["approval_gm", "note_gm"]
        }
        const columns = roleMap[role.toUpperCase()]

        await pool.query(
          `UPDATE tb_history
           SET ${columns[0]} = $1, ${columns[1]} = $2
           WHERE overtime_id = $3`,
          [approval || null, note || null, overtime_id]
        )
      }

    } else {
      // Insert baru
      result = await pool.query(
        `INSERT INTO tb_history (overtime_id, date, depart${role ? `, ${role.toLowerCase()}_approval, note_${role.toLowerCase()}` : ""})
         VALUES ($1, $2, $3${role ? `, $4, $5` : ""})
         RETURNING *`,
        role
          ? [overtime_id, date, departemen, approval || null, note || null]
          : [overtime_id, date, departemen]
      )
    }

    return NextResponse.json({ success: true, message: "History berhasil disimpan!", data: result.rows })
  } catch (error) {
    console.error("❌ Error saving history:", error)
    return NextResponse.json({ success: false, message: "Gagal menyimpan history" })
  }
}

// GET untuk ambil semua history atau filter overtime_id
export async function GET(req) {
  try {
    const overtime_id = req.nextUrl.searchParams.get("overtime_id")

    let result
    if (overtime_id) {
      // Ambil history berdasarkan overtime_id tertentu
      result = await pool.query(
        `SELECT * FROM tb_history WHERE overtime_id = $1 ORDER BY history_id ASC`,
        [overtime_id]
      )
    } else {
      // Ambil semua history
      result = await pool.query(
        `SELECT * FROM tb_history ORDER BY history_id ASC`
      )
    }

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("❌ Error fetching history:", error)
    return NextResponse.json({ success: false, message: "Gagal ambil data history" })
  }
}
