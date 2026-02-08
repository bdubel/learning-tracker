import { PathSidebar } from "@/components/path-sidebar"

export default async function PathLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex flex-1 overflow-hidden">
      {children}
      <PathSidebar pathId={id} />
    </div>
  )
}
