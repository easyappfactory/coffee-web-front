"use client"

import { useEffect, useState, useCallback } from "react"
import { ManagerSidebar } from "@/components/manage/layout/ManagerSidebar"

const COLLAPSE_BP = 1024

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  const handleResize = useCallback(() => {
    setCollapsed(window.innerWidth < COLLAPSE_BP)
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  return (
    <>
      <ManagerSidebar />
      <main
        className="min-h-screen bg-surface py-10 px-12 transition-[margin] duration-200"
        style={
          collapsed
            ? { marginLeft: 0, paddingTop: "72px" }
            : { marginLeft: "30%", width: "70%" }
        }
      >
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </>
  )
}
