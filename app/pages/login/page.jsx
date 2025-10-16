"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showToast, setShowToast] = useState(false);

  // ✅ Data user dummy JSON
  const users = [
    { username: "SUKAMDANI", password: "gaselectro7n", role: "GM", department: "-" },
    { username: "LENI", password: "gaselectrohri10", role: "HR", department: "HR" },
    { username: "MAKARIMA MH", password: "admppc0i1", role: "Admin", department: "PPC" },
    { username: "lutvi", password: "idnas1234561", role: "Superuser", department: "IT" },
    { username: "SITI HARDIANTI", password: "admwh0c7", role: "Admin", department: "WAREHOUSE" },
    { username: "LUVI NOPIANTI MTC", password: "admmtcz08", role: "Admin", department: "MAINTENANCE & IT" },
    { username: "LUVI NOPIANTI ENG", password: "admengx08", role: "Admin", department: "ENGINEERING" },
    { username: "RIDWAN", password: "mgrppc12", role: "Head", department: "PPC" },
    { username: "IRFAN", password: "mgrwh78", role: "Head", department: "WAREHOUSE" },
    { username: "SALMA SN", password: "admqc77", role: "Admin", department: "QC" },
    { username: "MASAN", password: "mgrqc08", role: "Head", department: "QC" },
    { username: "WAWAN", password: "spveng4z", role: "Head", department: "ENGINEERING" },
    { username: "DEDI", password: "spvmtc7o", role: "Head", department: "MAINTENANCE & IT" },
    { username: "NANDA", password: "gagahberani", role: "Admin", department: "GA & CS" },
    { username: "PUTRI", password: "putrijaya20", role: "Admin", department: "QA" },
    { username: "ARUM", password: "gasjaya0813", role: "Admin", department: "GA & CS" },
  ];

  // ✅ Fungsi buat munculin alert toast
  const showAlert = (message, type = "success") => {
    setToast({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ✅ Proses login
  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showAlert("⚠️ Username dan password wajib diisi!", "error");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = users.find(
        (u) => u.username === username.trim() && u.password === password
      );
      setLoading(false);

      if (user) {
        showAlert(`✅ Selamat datang ${user.username} (${user.role})`, "success");
        localStorage.setItem("user", JSON.stringify(user));

        // redirect sesuai role
        setTimeout(() => {
          if (user.role.toLowerCase() === "superuser") {
            router.push("/Dashboard");
          } else {
            router.push("/pages/dashboard");
          }
        }, 1000);
      } else {
        showAlert("❌ Username atau password salah!", "error");
      }
    }, 800);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#f3f8fe]">
      {/* ✅ Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* ✅ Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-40 animate-fadeIn">
          <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-xl shadow-lg">
            <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-[#066dca]" />
            <p className="text-gray-700 font-medium">Sedang login...</p>
          </div>
        </div>
      )}

      {/* ✅ Card Login */}
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm animate-fadeIn relative flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-6 p-2 border border-gray-200 rounded-lg bg-[#f3f8fe]">
          <img src="/assets/logogas.jpeg" alt="Logo" className="w-20 h-14" />
          <h1 className="text-2xl font-bold text-[#066dca]">LOGIN ACCOUNT</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 w-full" autoComplete="off">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#066dca]"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#066dca]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-[#066dca] text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer ${
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
  );
}