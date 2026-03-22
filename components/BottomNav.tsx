'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/swipe', label: 'Descubrir', emoji: '🃏' },
  { href: '/guardados', label: 'Guardados', emoji: '❤️' },
  { href: '/perfil', label: 'Perfil', emoji: '👤' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 safe-area-bottom">
      <div className="flex">
        {NAV.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors active:scale-95 ${
                active ? 'text-[#E63946]' : 'text-gray-400'
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className={`text-xs font-medium ${active ? 'text-[#E63946]' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
