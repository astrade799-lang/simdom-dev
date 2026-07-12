"use client"

import { useEffect, useState, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function Inner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setVisible(true)
    setWidth(30)
    const t1 = setTimeout(() => setWidth(70), 100)
    const t2 = setTimeout(() => setWidth(90), 400)
    const t3 = setTimeout(() => {
      setWidth(100)
      setTimeout(() => setVisible(false), 200)
    }, 600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [pathname, searchParams])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 z-50 h-0.5 bg-blue-600 transition-all duration-300 ease-out"
      style={{ width: `${width}%` }}
    />
  )
}

export function TopLoader() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  )
}