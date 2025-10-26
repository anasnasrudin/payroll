import pool from "@/lib/db"

// ✅ Method POST buat handle login request
export async function POST(req) {
  try {
    // Ambil data dari body request
    const { username, password } = await req.json()

    // Cek kalau field kosong
    if (!username || !password) {
      return Response.json({ success: false, message: "Username dan password wajib diisi!" })
    }

    // Query ke PostgreSQL
    const result = await pool.query(
      "SELECT * FROM tb_akun WHERE username = $1 AND password = $2",
      [username, password]
    )

    // Cek hasil query
    if (result.rows.length === 0) {
      return Response.json({ success: false, message: "Username atau password salah!" })
    }

    const user = result.rows[0]

    // Kirim data user balik ke frontend
    return Response.json({
      success: true,
      user,
    })
  } catch (err) {
    console.error("❌ Error login:", err)
    return Response.json({ success: false, message: "Terjadi kesalahan pada server!" })
  }
}
