import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const recipesData = JSON.parse(
  readFileSync(join(__dirname, 'recipes-data.json'), 'utf-8')
)

async function main() {
  const tipos = ['desayuno', 'comida', 'cena'] as const

  for (const tipo of tipos) {
    const batch = recipesData.filter((r: { tipo: string }) => r.tipo === tipo)
    console.log(`\n🍽️  Insertando ${batch.length} recetas de ${tipo}...`)

    const { error } = await supabase.from('recipes').insert(batch)

    if (error) {
      console.error(`❌ Error insertando ${tipo}:`, error.message)
    } else {
      console.log(`✅ ${batch.length} recetas de ${tipo} guardadas.`)
    }
  }

  console.log('\n🎉 Seed completo.')
}

main()
