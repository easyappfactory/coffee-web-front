"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Coffee, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "SLOT FEED", href: "/feed" },
  { label: "MY SLOTS", href: "/my-slots" },
  { label: "MY PAGE", href: "/my" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-[12px]">
      <div className="mx-auto flex h-[81px] max-w-[1280px] items-center justify-between px-6">
        <Link href="/feed" className="flex items-center gap-2 font-display text-xl font-bold text-brand">
          <Coffee className="h-5 w-5" />
          Barista Masters
        </Link>
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand",
                (href === "/" ? pathname === "/" : pathname.startsWith(href))
                  ? "border-b-2 border-brand text-brand"
                  : "text-ink-2"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/checkout" aria-label="장바구니" className="text-ink-2 transition-colors hover:text-brand">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="" alt="프로필" />
            <AvatarFallback className="bg-gray-light text-xs text-ink-2">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
