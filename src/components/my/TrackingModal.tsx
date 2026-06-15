"use client"

import { Dialog } from "@/components/ui/dialog"
import { useOrderTracking } from "@/hooks/useOrders"
import { Skeleton } from "@/components/ui/skeleton"

interface TrackingModalProps {
  open: boolean
  onClose: () => void
  orderId: string
  trackingNumber: string
}

export function TrackingModal({ open, onClose, orderId }: TrackingModalProps) {
  const { data: tracking, isLoading, isError } = useOrderTracking(orderId, open)

  return (
    <Dialog open={open} onClose={onClose} title="배송추적">
      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="mt-4 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-[var(--ink-muted)]">
            <p>배송 정보를 불러올 수 없습니다</p>
          </div>
        ) : tracking ? (
          <>
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                <span>{tracking.carrierName}</span>
                <span>·</span>
                <span>{tracking.trackingNumber}</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-[var(--ink-1)]">{tracking.status}</p>
            </div>
            {tracking.tracks.length > 0 ? (
              <div className="border-t pt-4">
                <div className="space-y-0">
                  {tracking.tracks.map((track, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {index === 0 ? (
                          <div className="relative mt-1 flex h-3.5 w-3.5 items-center justify-center">
                            <div className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-green-400 opacity-30" />
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                          </div>
                        ) : (
                          <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-gray-300" />
                        )}
                        {index < tracking.tracks.length - 1 && <div className="w-px flex-1 bg-gray-200" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-xs text-[var(--ink-muted)]">{track.time}</p>
                        <p className="text-sm font-medium text-[var(--ink-1)]">{track.description}</p>
                        {track.location && <p className="text-xs text-[var(--ink-muted)]">{track.location}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-[var(--ink-muted)]">배송 추적 정보가 아직 없습니다</p>
            )}
          </>
        ) : null}
      </div>
    </Dialog>
  )
}
