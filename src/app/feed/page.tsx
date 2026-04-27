import { FeedContent } from "@/components/slot/feed/FeedContent";

export const metadata = {
  title: "Slot Feed | Barista Masters",
  description: "마스터 바리스타가 큐레이션한 원두 슬롯을 탐색하세요.",
};

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Page header */}
      <div className="px-6 py-12 text-center">
        <h1 className="font-display text-4xl font-bold text-ink-1">Slot Feed</h1>
        <p className="mt-2 text-sm text-ink-muted">마스터 바리스타 콘텐츠를 위한 매일의 큐레이션</p>
      </div>

      {/* Feed content */}
      <div className="mx-auto max-w-[1280px] px-6 pb-24">
        <FeedContent />
      </div>
    </main>
  );
}
