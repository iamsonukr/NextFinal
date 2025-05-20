// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/src/contexts/SessionProvider'
import { getServerSession } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'E-Commerce App',
  description: 'Modern e-commerce application built with Next.js',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider session={session}>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}