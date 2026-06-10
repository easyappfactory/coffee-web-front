/** Daum 우편번호 서비스 oncomplete 콜백에서 사용할 타입 */
export interface DaumPostcodeResult {
  zonecode: string
  roadAddress: string
  jibunAddress: string
  buildingName: string
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeResult) => void
        onclose?: () => void
        width?: string | number
        height?: string | number
      }) => { open: () => void; embed: (element: HTMLElement) => void }
    }
  }
}

const SCRIPT_URL = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"

let scriptLoaded = false
let scriptLoading: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve()
  if (scriptLoading) return scriptLoading

  scriptLoading = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => {
      scriptLoaded = true
      resolve()
    }
    script.onerror = () => reject(new Error("Daum Postcode 스크립트 로드 실패"))
    document.head.appendChild(script)
  })

  return scriptLoading
}

export async function openPostcodePopup(
  onComplete: (result: DaumPostcodeResult) => void,
): Promise<void> {
  await loadScript()
  new window.daum.Postcode({ oncomplete: onComplete }).open()
}

export async function embedPostcode(
  element: HTMLElement,
  onComplete: (result: DaumPostcodeResult) => void,
): Promise<void> {
  await loadScript()
  new window.daum.Postcode({ oncomplete: onComplete }).embed(element)
}
