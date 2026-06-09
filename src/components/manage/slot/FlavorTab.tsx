"use client"

import { useFormContext, Controller } from "react-hook-form"
import { RadarChart } from "@/components/slot/detail/RadarChart"
import type { SlotRegistrationFormData } from "@/types/slotRegistration"

const FLAVOR_AXES = [
  { key: "aroma", label: "아로마 (Aroma)" },
  { key: "body", label: "바디감 (Body)" },
  { key: "sweetness", label: "단맛 (Sweetness)" },
  { key: "acidity", label: "산미 (Acidity)" },
] as const

export function FlavorTab() {
  const { control, watch } = useFormContext<SlotRegistrationFormData>()
  const flavor = watch("flavor")

  const radarData: Record<string, number> = {
    Aroma: flavor.aroma * 20,
    Body: flavor.body * 20,
    Sweetness: flavor.sweetness * 20,
    Acidity: flavor.acidity * 20,
  }

  return (
    <div className="grid grid-cols-12 items-center gap-12">
      <div className="col-span-6 space-y-10">
        {FLAVOR_AXES.map(({ key, label }) => (
          <Controller
            key={key}
            name={`flavor.${key}`}
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-widest text-ink-1">
                    {label}
                  </span>
                  <span className="font-bold text-brand">
                    Level {field.value}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/20 accent-brand"
                />
              </div>
            )}
          />
        ))}
      </div>

      <div className="col-span-6 flex items-center justify-center rounded-3xl bg-white p-12 shadow-sm">
        <div className="relative">
          <RadarChart data={radarData} size={280} />
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            <span className="text-[10px] font-bold uppercase text-brand">
              Real-time Preview
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
