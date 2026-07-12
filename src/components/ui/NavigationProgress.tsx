"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationProgress() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setLoading(false)
  }, [pathname, searchParams])

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-blue-200">
          <div className="h-full bg-blue-600 animate-pulse w-3/4" />
        </div>
      )}
    </>
  )
}