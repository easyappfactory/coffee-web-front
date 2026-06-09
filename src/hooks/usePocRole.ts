"use client"

import { useEffect, useState } from "react"
import { POC_USERS } from "@/lib/api"

type PocRole = "USER" | "MANAGER" | "ADMIN" | "SYSTEM_MANAGER" | null

const userIdToRole = Object.fromEntries(
  Object.entries(POC_USERS).map(([role, id]) => [id, role]),
) as Record<string, PocRole>

export function usePocRole() {
  const [role, setRole] = useState<PocRole>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem("pocUserId") ?? POC_USERS.USER
    setUserId(id)
    setRole(userIdToRole[id] ?? null)
  }, [])

  return {
    role,
    userId,
    isManager: role === "MANAGER",
    isAdmin: role === "ADMIN",
  }
}
