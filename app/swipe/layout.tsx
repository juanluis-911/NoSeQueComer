import BottomNav from '@/components/BottomNav'

export default function SwipeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}
