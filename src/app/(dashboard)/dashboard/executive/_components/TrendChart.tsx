"use client"

import { useEffect, useRef } from "react"

interface TrendData {
  tanggal: string
  online: number
  offline: number
}

interface Props {
  data: TrendData[]
}

export function TrendChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = { top: 20, right: 20, bottom: 40, left: 40 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Clear
    ctx.clearRect(0, 0, width, height)

    const maxVal = Math.max(...data.map(d => d.online + d.offline)) || 111
    const xStep = chartWidth / (data.length - 1 || 1)

    // Grid lines
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()

      // Y labels
      ctx.fillStyle = "#94a3b8"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(String(Math.round(maxVal - (maxVal / 4) * i)), padding.left - 6, y + 4)
    }

    // Online line
    ctx.beginPath()
    ctx.strokeStyle = "#22c55e"
    ctx.lineWidth = 2.5
    ctx.lineJoin = "round"
    data.forEach((d, i) => {
      const x = padding.left + xStep * i
      const y = padding.top + chartHeight - (d.online / maxVal) * chartHeight
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Offline line
    ctx.beginPath()
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2.5
    ctx.lineJoin = "round"
    data.forEach((d, i) => {
      const x = padding.left + xStep * i
      const y = padding.top + chartHeight - (d.offline / maxVal) * chartHeight
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Dots + X labels
    data.forEach((d, i) => {
      const x = padding.left + xStep * i

      // Online dot
      const yOnline = padding.top + chartHeight - (d.online / maxVal) * chartHeight
      ctx.beginPath()
      ctx.fillStyle = "#22c55e"
      ctx.arc(x, yOnline, 4, 0, Math.PI * 2)
      ctx.fill()

      // Offline dot
      const yOffline = padding.top + chartHeight - (d.offline / maxVal) * chartHeight
      ctx.beginPath()
      ctx.fillStyle = "#ef4444"
      ctx.arc(x, yOffline, 4, 0, Math.PI * 2)
      ctx.fill()

      // X label
      ctx.fillStyle = "#94a3b8"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      const label = d.tanggal.slice(5) // MM-DD
      ctx.fillText(label, x, height - 10)
    })

    // Legend
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(padding.left, height - 8, 12, 4)
    ctx.fillStyle = "#64748b"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Online", padding.left + 16, height - 4)

    ctx.fillStyle = "#ef4444"
    ctx.fillRect(padding.left + 70, height - 8, 12, 4)
    ctx.fillStyle = "#64748b"
    ctx.fillText("Offline", padding.left + 86, height - 4)

  }, [data])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
        Belum ada data tren — jalankan worker untuk mengumpulkan data
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={200}
      className="w-full"
    />
  )
}