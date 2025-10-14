"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    // simulasi proses login
    setTimeout(() => {
      setLoading(false)
      router.push("/pages/dashboard")
    }, 1500) // delay 1.5 detik
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#f3f8fe]">
      {loading && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-40 animate-fadeIn">
          <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-xl shadow-lg">
            <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-[#066dca]" />
            <p className="text-gray-700 font-medium">Sedang login...</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm animate-fadeIn relative flex flex-col items-center">
        <img src="/assets/logogas.jpeg" alt="Logo" className="w-60 h-28 mb-4" />

        <form className="space-y-4 w-full" autoComplete="off">
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#066dca]"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#066dca]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-[#066dca] text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> logging in...
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
