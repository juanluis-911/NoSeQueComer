/**
 * seed-with-ai.ts
 * Usa Claude para generar recetas adicionales. Requiere saldo en la API de Anthropic.
 * Uso: npm run seed:ai
 */
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPT = (tipo: string) => `
Genera exactamente 30 recetas mexicanas de ${tipo} COTIDIANAS y PRÁCTICAS.
Para familias mexicanas entre semana. Sin mole, pierna, tamales, chiles en nogada,
pozole, carnitas por kilo. Ingredientes de tiendita o Bodega Aurrerá.
Lenguaje mexicano: "jitomate", "chile serrano", "epazote". Máx 6 pasos.

Responde SOLO con JSON array válido, sin markdown.
[{
  "nombre": "Huevos a la mexicana",
  "tipo": "${tipo}",
  "tiempo_min": 15,
  "dificultad": "fácil",
  "porciones": 2,
  "ingredientes": [{"cantidad":"3","unidad":"pzas","item":"huevos"}],
  "pasos": ["Pica jitomate, cebolla y chile.","Sofríe 2 min..."],
  "tags": ["rapido","economico","clasico"],
  "imagen_placeholder": "#F4A261"
}]

Tags válidos: rapido(<20min), economico, clasico, sin_carne, con_pollo,
con_res, con_cerdo, con_huevo, caldoso, seco.
Color hex: cálido para desayunos (#F4A261), rojizo/verde para comidas (#E63946, #2D6A4F), neutro para cenas (#6B7280, #9CA3AF).
`

async function main() {
  const tipos = ['desayuno', 'comida', 'cena']

  for (const tipo of tipos) {
    console.log(`\n🤖 Generando con Claude: ${tipo}...`)
    try {
      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 8192,
        messages: [{ role: 'user', content: PROMPT(tipo) }],
      })
      const text = message.content[0].type === 'text' ? message.content[0].text : ''
      const recipes = JSON.parse(text)
      console.log(`✅ ${recipes.length} recetas generadas`)

      const { error } = await supabase.from('recipes').insert(recipes)
      if (error) console.error(`❌ Error:`, error.message)
      else console.log(`💾 Guardadas en Supabase`)
    } catch (err) {
      console.error(`❌ Error en ${tipo}:`, err)
    }
    await new Promise(r => setTimeout(r, 2000))
  }
}

main()
