'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Tipo, SessionFilters } from '@/lib/types'

const TIPOS = [
  { value: 'desayuno', label: 'Desayuno', emoji: '🍳' },
  { value: 'comida', label: 'Comida', emoji: '🫕' },
  { value: 'cena', label: 'Cena', emoji: '🌙' },
  { value: 'sorpresa', label: 'Sorpréndeme', emoji: '🎲' },
]

const TIEMPOS = [
  { value: 20, label: '<20 min' },
  { value: 40, label: '20–40 min' },
  { value: 120, label: '+40 min' },
]

interface Props {
  open: boolean
  filters: SessionFilters
  onClose: () => void
  onApply: (filters: SessionFilters) => void
}

export default function FilterSheet({ open, filters, onClose, onApply }: Props) {
  const [tipo, setTipo] = useState<Tipo | 'sorpresa'>(filters.tipo)
  const [tiempoMax, setTiempoMax] = useState(filters.tiempo_max)

  function apply() {
    onApply({ tipo, tiempo_max: tiempoMax })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl pb-10"
          >
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div className="px-5">
              <h3 className="font-bold text-gray-900 mb-4">Filtros</h3>

              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">¿Qué comes?</p>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {TIPOS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTipo(t.value as Tipo | 'sorpresa')}
                    className={`flex flex-col items-center py-3 rounded-2xl border-2 gap-1 transition-all ${
                      tipo === t.value ? 'border-[#E63946] bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Tiempo</p>
              <div className="flex gap-2 mb-8">
                {TIEMPOS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTiempoMax(t.value)}
                    className={`flex-1 py-3 rounded-2xl border-2 text-sm font-medium transition-all ${
                      tiempoMax === t.value ? 'border-[#E63946] bg-red-50 text-[#E63946]' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                onClick={apply}
                className="w-full bg-[#E63946] text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
              >
                Aplicar filtros
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
