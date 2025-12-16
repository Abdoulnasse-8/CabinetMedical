"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "@/types"
import { api } from "@/lib/api"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  hasRole: (roles: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    try {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedUser) {
        try {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        } catch (parseError) {
          console.error("Error parsing stored user:", parseError)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await api.login(username, password)

      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))

      setToken(response.token)
      setUser(response.user)

      // Redirect based on role
      switch (response.user.role) {
        case "ADMINISTRATEUR":
          router.push("/admin/dashboard")
          break
        case "MEDECIN":
          router.push("/medecin/dashboard")
          break
        case "SECRETAIRE":
          router.push("/secretaire/dashboard")
          break
        default:
          router.push("/login")
      }
    },
    [router],
  )

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    router.push("/login")
  }, [router])

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]) => {
      if (!user) return false
      const roleArray = Array.isArray(roles) ? roles : [roles]
      return roleArray.includes(user.role)
    },
    [user],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
