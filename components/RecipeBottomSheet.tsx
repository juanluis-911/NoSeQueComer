'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Recipe } from '@/lib/types'

interface Props {
  recipe: Recipe | null
  userSwipeId: string | null
  cocinada: boolean
  onClose: () => void
  onCocinada: () => void
}

export default function RecipeBottomSheet({ recipe, userSwipeId, cocinada, onClose, onCocinada }: Props) {
  const supabase = createClient()
  const overlayRef = useRef<HTMLDivElement>(null)

  async function markCocinada() {
    if (!userSwipeId || cocinada) return
    await supabase.from('user_swipes').update({ cocinada: true }).eq('id', userSwipeId)
    onCocinada()
    setTimeout(onClose, 800)
  }

  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [recipe])

  return (
    <AnimatePresence>
      {recipe && (
        <>
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            <div className="px-5 pb-8">
              {/* Header */}
              <h2 className="text-xl font-bold text-gray-900 mt-2 mb-1">{recipe.nombre}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                <span>⏱ {recipe.tiempo_min}min</span>
                <span>·</span>
                <span className={recipe.dificultad === 'fácil' ? 'text-[#2D6A4F]' : recipe.dificultad === 'difícil' ? 'text-[#E63946]' : 'text-yellow-600'}>
                  {recipe.dificultad === 'fácil' ? '🟢' : recipe.dificultad === 'media' ? '🟡' : '🔴'} {recipe.dificultad}
                </span>
                <span>·</span>
                <span>👤 {recipe.porciones} {recipe.porciones === 1 ? 'porción' : 'porciones'}</span>
              </div>

              {/* Ingredientes */}
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Ingredientes</h3>
              <ul className="space-y-2 mb-6">
                {recipe.ingredientes.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] flex-shrink-0" />
                    <span className="font-medium">{ing.cantidad} {ing.unidad}</span>
                    <span>{ing.item}</span>
                  </li>
                ))}
              </ul>

              {/* Pasos */}
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Pasos</h3>
              <ol className="space-y-3 mb-8">
                {recipe.pasos.map((paso, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#E63946] text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{paso}</p>
                  </li>
                ))}
              </ol>

              {/* CTA */}
              <button
                onClick={markCocinada}
                disabled={cocinada}
                className={`w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-all ${
                  cocinada
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-[#2D6A4F] text-white'
                }`}
              >
                {cocinada ? '✅ ¡Ya la hiciste!' : '✅ Ya la hice'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
