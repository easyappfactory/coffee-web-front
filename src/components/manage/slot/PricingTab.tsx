"use client"

import { useState } from "react"
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

  const minFundingAmount = watch("minFundingAmount") ?? 0
  const maxFundingAmount = watch("maxFundingAmount") ?? null

  const [minDisplay, setMinDisplay] = useState("")
  const [maxDisplay, setMaxDisplay] = useState("")

  function handleMinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    setMinDisplay(raw)
    setValue("minFundingAmount", raw ? parseInt(raw, 10) : 0)
  }

  function handleMinBlur() {
    setMinDisplay(minFundingAmount > 0 ? minFundingAmount.toLocaleString("ko-KR") : "")
  }

  function handleMaxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    setMaxDisplay(raw)
    setValue("maxFundingAmount", raw ? parseInt(raw, 10) : null)
  }

  function handleMaxBlur() {
    setMaxDisplay(maxFundingAmount !== null ? maxFundingAmount.toLocaleString("ko-KR") : "")
  }

  const minAmountError =
    minDisplay !== "" && minFundingAmount < 1
      ? "최소 펀딩 금액은 1원 이상이어야 합니다."
      : null

  const maxAmountError =
    maxDisplay !== "" &&
    maxFundingAmount !== null &&
    minFundingAmount > 0 &&
    maxFundingAmount < minFundingAmount
      ? "최대 펀딩 금액은 최소 금액 이상이어야 합니다."
      : null

  return (
    <div>
      {/* 펀딩 목표 금액 */}
      <div className="mb-8">
        <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-ink-muted">
          펀딩 목표 금액 (원)
        </label>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {/* 최소 금액 */}
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-ink-muted">최소 금액 (필수)</p>
            <Input
              type="text"
              inputMode="numeric"
              value={minDisplay}
              onChange={handleMinChange}
              onBlur={handleMinBlur}
              placeholder="예: 1,000,000"
              className="h-10 rounded-lg border border-border bg-white px-3"
            />
            {minAmountError && (
              <p className="mt-1 text-xs text-destructive">{minAmountError}</p>
            )}
          </div>

          {/* 최대 금액 */}
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-ink-muted">최대 금액 (선택)</p>
            <Input
              type="text"
              inputMode="numeric"
              value={maxDisplay}
              onChange={handleMaxChange}
              onBlur={handleMaxBlur}
              placeholder="예: 5,000,000"
              className="h-10 rounded-lg border border-border bg-white px-3"
            />
            {maxAmountError && (
              <p className="mt-1 text-xs text-destructive">{maxAmountError}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">비워두면 무제한으로 설정됩니다.</p>
          </div>
        </div>
      </div>

      {/* 가격 옵션 테이블 */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-gray-light">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">무게 옵션</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">얼리버드 가</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">2차 판매가</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">최종 정가</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">최소 수량</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-ink-muted">최대 수량</th>
              <th className="w-12 p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {fields.map((field, index) => (
              <tr key={field.id} className="transition-colors hover:bg-gray-light/30">
                <td className="p-3">
                  <Input
                    value={watch(`pricingOptions.${index}.weight`)}
                    onChange={(e) => setValue(`pricingOptions.${index}.weight`, e.target.value)}
                    placeholder="예: 200g"
                    className="h-10 rounded-lg border border-border bg-white px-3 font-bold"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    value={watch(`pricingOptions.${index}.earlybird`)}
                    onChange={(e) => setValue(`pricingOptions.${index}.earlybird`, Number(e.target.value))}
                    placeholder="12000"
                    className="h-10 rounded-lg border border-border bg-white px-3 text-brand"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    value={watch(`pricingOptions.${index}.second`)}
                    onChange={(e) => setValue(`pricingOptions.${index}.second`, Number(e.target.value))}
                    placeholder="14500"
                    className="h-10 rounded-lg border border-border bg-white px-3"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    value={watch(`pricingOptions.${index}.final`)}
                    onChange={(e) => setValue(`pricingOptions.${index}.final`, Number(e.target.value))}
                    placeholder="18000"
                    className="h-10 rounded-lg border border-border bg-white px-3 text-ink-2"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    value={watch(`pricingOptions.${index}.minQuantity`)}
                    onChange={(e) => setValue(`pricingOptions.${index}.minQuantity`, Number(e.target.value))}
                    placeholder="1"
                    min={1}
                    className="h-10 w-20 rounded-lg border border-border bg-white px-3"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    value={watch(`pricingOptions.${index}.maxQuantity`)}
                    onChange={(e) => setValue(`pricingOptions.${index}.maxQuantity`, Number(e.target.value))}
                    placeholder="10"
                    min={1}
                    className="h-10 w-20 rounded-lg border border-border bg-white px-3"
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
                <td colSpan={7} className="p-8 text-center text-sm text-ink-muted">
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
              minQuantity: 1,
              maxQuantity: 10,
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
