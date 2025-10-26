import { NextResponse } from "next/server"
import pool from "@/lib/db"

function generateApprovalID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let id = ""
  for (let i = 0; i < 9; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// GET Approval
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role") // HEAD / HR / GM

    let query = "SELECT * FROM tb_approval"
    const params = []

    if (role) {
      query += " WHERE LOWER(role) = LOWER($1)"
      params.push(role)
    }

    query += " ORDER BY created_at DESC"

    const result = await pool.query(query, params)
    return NextResponse.json({ success: true, data: result.rows || [] })
  } catch (error) {
    console.error("❌ Error GET approval:", error)
    return NextResponse.json({ success: false, message: "Gagal mengambil data approval" })
  }
}

// POST Approval
export async function POST(req) {
  try {
    const body = await req.json()
    const { overtime_id, role, status, remark } = body

    if (!overtime_id || !role) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap (role/overtime_id)!" })
    }

    // cek existing
    const existing = await pool.query(
      `SELECT * FROM tb_approval WHERE overtime_id = $1 AND LOWER(role) = LOWER($2)`,
      [overtime_id, role]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, message: `Overtime ini sudah di-approve oleh role ${role}!` })
    }

    const approval_id = generateApprovalID()

    await pool.query(
      `INSERT INTO tb_approval (approval_id, overtime_id, role, status, remark)
       VALUES ($1, $2, $3, $4, $5)`,
      [approval_id, overtime_id, role, status || "waiting", remark || null]
    )

    // Update status overtime
    const check = await pool.query(`SELECT role, status FROM tb_approval WHERE overtime_id = $1`, [overtime_id])
    let newStatus = "waiting"

    // rejected duluan kalau ada
    if (check.rows.some((r) => r.status === "rejected")) {
      newStatus = "rejected"
    }
    // GM approve langsung approved
    else if (check.rows.some((r) => r.role.toLowerCase() === "gm" && r.status === "approved")) {
      newStatus = "approved"
    }
    // kalau semua role (head, hr, gm) approve
    else if (["head", "hr", "gm"].every((r) =>
      check.rows.some((row) => row.role.toLowerCase() === r && row.status === "approved")
    )) {
      newStatus = "approved"
    }

    await pool.query(`UPDATE tb_overtime SET status = $1 WHERE overtime_id = $2`, [newStatus, overtime_id])

    return NextResponse.json({ success: true, message: "Approval berhasil diproses!" })
  } catch (error) {
    console.error("❌ Error POST approval:", error)
    return NextResponse.json({ success: false, message: "Gagal memproses approval" })
  }
}
