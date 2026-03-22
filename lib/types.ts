export type Tipo = 'desayuno' | 'comida' | 'cena'
export type Dificultad = 'fácil' | 'media' | 'difícil'

export interface Ingrediente {
  cantidad: string
  unidad: string
  item: string
}

export interface Recipe {
  id: string
  nombre: string
  tipo: Tipo
  tiempo_min: number
  dificultad: Dificultad
  porciones: number
  ingredientes: Ingrediente[]
  pasos: string[]
  tags: string[]
  imagen_url: string | null
  imagen_placeholder: string | null
  activa: boolean
  created_at: string
}

export interface UserSwipe {
  id: string
  user_id: string
  recipe_id: string
  liked: boolean
  cocinada: boolean
  created_at: string
}

export interface UserPreferences {
  user_id: string
  sin_carne: boolean
  tiempo_max: number
  updated_at: string
}

export interface SessionFilters {
  tipo: Tipo | 'sorpresa'
  tiempo_max: number
}
