"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: "", type: "" })
  const [showToast, setShowToast] = useState(false)

  // ✅ Reset field + hapus data user setiap kali halaman login aktif
  useEffect(() => {
    // langsung reset semua data pas render pertama
    localStorage.removeItem("user")
    localStorage.removeItem("welcomeMsg")
    setUsername("")
    setPassword("")

    // tambahan: pastikan gak auto-fill dari browser
    const inputs = document.querySelectorAll("input")
    inputs.forEach((input) => (input.value = ""))

    // reset lagi tiap kali tab di-focus (misal abis logout)
    const resetOnFocus = () => {
      localStorage.removeItem("user")
      localStorage.removeItem("welcomeMsg")
      setUsername("")
      setPassword("")
      const inputs = document.querySelectorAll("input")
      inputs.forEach((input) => (input.value = ""))
    }

    window.addEventListener("focus", resetOnFocus)
    return () => window.removeEventListener("focus", resetOnFocus)
  }, [])

  const showAlert = (message, type = "success") => {
    setToast({ message, type })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      showAlert("⚠️ Username dan password wajib diisi!", "error")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      setLoading(false)

      if (data.success) {
        const user = data.user
        const welcomeMsg = `Selamat datang ${user.username} (${user.role} - ${user.department || "No Dept"})`
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("welcomeMsg", welcomeMsg)
        showAlert("✅ Login berhasil!", "success")

        // ✅ Redirect sesuai role tanpa dashboard
        let targetPath = "/pages/overtime"
        if (user.role === "Admin") targetPath = "/pages/overtime"
        else if (user.role === "HEAD") targetPath = "/pages/approval"
        else if (user.role === "HR") targetPath = "/pages/member-gas"
        else if (user.role === "GM") targetPath = "/pages/approval"
        else if (user.role === "Superuser") targetPath = "/pages/overtime"

        setTimeout(() => router.replace(targetPath), 800)
      } else {
        showAlert(`❌ ${data.message}`, "error")
      }
    } catch (error) {
      setLoading(false)
      console.error("❌ Error:", error)
      showAlert("Terjadi kesalahan server!", "error")
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#f3f8fe]">
      {showToast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-40">
          <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-xl shadow-lg">
            <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-[#066dca]" />
            <p className="text-gray-700 font-medium">Sedang login...</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm relative flex flex-col items-center">
        <img src="/assets/logogas.jpeg" alt="Logo" className="w-70 h-32 mb-4" />

        <form onSubmit={handleLogin} className="space-y-4 w-full" autoComplete="off">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#066dca] outline-none"
            autoComplete="new-username"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-[#066dca] outline-none"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-[#066dca] text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
