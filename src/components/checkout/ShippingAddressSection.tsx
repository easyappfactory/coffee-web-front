"use client"

import { useState, useEffect, useRef } from "react"
import { useCheckoutStore } from "@/store/checkoutStore"
import { getShippingAddress } from "@/lib/api"
import { embedPostcode, type DaumPostcodeResult } from "@/lib/daum-postcode"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Pencil } from "lucide-react"
import type { ShippingAddress } from "@/types/shipping"

function formatPhone(digits: string): string {
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const inputBase =
  "w-full rounded-inner border px-3 py-2.5 text-[13px] text-ink-1 outline-none"
const inputNormal = `${inputBase} border-border bg-white focus:border-brand`
const inputError = `${inputBase} border-red-400 bg-white focus:border-red-400`
const inputReadonly = `${inputBase} border-border bg-surface`
const errorMsg = "mt-1 text-[11px] text-red-500"

export function ShippingAddressSection() {
  const {
    shippingAddress,
    setShippingAddress,
    saveAsDefault,
    setSaveAsDefault,
    isShippingReady,
  } = useCheckoutStore()

  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showPostcode, setShowPostcode] = useState(false)
  const [useOneTime, setUseOneTime] = useState(false)

  const postcodeRef = useRef<HTMLDivElement>(null)

  const [receiverName, setReceiverName] = useState("")
  const [receiverPhone, setReceiverPhone] = useState("")
  const [address, setAddress] = useState("")
  const [addressDetail, setAddressDetail] = useState("")
  const [zipcode, setZipcode] = useState("")

  // touched 상태 — 포커스 후 blur 시 true
  const [touched, setTouched] = useState({
    receiverName: false,
    receiverPhone: false,
    addressDetail: false,
    zipcode: false,
  })

  function markTouched(field: keyof typeof touched) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // 검증 함수
  const errors = {
    receiverName: touched.receiverName && !receiverName.trim()
      ? "수령인 이름을 입력해주세요."
      : null,
    receiverPhone: touched.receiverPhone && !receiverPhone
      ? "연락처를 입력해주세요."
      : touched.receiverPhone && !/^\d{11}$/.test(receiverPhone)
        ? "연락처는 11자리 숫자만 입력 가능합니다."
        : null,
    addressDetail: touched.addressDetail && !addressDetail.trim()
      ? "상세주소를 입력해주세요."
      : null,
    zipcode: touched.zipcode && !/^\d{5}$/.test(zipcode)
      ? "우편번호 검색을 해주세요."
      : null,
  }

  const isFormValid =
    receiverName.trim() !== "" &&
    /^\d{11}$/.test(receiverPhone) &&
    address !== "" &&
    addressDetail.trim() !== "" &&
    /^\d{5}$/.test(zipcode)

  useEffect(() => {
    getShippingAddress()
      .then((addr) => {
        setSavedAddress(addr)
        if (shippingAddress) {
          // persist된 배송지가 있으면 isShippingReady를 재계산해 동기화
          setShippingAddress(shippingAddress)
        } else if (addr) {
          setShippingAddress(addr)
        } else {
          setShowForm(true)
        }
      })
      .catch(() => {
        setLoadError("배송지 정보를 불러오지 못했습니다.")
        setShowForm(true)
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!showPostcode || !postcodeRef.current) return
    const el = postcodeRef.current
    el.innerHTML = ""

    embedPostcode(el, (data: DaumPostcodeResult) => {
      setZipcode(data.zonecode)
      setAddress(data.roadAddress)
      setShowPostcode(false)
    })
  }, [showPostcode])

  function handleFormSubmit() {
    // 모든 필드 touched 처리
    setTouched({
      receiverName: true,
      receiverPhone: true,
      addressDetail: true,
      zipcode: true,
    })
    if (!isFormValid) return

    const addr: ShippingAddress = {
      receiverName: receiverName.trim(),
      receiverPhone,
      address,
      addressDetail: addressDetail.trim(),
      zipcode,
    }
    setShippingAddress(addr)
  }

  function handleUseSaved() {
    if (savedAddress) {
      setShippingAddress(savedAddress)
      setUseOneTime(false)
      setShowForm(false)
    }
  }

  function handleUseOneTime() {
    setUseOneTime(true)
    setShowForm(true)
    setShippingAddress(null)
    setSaveAsDefault(true)
  }

  function handleChangeAddress() {
    setShowForm(true)
    setShippingAddress(null)
  }

  if (isLoading) {
    return (
      <section className="mt-5 rounded-card border border-border bg-card shadow-sm">
        <div className="flex items-center justify-center px-6 py-8">
          <Loader2 className="h-5 w-5 animate-spin text-ink-muted" />
        </div>
      </section>
    )
  }

  return (
    <section className="mt-5 rounded-card border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h2 className="flex items-center gap-2 font-display text-[13px] font-bold tracking-[0.06em] text-ink-muted">
          <MapPin className="h-4 w-4" />
          배송지 정보
        </h2>
      </div>

      <div className="px-6 py-5">
        {loadError && (
          <p className="mb-3 text-[12px] text-red-500">{loadError}</p>
        )}
        {isShippingReady && shippingAddress && !showForm && (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] font-semibold text-ink-1">
                  {shippingAddress?.receiverName}
                  <span className="ml-2 text-ink-muted font-normal">
                    {formatPhone(shippingAddress?.receiverPhone ?? "")}
                  </span>
                </p>
                <p className="mt-1 text-[13px] text-ink-2">
                  ({shippingAddress?.zipcode}) {shippingAddress?.address}
                  {shippingAddress?.addressDetail && `, ${shippingAddress.addressDetail}`}
                </p>
              </div>
              <button
                onClick={handleChangeAddress}
                className="shrink-0 text-[12px] font-medium text-brand hover:underline flex items-center gap-1"
              >
                <Pencil className="h-3 w-3" />
                변경
              </button>
            </div>
            {savedAddress && (
              <label className="mt-3 flex items-center gap-2 text-[12px] text-ink-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={useOneTime}
                  onChange={() => {
                    if (useOneTime) handleUseSaved()
                    else handleUseOneTime()
                  }}
                  className="rounded border-border"
                />
                이번만 다른 주소로 배송
              </label>
            )}
          </div>
        )}

        {showForm && (
          <div className="space-y-4">
            {/* 우편번호 */}
            <div>
              <label className="mb-1 block text-[12px] font-medium text-ink-muted">우편번호</label>
              <div className="flex items-center gap-2">
                <input
                  value={zipcode}
                  readOnly
                  placeholder="우편번호"
                  onBlur={() => markTouched("zipcode")}
                  className={`flex-1 h-[42px] px-3 text-[13px] text-ink-1 rounded-inner border ${
                    errors.zipcode ? "border-red-400 bg-surface" : "border-border bg-surface"
                  }`}
                />
                <Button
                  type="button"
                  onClick={() => setShowPostcode(true)}
                  className="shrink-0 !h-[42px] rounded-inner bg-brand px-5 text-[13px] font-medium text-white hover:bg-brand-dark"
                >
                  우편번호 찾기
                </Button>
              </div>
              {errors.zipcode && <p className={errorMsg}>{errors.zipcode}</p>}
              {showPostcode && (
                <div
                  ref={postcodeRef}
                  className="mt-2 rounded-inner border border-border overflow-hidden"
                  style={{ height: 400 }}
                />
              )}
            </div>

            {/* 기본주소 */}
            <div>
              <label className="mb-1 block text-[12px] font-medium text-ink-muted">기본주소</label>
              <input
                value={address}
                readOnly
                placeholder="우편번호 검색 후 자동 입력됩니다"
                className={inputReadonly}
              />
            </div>

            {/* 상세주소 */}
            <div>
              <label className="mb-1 block text-[12px] font-medium text-ink-muted">상세주소</label>
              <input
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                onBlur={() => markTouched("addressDetail")}
                placeholder="동, 호수 등 상세 주소를 입력하세요"
                className={errors.addressDetail ? inputError : inputNormal}
              />
              {errors.addressDetail && <p className={errorMsg}>{errors.addressDetail}</p>}
            </div>

            {/* 수령인 */}
            <div>
              <label className="mb-1 block text-[12px] font-medium text-ink-muted">수령인</label>
              <input
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                onBlur={() => markTouched("receiverName")}
                placeholder="수령인 이름"
                className={errors.receiverName ? inputError : inputNormal}
              />
              {errors.receiverName && <p className={errorMsg}>{errors.receiverName}</p>}
            </div>

            {/* 연락처 */}
            <div>
              <label className="mb-1 block text-[12px] font-medium text-ink-muted">연락처</label>
              <input
                value={formatPhone(receiverPhone)}
                onChange={(e) => setReceiverPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                onBlur={() => markTouched("receiverPhone")}
                inputMode="numeric"
                placeholder="01012345678"
                className={errors.receiverPhone ? inputError : inputNormal}
              />
              {errors.receiverPhone && <p className={errorMsg}>{errors.receiverPhone}</p>}
            </div>

            {/* 기본 배송지로 저장 */}
            <label className="flex items-center gap-2 text-[13px] text-ink-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
                className="rounded border-border"
              />
              기본 배송지로 저장하기
            </label>

            {/* 배송지 확인 버튼 */}
            <Button
              onClick={handleFormSubmit}
              disabled={!isFormValid}
              className="w-full rounded-inner bg-brand py-3 text-[14px] font-bold text-white hover:bg-brand-dark disabled:bg-ink-muted/30"
            >
              배송지 확인
            </Button>

            {savedAddress && useOneTime && (
              <button
                onClick={handleUseSaved}
                className="w-full text-center text-[12px] text-ink-muted hover:text-brand"
              >
                저장된 배송지 사용하기
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
