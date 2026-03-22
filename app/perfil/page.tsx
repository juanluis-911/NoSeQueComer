'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import type { User } from '@supabase/supabase-js'

interface Stats {
  vistas: number
  guardadas: number
  cocinadas: number
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats>({ vistas: 0, guardadas: 0, cocinadas: 0 })
  const [sinCarne, setSinCarne] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const [swipesRes, prefsRes] = await Promise.all([
        supabase.from('user_swipes').select('liked, cocinada').eq('user_id', user.id),
        supabase.from('user_preferences').select('sin_carne').eq('user_id', user.id).single(),
      ])

      const swipes = (swipesRes.data ?? []) as { liked: boolean; cocinada: boolean }[]
      setStats({
        vistas: swipes.length,
        guardadas: swipes.filter(s => s.liked).length,
        cocinadas: swipes.filter(s => s.cocinada).length,
      })

      if (prefsRes.data) setSinCarne(prefsRes.data.sin_carne)
      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function toggleSinCarne() {
    if (!user) return
    const newVal = !sinCarne
    setSinCarne(newVal)
    await supabase.from('user_preferences').upsert({
      user_id: user.id,
      sin_carne: newVal,
      updated_at: new Date().toISOString(),
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Usuario'
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Perfil 👤</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="text-4xl animate-bounce">🍽️</span>
        </div>
      ) : (
        <div className="px-4 py-6 space-y-4">
          {/* Avatar + nombre */}
          <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#E63946] flex items-center justify-center text-white text-2xl font-bold">
                {displayName[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 text-lg">{displayName}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl p-5">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Mis estadísticas</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Vistas', value: stats.vistas, emoji: '👀' },
                { label: 'Guardadas', value: stats.guardadas, emoji: '❤️' },
                { label: 'Cocinadas', value: stats.cocinadas, emoji: '✅' },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col items-center bg-gray-50 rounded-2xl py-4 gap-1">
                  <span className="text-2xl">{stat.emoji}</span>
                  <span className="text-2xl font-black text-gray-900">{stat.value}</span>
                  <span className="text-xs text-gray-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferencias */}
          <div className="bg-white rounded-2xl p-5">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Preferencias</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Sin carne 🥦</p>
                <p className="text-xs text-gray-400">Solo mostrar recetas vegetarianas</p>
              </div>
              <button
                onClick={toggleSinCarne}
                className={`relative w-12 h-6 rounded-full transition-colors ${sinCarne ? 'bg-[#2D6A4F]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${sinCarne ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Cerrar sesión */}
          <button
            onClick={signOut}
            className="w-full bg-white border border-gray-200 text-gray-600 py-4 rounded-2xl font-semibold active:scale-95 transition-all"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
