'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPWA() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Si ya está en modo standalone (instalada), no mostrar nada
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)

    if (isStandalone) return

    // Si ya descartó el banner en esta sesión, no molestar
    if (sessionStorage.getItem('pwa-dismissed')) return

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      // Pequeño delay para no aparecer de golpe al cargar
      setTimeout(() => setVisible(true), 2000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
      setPrompt(null)
    }
  }

  function handleDismiss() {
    setVisible(false)
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-4 right-4 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4">
            {/* Ícono */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#E63946] flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight">
                Instala NoSeQuéComer
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Úsala desde tu pantalla de inicio, sin browser
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={handleInstall}
                className="bg-[#E63946] text-white text-xs font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-all whitespace-nowrap"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-400 text-xs text-center active:scale-95 transition-all"
              >
                Ahora no
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
