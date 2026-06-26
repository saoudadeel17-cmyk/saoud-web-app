'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export const PROFILE_UPDATED_EVENT = 'saqr:profile-updated'

function profileFromAuth(
  authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }
): Profile {
  const meta = authUser.user_metadata ?? {}
  return {
    id: authUser.id,
    full_name: String(meta.full_name ?? meta.name ?? '').trim(),
    email: authUser.email ?? '',
    phone: typeof meta.phone === 'string' ? meta.phone : undefined,
    role: 'customer',
    created_at: new Date().toISOString(),
  }
}

export function useUser() {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(
    async (authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }) => {
      const supabase = createClient()
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profile) {
          setUser({
            ...profile,
            email: authUser.email ?? profile.email ?? '',
          })
        } else {
          setUser(profileFromAuth(authUser))
        }
      } catch {
        setUser(profileFromAuth(authUser))
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setLoading(true)
        loadProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    const onProfileUpdated = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) loadProfile(session.user)
      })
    }
    window.addEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated)
    }
  }, [loadProfile])

  return { user, loading }
}
