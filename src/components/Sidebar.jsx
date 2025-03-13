"use client"

import { useState, useEffect } from "react"
import { useNavigate, NavLink, useLocation } from "react-router-dom"
import supabase from "../supabaseClient"

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const role = sessionStorage.getItem("role")

  // Fetch user name on component mount
  useEffect(() => {
    const fetchUserName = async () => {
      const email = sessionStorage.getItem("email")
      if (email) {
        try {
          const { data, error } = await supabase.from("users").select("name").eq("email", email).single()

          if (data && !error) {
            setUserName(data.name || "User")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
    }

    fetchUserName()
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      sessionStorage.removeItem("role")
      sessionStorage.removeItem("email")
      navigate("/")
    } catch (error) {
      console.error("Error during logout:", error.message)
      alert("Error during logout. Please try again.")
    } finally {
      setIsLoading(false)
      closeModal()
    }
  }

  const openModal = () => {
    document.getElementById("logout_modal").showModal()
  }

  const closeModal = () => {
    document.getElementById("logout_modal").close()
  }

  // Navigation items
  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      roles: ["ADMIN", "GUARD", "HEADSECURITY"],
    },
    {
      path: "/visitors",
      name: "Visitors",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      roles: ["ADMIN", "GUARD", "HEADSECURITY"],
    },
    {
      path: "/events",
      name: "Events",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      roles: ["ADMIN", "HEADSECURITY"],
    },
    {
      path: "/archives",
      name: "Archives",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
      roles: ["ADMIN", "GUARD", "HEADSECURITY"],
    },
    {
      path: "/ablocklist",
      name: "Blocklist",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      ),
      roles: ["ADMIN", "GUARD", "HEADSECURITY"],
    },
  ]

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-green-800 to-green-700 text-white p-4 flex justify-between items-center lg:hidden shadow-md">
        <div className="flex items-center space-x-3">
          <img src="./images/csu.png" alt="CSU Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-md font-bold">CSU Visitor Management</h1>
        </div>
        <button
          className="p-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-green-800 to-green-700 text-white w-64 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 shadow-xl`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-green-600">
          <div className="flex flex-col items-center">
            <img src="./images/csu.png" alt="CSU Logo" className="w-20 h-20 object-contain mb-3" />
            <h1 className="text-lg font-bold text-center">Visitor Management System</h1>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-green-600">
          <div className="flex items-center space-x-3">
            <div className="avatar placeholder">
              <div className="bg-green-600 text-white rounded-full w-10">
                <span className="text-xl">{userName.charAt(0)}</span>
              </div>
            </div>
            <div>
              <p className="font-medium">{userName || "User"}</p>
              <p className="text-xs text-green-100">{role || "Role"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              // Only show menu items for the user's role
              if (!item.roles.includes(role)) return null

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-md transition-colors ${
                        isActive ? "bg-green-600 text-white font-medium" : "text-green-100 hover:bg-green-600/50"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>

                    {/* Active indicator */}
                    {location.pathname === item.path && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-green-600">
          <button
            onClick={openModal}
            className="flex items-center space-x-3 p-3 w-full rounded-md text-green-100 hover:bg-green-600/50 transition-colors"
            aria-label="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay to close sidebar on mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* Logout Confirmation Modal */}
      <dialog id="logout_modal" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-xl text-gray-800 mb-2">Confirm Logout</h3>
          <p className="py-2 text-gray-600">Are you sure you want to log out of the system?</p>
          <div className="modal-action">
            <button onClick={closeModal} className="btn btn-outline">
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="btn bg-red-500 hover:bg-red-600 text-white border-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </>
  )
}

export default Sidebar

