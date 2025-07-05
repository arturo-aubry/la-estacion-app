import './globals.css'
import Nav from '@/components/Nav'
import { ReactNode } from 'react'

export const metadata = {
  title: '¡Valora tu Ensalada!',
  description: 'Ve a LaEstación, compra y regístra.',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es-MX">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        {/* Navbar */}
        <Nav />

        {/* Main content */}
        <main className="flex-1 bg-gray-50">
          {children}
        </main>

        {/* Footer (opcional) */}
        <footer className="bg-white shadow-sm z-10 p-6 text-center text-sm text-gray-500">
          <strong>¡Valora tu Ensalada!</strong> fue creado con 💜 por{' '}
          <a
            href="https://aubry.com.mx"
            target="_blank"
            className="text-green-700 hover:underline transition-colors"
          >
            Arturo Aubry
          </a>
        </footer>
      </body>
    </html>
  )
}