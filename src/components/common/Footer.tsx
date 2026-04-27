import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-[1280px] px-6 py-14">
        <div className="grid grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <p className="font-display text-base font-bold text-ink-1">
              Barista Masters
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              최고의 원두를 찾는 여정, 바리스타 마스터즈가
              함께합니다. 우리는 한 잔의 커피 그 이상의 가치를
              로스팅합니다.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
              Explore
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-ink-3">
              <li>
                <Link href="/about" className="transition-colors hover:text-ink-1">
                  브랜드 스토리
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="transition-colors hover:text-ink-1">
                  지속가능성
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="transition-colors hover:text-ink-1">
                  도매 문의
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
              Customer Support
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-ink-3">
              <li>
                <Link href="/shipping" className="transition-colors hover:text-ink-1">
                  배송 정책
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-ink-1">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-ink-1">
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
              Newsletter
            </h4>
            <div className="mt-5 flex gap-2">
              <Input
                placeholder="이메일 주소"
                className="border-border bg-card text-ink-1 placeholder:text-ink-muted focus-visible:ring-brand/30"
              />
              <Button
                size="icon"
                variant="outline"
                className="shrink-0 border-border bg-card text-ink-2 hover:bg-surface hover:border-brand hover:text-brand"
                aria-label="구독"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-xs text-ink-muted">
          © 2026 Barista Masters. Roasted with Precision.
        </div>
      </div>
    </footer>
  );
}
