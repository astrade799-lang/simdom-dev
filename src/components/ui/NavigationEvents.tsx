"use client"

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function NavigationEventsInner({ onStart }: { onStart: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    onStart()
  }, [pathname, searchParams])

  return null
}

export function NavigationEvents({ onStart }: { onStart: () => void }) {
  return (
    <Suspense>
      <NavigationEventsInner onStart={onStart} />
    </Suspense>
  )
}