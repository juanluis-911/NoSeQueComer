'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import RecipeBottomSheet from '@/components/RecipeBottomSheet'
import BottomNav from '@/components/BottomNav'
import PlaceholderImage from '@/components/PlaceholderImage'
import type { Recipe, Tipo } from '@/lib/types'

type Filter = Tipo | 'todas' | 'cocinadas'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'comida', label: 'Comida' },
  { value: 'cena', label: 'Cena' },
  { value: 'cocinadas', label: '✅ Ya cocinadas' },
]

interface SavedRecipe extends Recipe {
  swipe_id: string
  cocinada: boolean
}

export default function GuardadosPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([])
  const [filter, setFilter] = useState<Filter>('todas')
  const [loading, setLoading] = useState(true)
  const [sheetRecipe, setSheetRecipe] = useState<Recipe | null>(null)
  const [sheetSwipeId, setSheetSwipeId] = useState<string | null>(null)
  const [sheetCocinada, setSheetCocinada] = useState(false)
  const supabase = createClient()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_swipes')
        .select('id, cocinada, recipe_id, recipes(*)')
        .eq('user_id', user.id)
        .eq('liked', true)
        .order('created_at', { ascending: false })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: SavedRecipe[] = (data ?? []).map((row: any) => ({
        ...(row.recipes as Recipe),
        swipe_id: row.id as string,
        cocinada: row.cocinada as boolean,
      }))
      setRecipes(mapped)
      setLoading(false)
    }
    load()
  }, [])

  function filtered() {
    if (filter === 'todas') return recipes
    if (filter === 'cocinadas') return recipes.filter(r => r.cocinada)
    return recipes.filter(r => r.tipo === filter)
  }

  function openSheet(recipe: SavedRecipe) {
    setSheetRecipe(recipe)
    setSheetSwipeId(recipe.swipe_id)
    setSheetCocinada(recipe.cocinada)
  }

  function handleCocinada() {
    setSheetCocinada(true)
    setRecipes(prev => prev.map(r => r.swipe_id === sheetSwipeId ? { ...r, cocinada: true } : r))
  }

  const list = filtered()

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Guardados ❤️</h1>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-[#E63946] text-white'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <span className="text-4xl animate-bounce">🍽️</span>
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center px-8 gap-3">
          <span className="text-5xl">😔</span>
          <p className="font-semibold text-gray-700">Aún no tienes recetas guardadas</p>
          <p className="text-sm text-gray-400">Desliza a la derecha en las que te gusten</p>
          <a href="/swipe" className="bg-[#E63946] text-white px-6 py-3 rounded-2xl font-semibold active:scale-95 transition-all mt-2">
            Descubrir recetas
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 py-2">
          {list.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => openSheet(recipe)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-all text-left"
            >
              <div className="relative h-32">
                <PlaceholderImage recipe={recipe} />
                {recipe.cocinada && (
                  <div className="absolute top-2 right-2 bg-[#2D6A4F] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    ✅ Cocinada
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2">{recipe.nombre}</p>
                <p className="text-xs text-gray-400 mt-1">⏱ {recipe.tiempo_min}min · {recipe.porciones} porc.</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <RecipeBottomSheet
        recipe={sheetRecipe}
        userSwipeId={sheetSwipeId}
        cocinada={sheetCocinada}
        onClose={() => setSheetRecipe(null)}
        onCocinada={handleCocinada}
      />

      <BottomNav />
    </div>
  )
}
