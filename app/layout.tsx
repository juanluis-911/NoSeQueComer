import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import InstallPWA from '@/components/InstallPWA'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NoSeQuéComer',
  description: 'Descubre recetas mexicanas cotidianas con un swipe',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NoSeQuéComer',
    startupImage: '/ios/1024.png',
  },
  icons: {
    apple: [
      { url: '/ios/180.png', sizes: '180x180' },
      { url: '/ios/167.png', sizes: '167x167' },
      { url: '/ios/152.png', sizes: '152x152' },
      { url: '/ios/120.png', sizes: '120x120' },
      { url: '/ios/87.png',  sizes: '87x87'  },
      { url: '/ios/80.png',  sizes: '80x80'  },
      { url: '/ios/76.png',  sizes: '76x76'  },
      { url: '/ios/60.png',  sizes: '60x60'  },
      { url: '/ios/57.png',  sizes: '57x57'  },
    ],
    icon: [
      { url: '/android/launchericon-192x192.png', sizes: '192x192' },
      { url: '/android/launchericon-512x512.png', sizes: '512x512' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#E63946',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-[#FAFAFA]`}>
        {children}
        <InstallPWA />
        <Analytics />
      </body>
    </html>
  )
}
