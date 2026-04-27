"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feedStore";

const CATEGORIES = ["전체", "BEANS", "BREWING", "TASTING", "ROASTING", "ORIGIN"];

export function FilterBar() {
  const { activeCategory, setActiveCategory } = useFeedStore();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {CATEGORIES.map((cat) => (
        <Button
          key={cat}
          variant={activeCategory === cat ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(cat)}
          className={cn(
            "rounded-pill px-5 text-sm font-medium transition-colors",
            activeCategory === cat
              ? "border-ink-1 bg-ink-1 text-white hover:bg-ink-1/90"
              : "border-gray-line bg-gray-light text-ink-2 hover:border-ink-1 hover:text-ink-1"
          )}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
