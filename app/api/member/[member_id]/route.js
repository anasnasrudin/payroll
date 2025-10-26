import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET member by ID
export async function GET(req, { params }) {
  try {
    const { member_id } = params;
    const result = await pool.query("SELECT * FROM tb_member WHERE member_id=$1", [member_id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Member tidak ditemukan" });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("❌ Error fetching member:", error);
    return NextResponse.json({ success: false, message: "Gagal ambil data member" });
  }
}

// PATCH update member
export async function PATCH(req, { params }) {
  try {
    const { member_id } = params;
    const body = await req.json();
    const { nik, name, department, section, position, phone_number } = body;

    await pool.query(
      `UPDATE tb_member
       SET nik=$1, name=$2, department=$3, section=$4, position=$5, phone_number=$6
       WHERE member_id=$7`,
      [nik, name, department, section, position, phone_number, member_id]
    );

    return NextResponse.json({ success: true, message: "Data member berhasil diupdate" });
  } catch (error) {
    console.error("❌ Error updating member:", error);
    return NextResponse.json({ success: false, message: "Gagal update data member" });
  }
}

// DELETE member
export async function DELETE(req, { params }) {
  try {
    const { member_id } = params;
    await pool.query("DELETE FROM tb_member WHERE member_id=$1", [member_id]);

    return NextResponse.json({ success: true, message: "Data member berhasil dihapus" });
  } catch (error) {
    console.error("❌ Error deleting member:", error);
    return NextResponse.json({ success: false, message: "Gagal hapus data member" });
  }
}
