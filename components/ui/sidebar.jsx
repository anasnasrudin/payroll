"use client"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers, faClock, faClipboardCheck, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { X } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutCard, setShowLogoutCard] = useState(false)
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")
  const [department, setDepartment] = useState("")
  const [welcomeMsg, setWelcomeMsg] = useState("")
  const [showWelcome, setShowWelcome] = useState(false)

  // Ref untuk abort controller global
  const abortControllers = useRef([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const msg = localStorage.getItem("welcomeMsg")

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      const userRole = (parsedUser.role || "").toUpperCase()

      setUsername(parsedUser.username)
      setRole(userRole)
      setDepartment(parsedUser.department || "-")

      if (msg) {
        setWelcomeMsg(msg)
        setShowWelcome(true)
        setTimeout(() => {
          setShowWelcome(false)
          localStorage.removeItem("welcomeMsg")
        }, 2000)
      }
    } else {
      router.replace("/pages/login")
    }
  }, [router])

  const allMenuItems = [
    { href: "/pages/member-gas", icon: faUsers, label: "Member" },
    { href: "/pages/overtime", icon: faClock, label: "Overtime" },
    { href: "/pages/approval", icon: faClipboardCheck, label: "Approval" },
  ]

  const menuItems =
    role === "ADMIN"
      ? allMenuItems.filter((item) => item.label === "Overtime")
      : role === "HEAD"
        ? allMenuItems.filter((item) => ["Overtime", "Approval"].includes(item.label))
        : role === "HR"
          ? allMenuItems.filter((item) => ["Member", "Overtime", "Approval"].includes(item.label))
          : role === "GM"
            ? allMenuItems.filter((item) => ["Overtime", "Approval"].includes(item.label))
            : allMenuItems

  // Logout
  const handleLogoutClick = () => setShowLogoutCard(true)
  const confirmLogout = () => {
    // abort semua fetch yang masih berjalan
    abortControllers.current.forEach(controller => controller.abort())
    abortControllers.current = []

    // clear storage
    localStorage.clear()
    sessionStorage.clear()
    setShowLogoutCard(false)
    router.replace("/pages/login")
  }
  const cancelLogout = () => setShowLogoutCard(false)

  // Contoh fetch approval aman
  const fetchApprovals = async () => {
    const controller = new AbortController()
    abortControllers.current.push(controller)

    try {
      const res = await fetch(`/api/approval?role=${role}`, { signal: controller.signal })
      const data = await res.json()
      if (data.success) {
        console.log("Approval data:", data.data.length)
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Error fetch approval:", err)
    } finally {
      // hapus controller ini setelah selesai
      abortControllers.current = abortControllers.current.filter(c => c !== controller)
    }
  }

  useEffect(() => {
    if (role) fetchApprovals()
    return () => {
      // abort fetch kalau sidebar diunmount
      abortControllers.current.forEach(c => c.abort())
      abortControllers.current = []
    }
  }, [role])

  return (
    <>
      {showWelcome && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold bg-green-500 transition-all duration-500 animate-fadeIn">
          {welcomeMsg}
        </div>
      )}

      <div className="h-screen w-72 p-5 bg-white shadow-xl fixed top-0 left-0 flex flex-col">
        <div className="text-center py-4">
          <Image
            src="/assets/logogas.jpeg"
            alt="Logo PT GAS"
            width={180}
            height={84}
            className="mx-auto object-contain cursor-pointer"
            priority
          />
        </div>

        <span className="h-[1.5px] bg-[#dfe0e4] w-full block my-3"></span>

        <div className="text-center mt-1">
          <p className="text-gray-800 font-semibold text-lg">{username || "Guest"}</p>
          <p className="text-gray-500 text-sm">
            {role || ""} • {department || ""}
          </p>
        </div>

        <span className="h-[1.5px] bg-[#dfe0e4] w-full block my-3"></span>

        <div className="flex flex-col mt-2">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <li
                  key={index}
                  className={`group py-3 px-4 rounded-xl font-sora transition-all duration-300 text-base ${
                    isActive
                      ? "bg-[#066dca] text-white shadow-md"
                      : "text-neutral-600 hover:bg-[#066dca] hover:text-white"
                  }`}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`text-lg ${isActive ? "text-white" : "text-[#066dca] group-hover:text-white"}`}
                    />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 border-t border-gray-200 pt-3">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-600 font-medium rounded-xl transition-colors hover:bg-red-600 hover:text-white cursor-pointer"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {showLogoutCard && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative text-center">
            <button
              onClick={cancelLogout}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Logout Confirmation</h2>
            <p className="text-gray-600 mb-5">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="bg-[#066dca] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
