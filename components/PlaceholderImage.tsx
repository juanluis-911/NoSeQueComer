import type { Recipe } from '@/lib/types'

const EMOJI_MAP: Record<string, string> = {
  desayuno: '🍳',
  comida: '🫕',
  cena: '🌙',
}

export default function PlaceholderImage({ recipe }: { recipe: Recipe }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative"
      style={{ backgroundColor: recipe.imagen_placeholder ?? '#F4A261' }}
    >
      <span className="text-8xl select-none">{EMOJI_MAP[recipe.tipo] ?? '🍽️'}</span>
      <span className="absolute bottom-3 right-3 text-xs text-white/70 font-medium">
        Foto próximamente
      </span>
    </div>
  )
}
