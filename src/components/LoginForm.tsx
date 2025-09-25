"use client"

import { useState } from "react"
import { Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LoginFormProps {
  onLogin: (username: string, password: string) => void
  error?: string
}

export default function LoginForm({ onLogin, error }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white px-8 py-12 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Login Required</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your credentials to view registrations
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa2a2a] focus:border-[#fa2a2a]"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fa2a2a] focus:border-[#fa2a2a]"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#fa2a2a] hover:bg-[#e02424] text-white"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}