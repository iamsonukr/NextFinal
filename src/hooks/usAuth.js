// src/hooks/useAuth.js
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth(requireAuth = false, requireAdmin = false) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (requireAuth && status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (requireAdmin && session?.user?.role !== 'admin') {
      router.push('/')
      return
    }
  }, [session, status, requireAuth, requireAdmin, router])

  return {
    user: session?.user,
    loading: status === 'loading',
    authenticated: status === 'authenticated',
    isAdmin: session?.user?.role === 'admin',
  }
}