'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser, PROFILE_UPDATED_EVENT } from '@/hooks/useUser'
import Icon from '@/components/ui/Icon'

export default function DashboardProfilePage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [form, setForm] = useState({ full_name: '', phone: '' })
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ full_name: user.full_name ?? '', phone: user.phone ?? '' })
    }
  }, [user])

  async function save() {
    if (!user) return
    setSaving(true)
    setFeedback(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, phone: form.phone })
      .eq('id', user.id)

    setSaving(false)
    if (error) {
      setFeedback({ type: 'error', text: error.message })
      return
    }
    setFeedback({ type: 'success', text: 'Profile updated successfully' })
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT))
    router.refresh()
  }

  if (userLoading) {
    return (
      <div className="dashboard-content">
        <div className="skeleton" style={{ height: 36, width: 160, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 320, borderRadius: 12 }} />
      </div>
    )
  }

  return (
    <div className="dashboard-content">
      <header className="dashboard-page-header">
        <h1>My Profile</h1>
        <p className="dashboard-page-subtitle">Manage your personal information</p>
      </header>

      <div className="dashboard-profile-form dashboard-profile-form--full">
        <div className="dashboard-field-group">
          <label htmlFor="profile-name">Full Name</label>
          <input
            id="profile-name"
            className="input-full"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>

        <div className="dashboard-field-group">
          <label htmlFor="profile-phone">Phone Number</label>
          <input
            id="profile-phone"
            className="input-full"
            type="tel"
            placeholder="03XX XXXXXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <p className="dashboard-field-hint">Pakistan format: 03XX XXXXXXX</p>
        </div>

        <div className="dashboard-field-group">
          <label htmlFor="profile-email">Email</label>
          <div className="dashboard-readonly-field">
            <Icon name="lock" size={16} />
            <input
              id="profile-email"
              className="input-full"
              value={user?.email ?? ''}
              readOnly
              disabled
              title="Email cannot be changed here"
            />
          </div>
          <p className="dashboard-field-hint">Email cannot be changed here</p>
        </div>

        {feedback && (
          <div
            className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}
            role="alert"
          >
            <Icon name={feedback.type === 'success' ? 'check' : 'alert'} size={16} />
            <span>{feedback.text}</span>
          </div>
        )}

        <button type="button" className="btn dashboard-save-btn" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
