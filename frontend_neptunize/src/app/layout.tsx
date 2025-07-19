import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { BottomNav } from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'PodcastAI - AI-Powered Podcast Generation',
  description: 'Create amazing podcasts with AI storytelling',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PodcastAI'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="h-full mobile-container">
        <Providers>
          <div className="flex flex-col h-full">
            <main className="flex-1 pb-20">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  )
}
