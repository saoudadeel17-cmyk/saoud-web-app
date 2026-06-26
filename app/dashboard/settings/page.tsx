'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import Icon from '@/components/ui/Icon'
import { getInitials } from '@/lib/dashboard/helpers'

export default function DashboardSettingsPage() {
  const { user, loading: userLoading } = useUser()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  })
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [orderUpdates, setOrderUpdates] = useState(true)
  const [promoEmails, setPromoEmails] = useState(false)
  const [prefsMsg, setPrefsMsg] = useState<string | null>(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null)

  async function changePassword() {
    setPasswordMsg(null)
    if (!passwords.next || passwords.next.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' })
      return
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    setPasswordLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: passwords.next })
    setPasswordLoading(false)

    if (error) {
      setPasswordMsg({ type: 'error', text: error.message })
      return
    }
    setPasswordMsg({ type: 'success', text: 'Password updated successfully.' })
    setPasswords({ current: '', next: '', confirm: '' })
    setShowPasswordForm(false)
  }

  function savePreferences() {
    setPrefsMsg('Preferences saved.')
    setTimeout(() => setPrefsMsg(null), 3000)
  }

  function handleDeleteConfirm() {
    if (deleteConfirm !== 'DELETE') return
    setDeleteMsg('Please contact support to delete your account.')
    setShowDeleteModal(false)
    setDeleteConfirm('')
  }

  if (userLoading) {
    return (
      <div className="dashboard-content">
        <div className="skeleton" style={{ height: 36, width: 160, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
      </div>
    )
  }

  const displayName = user?.full_name?.trim() || user?.email?.split('@')[0] || 'Account'
  const email = user?.email ?? ''

  return (
    <div className="dashboard-content">
      <header className="dashboard-page-header">
        <h1>Settings</h1>
        <p className="dashboard-page-subtitle">Security, notifications, and account</p>
      </header>

      <div className="dashboard-account-card">
        <div className="dashboard-avatar" aria-hidden="true">
          {getInitials(user?.full_name ?? '', email)}
        </div>
        <div className="dashboard-account-info">
          <p className="dashboard-account-name">{displayName}</p>
          {email && <p className="dashboard-account-email">{email}</p>}
        </div>
      </div>

      <section className="dashboard-settings-section">
        <h2>Security</h2>
        {!showPasswordForm ? (
          <button
            type="button"
            className="btn-outline dashboard-settings-btn"
            onClick={() => setShowPasswordForm(true)}
          >
            <Icon name="shield" size={16} />
            Change Password
          </button>
        ) : (
          <div className="dashboard-settings-form">
            <div className="dashboard-field-group">
              <label htmlFor="current-pw">Current Password</label>
              <input
                id="current-pw"
                className="input-full"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
            </div>
            <div className="dashboard-field-group">
              <label htmlFor="new-pw">New Password</label>
              <input
                id="new-pw"
                className="input-full"
                type="password"
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              />
            </div>
            <div className="dashboard-field-group">
              <label htmlFor="confirm-pw">Confirm New Password</label>
              <input
                id="confirm-pw"
                className="input-full"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
            </div>
            {passwordMsg && (
              <div className={`alert ${passwordMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                <Icon name={passwordMsg.type === 'success' ? 'check' : 'alert'} size={16} />
                <span>{passwordMsg.text}</span>
              </div>
            )}
            <div className="dashboard-settings-form-actions">
              <button type="button" className="btn" onClick={changePassword} disabled={passwordLoading}>
                {passwordLoading ? 'Saving...' : 'Save Password'}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setShowPasswordForm(false)
                  setPasswordMsg(null)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <hr className="dashboard-divider" />

      <section className="dashboard-settings-section">
        <h2>Notifications</h2>
        <div className="dashboard-toggle-list">
          <div className="dashboard-toggle-row">
            <div className="dashboard-toggle-copy">
              <p className="dashboard-toggle-label">Order status updates</p>
              <p className="dashboard-toggle-desc">Get notified when your order status changes</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={orderUpdates}
                onChange={(e) => setOrderUpdates(e.target.checked)}
              />
              <span className="toggle-track" />
            </label>
          </div>
          <div className="dashboard-toggle-row">
            <div className="dashboard-toggle-copy">
              <p className="dashboard-toggle-label">Promotional emails</p>
              <p className="dashboard-toggle-desc">Offers, new collections, and wholesale news</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={promoEmails}
                onChange={(e) => setPromoEmails(e.target.checked)}
              />
              <span className="toggle-track" />
            </label>
          </div>
        </div>
        {prefsMsg && (
          <div className="alert alert-success" role="status">
            <Icon name="check" size={16} />
            <span>{prefsMsg}</span>
          </div>
        )}
        <button type="button" className="btn-outline dashboard-settings-btn" onClick={savePreferences}>
          Save Preferences
        </button>
      </section>

      <hr className="dashboard-divider" />

      <section className="dashboard-settings-section dashboard-danger-zone">
        <h2>Danger Zone</h2>
        <p className="dashboard-danger-text">
          Permanently delete your account and all associated data.
        </p>
        <button type="button" className="btn-danger" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </button>
        {deleteMsg && (
          <div className="alert alert-warning">
            <Icon name="alert" size={16} />
            <span>{deleteMsg}</span>
          </div>
        )}
      </section>

      {showDeleteModal && (
        <div className="dashboard-modal-backdrop" role="presentation">
          <div className="dashboard-modal" role="dialog" aria-labelledby="delete-modal-title">
            <h3 id="delete-modal-title">Delete Account</h3>
            <p>Are you sure? This cannot be undone.</p>
            <p className="dashboard-field-hint">Type <strong>DELETE</strong> to confirm</p>
            <input
              className="input-full"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
            />
            <div className="dashboard-modal-actions">
              <button type="button" className="btn-outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                disabled={deleteConfirm !== 'DELETE'}
                onClick={handleDeleteConfirm}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
