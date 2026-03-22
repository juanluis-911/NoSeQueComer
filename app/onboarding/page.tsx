'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Tipo, SessionFilters } from '@/lib/types'

const TIPOS = [
  { value: 'desayuno', label: 'Desayuno', emoji: '🍳' },
  { value: 'comida', label: 'Comida', emoji: '🫕' },
  { value: 'cena', label: 'Cena', emoji: '🌙' },
  { value: 'sorpresa', label: 'Sorpréndeme', emoji: '🎲' },
]

const TIEMPOS = [
  { value: 20, label: '<20 min', emoji: '⚡' },
  { value: 40, label: '20–40 min', emoji: '🕐' },
  { value: 120, label: '+40 min', emoji: '👨‍🍳' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [tipo, setTipo] = useState<Tipo | 'sorpresa' | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function finish(tiempo: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Guardar preferencias
    await supabase.from('user_preferences').upsert({
      user_id: user.id,
      tiempo_max: tiempo,
      updated_at: new Date().toISOString(),
    })

    // Guardar filtros en localStorage
    const filters: SessionFilters = {
      tipo: tipo ?? 'sorpresa',
      tiempo_max: tiempo,
    }
    localStorage.setItem('sessionFilters', JSON.stringify(filters))

    router.push('/swipe')
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col px-6 py-12">
      {/* Progress */}
      <div className="flex gap-2 mb-10">
        <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-[#E63946]' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[#E63946]' : 'bg-gray-200'}`} />
      </div>

      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Qué vas a comer?</h2>
          <p className="text-gray-500 text-sm mb-8">Elige el momento del día</p>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {TIPOS.map(t => (
              <button
                key={t.value}
                onClick={() => {
                  setTipo(t.value as Tipo | 'sorpresa')
                  setStep(2)
                }}
                className="flex flex-col items-center justify-center bg-white border-2 border-gray-200 rounded-2xl py-8 gap-3 active:scale-95 transition-all hover:border-[#E63946]"
              >
                <span className="text-4xl">{t.emoji}</span>
                <span className="font-semibold text-gray-800">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <button onClick={() => setStep(1)} className="text-gray-400 text-sm mb-6 text-left">← Atrás</button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Cuánto tiempo tienes?</h2>
          <p className="text-gray-500 text-sm mb-8">Para preparar la receta</p>
          <div className="flex flex-col gap-3">
            {TIEMPOS.map(t => (
              <button
                key={t.value}
                onClick={() => finish(t.value)}
                className="flex items-center gap-4 bg-white border-2 border-gray-200 rounded-2xl py-5 px-6 active:scale-95 transition-all hover:border-[#E63946]"
              >
                <span className="text-3xl">{t.emoji}</span>
                <span className="font-semibold text-gray-800 text-lg">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
