'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import PlaceholderImage from './PlaceholderImage'
import type { Recipe } from '@/lib/types'

const DIFICULTAD_COLOR: Record<string, string> = {
  'fácil': 'text-[#2D6A4F] bg-green-100',
  'media': 'text-yellow-700 bg-yellow-100',
  'difícil': 'text-[#E63946] bg-red-100',
}

const TAG_LABELS: Record<string, string> = {
  rapido: '⚡ Rápido',
  economico: '💰 Económico',
  clasico: '⭐ Clásico',
  sin_carne: '🥦 Sin carne',
  con_pollo: '🍗 Pollo',
  con_res: '🥩 Res',
  con_cerdo: '🐷 Cerdo',
  con_huevo: '🥚 Huevo',
  caldoso: '🍲 Caldoso',
  seco: '🍛 Seco',
}

interface Props {
  recipe: Recipe
  onSwipe: (liked: boolean) => void
  isTop: boolean
  zIndex: number
  scale?: number
}

export default function SwipeCard({ recipe, onSwipe, isTop, zIndex, scale = 1 }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const likeOpacity = useTransform(x, [30, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, -30], [1, 0])

  async function handleSwipe(direction: 'left' | 'right') {
    const liked = direction === 'right'
    if (navigator.vibrate) navigator.vibrate(50)
    await animate(x, liked ? 600 : -600, { duration: 0.3 })
    onSwipe(liked)
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x > 100) handleSwipe('right')
    else if (info.offset.x < -100) handleSwipe('left')
    else animate(x, 0, { type: 'spring', stiffness: 300 })
  }

  return (
    <motion.div
      style={{
        x,
        rotate,
        zIndex,
        scale,
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="touch-none"
    >
      <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col">
        {/* Imagen area — 55% */}
        <div className="relative" style={{ height: '55%' }}>
          {/* TODO: cuando imagen_url esté disponible:
            recipe.imagen_url
              ? <Image src={recipe.imagen_url} alt={recipe.nombre} fill className="object-cover" />
              : <PlaceholderImage recipe={recipe} />
          */}
          <PlaceholderImage recipe={recipe} />

          {/* Overlay ¡Me late! */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute inset-0 bg-[#2D6A4F]/80 flex items-center justify-center pointer-events-none"
          >
            <span className="text-white font-black text-4xl rotate-[-12deg] border-4 border-white px-4 py-2 rounded-xl">
              ¡Me late!
            </span>
          </motion.div>

          {/* Overlay Paso */}
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute inset-0 bg-[#E63946]/80 flex items-center justify-center pointer-events-none"
          >
            <span className="text-white font-black text-4xl rotate-[12deg] border-4 border-white px-4 py-2 rounded-xl">
              Paso
            </span>
          </motion.div>
        </div>

        {/* Info area — 45% */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-lg font-bold text-gray-900 leading-tight flex-1">{recipe.nombre}</h2>
            <span className="text-2xl">{recipe.tipo === 'desayuno' ? '🍳' : recipe.tipo === 'comida' ? '🌮' : '🌙'}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <span>⏱ {recipe.tiempo_min}min</span>
            <span>👤 {recipe.porciones}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFICULTAD_COLOR[recipe.dificultad]}`}>
              {recipe.dificultad}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
                {TAG_LABELS[tag] ?? tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
