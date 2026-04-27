"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feedStore";
import { useRef, useState } from "react";

interface VideoPlayerProps {
  slotId: string;
  thumbnailUrl: string;
  videoUrl?: string;
  className?: string;
}

export function VideoPlayer({ slotId, thumbnailUrl, videoUrl, className }: VideoPlayerProps) {
  const { playingVideoId, setPlayingVideoId } = useFeedStore();
  const isPlaying = playingVideoId === slotId;

  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (!videoUrl) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePlayClick = () => {
    setIsHovered(false);
    setPlayingVideoId(slotId);
  };

  const showHoverPreview = isHovered && !isPlaying && !!videoUrl;

  if (isPlaying && videoUrl) {
    return (
      <div className="w-full bg-black">
        <video
          src={videoUrl}
          autoPlay
          controls
          className="block w-full h-auto"
          onEnded={() => setPlayingVideoId(null)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative aspect-[16/9] overflow-hidden bg-ink-1", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 호버 시 음소거 미리보기 */}
      {showHoverPreview && (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <Image
        src={thumbnailUrl}
        alt="슬롯 썸네일"
        fill
        className={cn("object-cover transition-opacity duration-300", showHoverPreview && "opacity-0")}
        sizes="(max-width: 1280px) 100vw, 800px"
      />

      <button
        onClick={handlePlayClick}
        className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
        aria-label="영상 재생"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-md">
          <Play className="ml-1 h-6 w-6 text-ink-1" fill="currentColor" />
        </span>
      </button>
    </div>
  );
}
