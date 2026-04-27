"use client"

import { useState, useEffect, useRef } from "react"
import type { Slot } from "@/types/slot"

const DURATION = 847

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, "0")}`
}

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`

interface SlotVideoPlayerProps {
  slot: Slot
  noSticky?: boolean
}

export function SlotVideoPlayer({ slot, noSticky }: SlotVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [time, setTime] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [muted, setMuted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const bg = slot.thumbnailColor ?? "#2d1f1a"
  const accent = slot.accentColor ?? "#c4824a"

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setTime((t) => {
          const next = t + 1
          if (next >= DURATION) {
            setPlaying(false)
            return 0
          }
          setProgress((next / DURATION) * 100)
          return next
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing])

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setProgress(pct * 100)
    setTime(Math.floor(pct * DURATION))
  }

  return (
    <div
      className={`${noSticky ? "" : "sticky top-[81px] z-20 "}aspect-[16/9] cursor-pointer overflow-hidden rounded-card`}
      style={{ background: bg, boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPlaying((p) => !p)}
    >
      {/* decorative circles */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        viewBox="0 0 600 340"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="480" cy="60" r="180" fill={accent} />
        <circle cx="80" cy="280" r="120" fill={accent} />
      </svg>

      {/* grain texture */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{ backgroundImage: GRAIN_SVG }}
      />

      {/* PLAYING badge */}
      {playing && (
        <div className="absolute left-3 top-3 flex items-center gap-[5px] rounded-pill bg-black/50 px-[10px] py-1">
          <div
            className="h-1.5 w-1.5 rounded-full bg-red-400"
            style={{ animation: "bm-pulse 1s ease infinite" }}
          />
          <span className="font-display text-[10px] font-bold tracking-[0.08em] text-white">
            PLAYING
          </span>
        </div>
      )}

      {/* category + series (top-left when not playing) */}
      {!playing && (
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <div className="rounded-pill bg-black/45 px-[10px] py-1 font-display text-[10px] font-bold tracking-[0.08em] text-white/90 backdrop-blur-[8px]">
            {slot.category}
          </div>
          <span className="text-[10px] text-white/50">·</span>
          <span className="font-display text-[10px] font-medium tracking-[0.04em] text-white/60">
            {slot.series}
          </span>
        </div>
      )}

      {/* center play/pause */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: hovered || !playing ? 1 : 0 }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-[12px] transition-transform duration-150"
          style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </div>
      </div>

      {/* bottom controls */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3.5 pb-3 pt-8 transition-opacity duration-200"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
          opacity: hovered || !playing ? 1 : 0.6,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* scrubber */}
        <div
          onClick={seek}
          className="relative mb-2.5 h-[3px] cursor-pointer rounded-full bg-white/25"
        >
          <div
            className="relative h-full rounded-full bg-white"
            style={{ width: `${progress}%`, transition: "width 0.5s linear" }}
          >
            <div className="absolute -right-1 -top-[3px] h-[9px] w-[9px] rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.4)]" />
          </div>
        </div>

        {/* controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); setPlaying((p) => !p) }}
              className="text-white"
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setMuted((m) => !m) }}
              className="text-white"
            >
              {muted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
            <span className="font-display text-[11px] font-semibold text-white/85">
              {formatTime(time)} / {formatTime(DURATION)}
            </span>
          </div>
          <button className="text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bm-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
