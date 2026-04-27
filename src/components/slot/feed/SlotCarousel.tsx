"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { SlotCard } from "./SlotCard";
import type { Slot } from "@/types/slot";

const AUTOPLAY_INTERVAL_MS = 1500;

interface SlotCarouselProps {
  slots: Slot[];
}

export function SlotCarousel({ slots }: SlotCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const isPausedRef = useRef(false);

  const handleMouseEnter = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      // loop: true 옵션 덕분에 마지막 슬라이드에서도 scrollNext()가
      // 역방향 없이 0번으로 이어집니다.
      api.scrollNext();
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [api]);

  if (slots.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-ink-muted">
        해당 카테고리의 슬롯이 없습니다.
      </p>
    );
  }

  return (
    <Carousel
      opts={{ align: "start", dragFree: true, loop: true }}
      setApi={setApi}
      className="w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CarouselContent className="-ml-4">
        {slots.map((slot) => (
          <CarouselItem key={slot.id} className="pl-4 basis-auto">
            <SlotCard slot={slot} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
