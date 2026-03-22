import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#E63946] mb-6 shadow-lg">
          <span className="text-5xl">🍽️</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-3 leading-tight">
          No sé<br />qué comer
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-xs">
          Descubre recetas mexicanas cotidianas con solo un swipe. Rápidas, económicas y con ingredientes de la tiendita.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-12 w-full max-w-xs">
          {[
            { emoji: '⚡', label: 'Rápidas' },
            { emoji: '💰', label: 'Económicas' },
            { emoji: '🇲🇽', label: 'Mexicanas' },
          ].map(f => (
            <div key={f.label} className="flex flex-col items-center gap-1 bg-white rounded-2xl py-4 shadow-sm">
              <span className="text-3xl">{f.emoji}</span>
              <span className="text-xs font-medium text-gray-600">{f.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/auth/login"
            className="w-full bg-[#E63946] text-white py-4 rounded-2xl font-bold text-lg text-center active:scale-95 transition-all shadow-md"
          >
            Empezar gratis
          </Link>
          <Link
            href="/auth/register"
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-semibold text-center active:scale-95 transition-all"
          >
            Crear cuenta
          </Link>
        </div>
      </div>

      {/* Demo cards decoration */}
      <div className="pb-8 flex justify-center gap-3 px-4 overflow-hidden">
        {[
          { color: '#F4A261', emoji: '🍳', nombre: 'Huevos a la mexicana' },
          { color: '#E63946', emoji: '🫕', nombre: 'Sopa de fideos' },
          { color: '#2D6A4F', emoji: '🌙', nombre: 'Quesadillas de maíz' },
        ].map((card, i) => (
          <div
            key={card.nombre}
            className="flex-shrink-0 w-32 bg-white rounded-2xl overflow-hidden shadow-md"
            style={{ transform: i === 1 ? 'translateY(-8px)' : 'translateY(4px)' }}
          >
            <div className="h-20 flex items-center justify-center text-4xl" style={{ backgroundColor: card.color }}>
              {card.emoji}
            </div>
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-800 leading-tight">{card.nombre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
