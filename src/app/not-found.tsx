import Link from "next/link";
import { Coffee } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
          <Coffee className="h-10 w-10 text-brand" strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-[28px] font-extrabold tracking-tight text-ink-1">
            404
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            요청하신 페이지가 존재하지 않습니다.
          </p>
        </div>

        <Link
          href="/feed"
          className="rounded-card bg-brand px-8 py-3 font-display text-[14px] font-bold text-white transition-colors hover:bg-brand-dark"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
