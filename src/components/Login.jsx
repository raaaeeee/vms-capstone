"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../supabaseClient"

const Login = () => {
  // State management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  // Check if user is already logged in
  useEffect(() => {
    const role = sessionStorage.getItem("role")
    if (role) {
      if (role === "ADMIN" || role === "GUARD") {
        navigate("/dashboard")
      } else if (role === "HEADSECURITY") {
        navigate("/security")
      } else {
        navigate("/notifications")
      }
    }

    // Check for saved email in localStorage if remember me was checked
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }
  }, [navigate])

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      // Get user from database
      const { data, error } = await supabase.from("users").select("*").eq("email", formData.email).single()

      if (error) throw error

      // Validate credentials
      if (data && data.password === formData.password && data.email === formData.email) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email)
        } else {
          localStorage.removeItem("rememberedEmail")
        }

        // Set session and redirect based on role
        const role = data.role
        sessionStorage.setItem("role", role)

        // Show success message before redirecting
        setSuccessMessage("Login successful! Redirecting...")

        // Redirect after a short delay for better UX
        setTimeout(() => {
          if (role === "ADMIN" || role === "GUARD") {
            navigate("/dashboard")
          } else if (role === "HEADSECURITY") {
            navigate("/security")
          } else {
            navigate("/notifications")
          }
        }, 1000)
      } else {
        setErrorMessage("Invalid email or password. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error.message)
      setErrorMessage("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen font-sans flex items-center justify-center bg-cover bg-center relative py-10 px-4"
      style={{
        backgroundImage: "url('images/csu-bg.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-xl shadow-2xl overflow-hidden">
          {/* Logo and Header */}
          <div className="p-8 pb-0 flex flex-col items-center">
            <img src="./images/csu.png" alt="Caraga State University Logo" className="w-24 h-24 object-contain mb-4" />
            <h1 className="text-2xl font-bold text-center text-white mb-1">Welcome Back</h1>
            <p className="text-white/90 text-center mb-6">CSU Visitor Management System</p>
          </div>

          {/* Form */}
          <div className="p-8 pt-4">
            {/* Error message */}
            {errorMessage && (
              <div className="alert alert-error mb-6 text-sm bg-red-500/80 text-white border-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success message */}
            {successMessage && (
              <div className="alert alert-success mb-6 text-sm bg-green-500/80 text-white border-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-control w-full mb-4">
                <label className="label" htmlFor="email">
                  <span className="label-text font-medium text-white">Email Address</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@csu.edu.ph"
                  className="input input-bordered w-full bg-white/80 placeholder:text-gray-500"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label" htmlFor="password">
                  <span className="label-text font-medium text-white">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className="input input-bordered w-full bg-white/80 placeholder:text-gray-500"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm border-white/60"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span className="label-text ml-2 text-white">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn w-full bg-green-700 hover:bg-green-800 text-white border-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/80">
              <p>Need assistance? Contact the IT department</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white opacity-80">
          © {new Date().getFullYear()} Caraga State University. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default Login

