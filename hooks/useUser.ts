'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export function useUser() {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function loadProfile(authUserId: string, email?: string) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .single()

      if (profile) {
        setUser({ ...profile, email: email ?? profile.email ?? '' })
      }
      setLoading(false)
    }

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        loadProfile(authUser.id, authUser.email)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
