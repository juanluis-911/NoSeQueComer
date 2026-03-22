'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import SwipeCard from '@/components/SwipeCard'
import RecipeBottomSheet from '@/components/RecipeBottomSheet'
import FilterSheet from '@/components/FilterSheet'
import type { Recipe, SessionFilters, Tipo } from '@/lib/types'

const DEFAULT_FILTERS: SessionFilters = { tipo: 'comida', tiempo_max: 60 }

const TIPO_RANDOM: Tipo[] = ['desayuno', 'comida', 'cena']

export default function SwipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<SessionFilters>(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [sheetRecipe, setSheetRecipe] = useState<Recipe | null>(null)
  const [sheetSwipeId, setSheetSwipeId] = useState<string | null>(null)
  const [sheetCocinada, setSheetCocinada] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  // Cargar filtros de localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sessionFilters')
    if (stored) {
      try {
        setFilters(JSON.parse(stored))
      } catch {}
    }
  }, [])

  // Obtener userId
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRecipes = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const tipo = filters.tipo === 'sorpresa'
      ? TIPO_RANDOM[Math.floor(Math.random() * 3)]
      : filters.tipo

    // Obtener IDs ya vistos
    const { data: swipes } = await supabase
      .from('user_swipes')
      .select('recipe_id')
      .eq('user_id', userId)

    const seenIds = (swipes ?? []).map((s: { recipe_id: string }) => s.recipe_id)

    let query = supabase
      .from('recipes')
      .select('*')
      .eq('tipo', tipo)
      .lte('tiempo_min', filters.tiempo_max)
      .limit(10)

    if (seenIds.length > 0) {
      query = query.not('id', 'in', `(${seenIds.join(',')})`)
    }

    const { data } = await query

    setRecipes((data as Recipe[]) ?? [])
    setLoading(false)
  }, [userId, filters])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  async function handleSwipe(liked: boolean) {
    const recipe = recipes[recipes.length - 1]
    if (!recipe || !userId) return

    // Registrar swipe
    const { data } = await supabase
      .from('user_swipes')
      .insert({ user_id: userId, recipe_id: recipe.id, liked })
      .select()
      .single()

    // Si le gustó, abrir bottom sheet
    if (liked && data) {
      setSheetRecipe(recipe)
      setSheetSwipeId(data.id)
      setSheetCocinada(false)
    }

    setRecipes(prev => prev.slice(0, -1))

    // Cargar más si quedan pocas
    if (recipes.length <= 3) {
      fetchRecipes()
    }
  }

  function applyFilters(f: SessionFilters) {
    setFilters(f)
    localStorage.setItem('sessionFilters', JSON.stringify(f))
    setRecipes([])
  }

  const currentTipo = filters.tipo === 'sorpresa' ? 'Sorpresa 🎲' :
    filters.tipo === 'desayuno' ? 'Desayuno 🍳' :
    filters.tipo === 'comida' ? 'Comida 🫕' : 'Cena 🌙'

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col" style={{ paddingBottom: 80 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <span className="font-black text-[#E63946] text-xl">NSQ</span>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700"
        >
          {currentTipo} <span className="text-gray-400">▾</span>
        </button>
        <button
          onClick={() => setShowFilters(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-lg"
        >
          ⚙️
        </button>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <span className="text-4xl animate-bounce">🍽️</span>
            <p className="text-sm">Cargando recetas...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center gap-4 text-center px-8">
            <span className="text-6xl">😅</span>
            <h2 className="text-xl font-bold text-gray-800">¡Ya viste todo!</h2>
            <p className="text-gray-500 text-sm">Cambia los filtros para ver más recetas</p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowFilters(true)}
                className="bg-[#E63946] text-white px-5 py-3 rounded-2xl font-semibold active:scale-95 transition-all"
              >
                Cambiar filtros
              </button>
              <a
                href="/guardados"
                className="bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-semibold active:scale-95 transition-all"
              >
                Ver guardados
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Stack de cartas */}
            <div className="relative w-full" style={{ maxWidth: 380, height: 520 }}>
              {recipes.slice(-3).map((recipe, idx, arr) => {
                const isTop = idx === arr.length - 1
                const scale = 1 - (arr.length - 1 - idx) * 0.04
                const translateY = (arr.length - 1 - idx) * -8
                return (
                  <div
                    key={recipe.id}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      transform: `scale(${scale}) translateY(${translateY}px)`,
                      zIndex: idx + 1,
                    }}
                  >
                    <SwipeCard
                      recipe={recipe}
                      onSwipe={handleSwipe}
                      isTop={isTop}
                      zIndex={idx + 1}
                      scale={1}
                    />
                  </div>
                )
              })}
            </div>

            {/* Botones físicos */}
            <div className="flex gap-6 mt-6">
              <button
                onClick={() => handleSwipe(false)}
                className="flex flex-col items-center gap-1 bg-white border-2 border-gray-200 rounded-2xl px-8 py-4 active:scale-95 transition-all shadow-sm"
              >
                <span className="text-2xl">👎</span>
                <span className="text-xs font-medium text-gray-500">No gracias</span>
              </button>
              <button
                onClick={() => handleSwipe(true)}
                className="flex flex-col items-center gap-1 bg-[#E63946] rounded-2xl px-8 py-4 active:scale-95 transition-all shadow-md"
              >
                <span className="text-2xl">❤️</span>
                <span className="text-xs font-bold text-white">¡Me late!</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Filter sheet */}
      <FilterSheet
        open={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onApply={applyFilters}
      />

      {/* Bottom sheet detalle */}
      <RecipeBottomSheet
        recipe={sheetRecipe}
        userSwipeId={sheetSwipeId}
        cocinada={sheetCocinada}
        onClose={() => setSheetRecipe(null)}
        onCocinada={() => setSheetCocinada(true)}
      />
    </div>
  )
}
