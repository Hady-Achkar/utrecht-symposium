"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Loader2, RefreshCw, Download, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoginForm from "@/components/LoginForm"

interface Registration {
  id: string
  name: string
  role: string
  contact: string
  comments: string
  language: string
  created_at: string
}

const roleLabels: Record<string, string> = {
  parent: "Parent / Ouder",
  policyMaker: "Policy Maker / Beleidsmaker",
  expert: "Expert",
  school: "School Staff / Vanuit school",
  other: "Other / Anders",
}

const languageFlags: Record<string, string> = {
  nl: "🇳🇱",
  en: "🇬🇧",
  ar: "🇸🇦",
  tr: "🇹🇷",
}

const VALID_USERNAME = "utrecht-journalists"
const VALID_PASSWORD = "Hubbies8"

export default function ResponsesPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState("")

  const fetchRegistrations = async () => {
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("symposium_registrations")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
    } catch (err) {
      console.error("Error fetching registrations:", err)
      setError("Failed to load registrations")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (username: string, password: string) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError("")
      sessionStorage.setItem("responses_auth", "true")
    } else {
      setLoginError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("responses_auth")
  }

  useEffect(() => {
    const isAuth = sessionStorage.getItem("responses_auth") === "true"
    setIsAuthenticated(isAuth)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    fetchRegistrations()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel("registrations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "symposium_registrations",
        },
        (payload) => {
          setRegistrations((current) => [payload.new as Registration, ...current])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [isAuthenticated])

  const exportToCSV = () => {
    const headers = ["Name", "Role", "Contact", "Comments", "Language", "Date"]
    const rows = registrations.map((r) => [
      r.name,
      roleLabels[r.role] || r.role,
      r.contact,
      r.comments || "",
      r.language.toUpperCase(),
      new Date(r.created_at).toLocaleString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}`).join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `symposium-registrations-${Date.now()}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />
  }

  if (loading && registrations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#fa2a2a]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Symposium Registrations
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Total registrations: {registrations.length}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchRegistrations}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                disabled={registrations.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg mb-4">
              {error}
            </div>
          )}

          {registrations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No registrations yet. They will appear here in real-time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">
                      Comments
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">
                      Language
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">
                        {registration.name}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {roleLabels[registration.role] || registration.role}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {registration.contact}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {registration.comments || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <span>{languageFlags[registration.language] || ""}</span>
                          <span>{registration.language.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {new Date(registration.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}