import { ManagerSidebar } from "@/components/manage/layout/ManagerSidebar"

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ManagerSidebar />
      <main className="ml-72 min-h-screen bg-surface py-10 px-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </>
  )
}
