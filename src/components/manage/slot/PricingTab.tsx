"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SlotRegistrationFormData } from "@/types/slotRegistration"

export function PricingTab() {
  const { control, watch, setValue } = useFormContext<SlotRegistrationFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricingOptions",
  })

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-gray-light">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
                무게 옵션
              </th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
                얼리버드 가
              </th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
                2차 판매가
              </th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
                최종 정가
              </th>
              <th className="w-12 p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {fields.map((field, index) => (
              <tr
                key={field.id}
                className="transition-colors hover:bg-gray-light/30"
              >
                <td className="p-3">
                  <Input
                    value={watch(`pricingOptions.${index}.weight`)}
                    onChange={(e) =>
                      setValue(`pricingOptions.${index}.weight`, e.target.value)
                    }
                    placeholder="예: 200g"
                    className="h-10 rounded-lg border border-border bg-white px-3 font-bold"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    value={watch(`pricingOptions.${index}.earlybird`)}
                    onChange={(e) =>
                      setValue(
                        `pricingOptions.${index}.earlybird`,
                        Number(e.target.value),
                      )
                    }
                    placeholder="12000"
                    className="h-10 rounded-lg border border-border bg-white px-3 text-brand"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    value={watch(`pricingOptions.${index}.second`)}
                    onChange={(e) =>
                      setValue(
                        `pricingOptions.${index}.second`,
                        Number(e.target.value),
                      )
                    }
                    placeholder="14500"
                    className="h-10 rounded-lg border border-border bg-white px-3"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    value={watch(`pricingOptions.${index}.final`)}
                    onChange={(e) =>
                      setValue(
                        `pricingOptions.${index}.final`,
                        Number(e.target.value),
                      )
                    }
                    placeholder="18000"
                    className="h-10 rounded-lg border border-border bg-white px-3 text-ink-2"
                  />
                </td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-md p-2 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {fields.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-ink-muted"
                >
                  아직 가격 옵션이 없습니다. 아래 버튼으로 추가하세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              weight: "",
              earlybird: 0,
              second: 0,
              final: 0,
            })
          }
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          옵션 추가
        </Button>
      </div>
    </div>
  )
}
