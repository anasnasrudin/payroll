import { NextResponse } from "next/server"
import pool from "@/lib/db"

// GET Overtime
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const role = (searchParams.get("role") || "").toLowerCase() // HEAD / HR / GM / ADMIN

    let query = "SELECT * FROM tb_overtime"
    const params = []

    if (role && role !== "admin") {
      query += `
        WHERE NOT EXISTS (
          SELECT 1 FROM tb_approval a
          WHERE a.overtime_id = tb_overtime.overtime_id
            AND LOWER(a.role) = $1
            AND a.status = 'approved'
        )
        AND (
          $1 = 'head'
          OR ($1 = 'hr' AND EXISTS (
            SELECT 1 FROM tb_approval a
            WHERE a.overtime_id = tb_overtime.overtime_id
              AND LOWER(a.role) = 'head'
              AND a.status = 'approved'
          ))
          OR ($1 = 'gm' AND EXISTS (
            SELECT 1 FROM tb_approval a
            WHERE a.overtime_id = tb_overtime.overtime_id
              AND LOWER(a.role) = 'head'
              AND a.status = 'approved'
          ) AND EXISTS (
            SELECT 1 FROM tb_approval a2
            WHERE a2.overtime_id = tb_overtime.overtime_id
              AND LOWER(a2.role) = 'hr'
              AND a2.status = 'approved'
          ))
        )
      `
      params.push(role)
    }

    query += " ORDER BY date DESC"

    const result = await pool.query(query, params)
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("❌ Error fetching overtime:", error)
    return NextResponse.json({ success: false, message: "Gagal ambil data overtime" })
  }
}

// POST Overtime
export async function POST(req) {
  try {
    const body = await req.json()
    const { overtime_id, departemen, date, members } = body

    if (!overtime_id || !departemen || !date) {
      return NextResponse.json({ success: false, message: "Data overtime tidak lengkap!" })
    }

    // Insert/update tb_overtime
    await pool.query(
      `INSERT INTO tb_overtime (overtime_id, department, date, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (overtime_id) DO UPDATE
       SET department = EXCLUDED.department, date = EXCLUDED.date, status = EXCLUDED.status`,
      [overtime_id, departemen, date, "waiting"]
    )

    // Insert/update tb_member_overtime
    if (Array.isArray(members) && members.length > 0) {
      for (const m of members) {
        const { row_id, nik, member_name, start, finish } = m
        await pool.query(
          `INSERT INTO tb_member_overtime (member_overtime_id, overtime_id, nik, name, start_time, end_time)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (member_overtime_id) DO UPDATE
           SET nik = EXCLUDED.nik, name = EXCLUDED.name, start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time`,
          [row_id, overtime_id, nik, member_name, start, finish]
        )
      }
    }

    return NextResponse.json({ success: true, message: "Data overtime berhasil disimpan!" })
  } catch (error) {
    console.error("❌ Error inserting overtime:", error)
    return NextResponse.json({ success: false, message: "Gagal menyimpan data overtime" })
  }
}
