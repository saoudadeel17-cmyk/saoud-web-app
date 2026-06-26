'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Icon from '@/components/ui/Icon'
import { siteConfig } from '@/lib/site'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export default function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setFeedback({ type: 'error', text: data.error ?? 'Failed to send message.' })
        return
      }

      setFeedback({
        type: 'success',
        text: 'Thank you! Your message has been sent. We will get back to you soon.',
      })
      setForm(initialForm)
    } catch {
      setFeedback({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <Navbar />

      <section className="section">
        <h1>Contact SAQR Heritage Exports</h1>
        <p className="contact-intro">
          We export Persian rugs, Arabian mats, and handmade traditional crafts worldwide.
          Reach out for bulk orders, wholesale pricing, or shipping inquiries.
        </p>

        <div className="contactLayout">
          <div className="contactAside">
            <div className="contactGrid">
              <div className="contactCard">
                <h3>
                  <Icon name="mail" size={16} />
                  Email
                </h3>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </div>
              <div className="contactCard">
                <h3>
                  <Icon name="phone" size={16} />
                  WhatsApp
                </h3>
                <a href={siteConfig.whatsapp.href} target="_blank" rel="noopener noreferrer">
                  {siteConfig.whatsapp.display}
                </a>
              </div>
              <div className="contactCard">
                <h3>
                  <Icon name="clock" size={16} />
                  Business Hours
                </h3>
                <span className="contact-card-value">Mon – Sat, 9am – 8pm PKT</span>
              </div>
              <div className="contactCard">
                <h3>
                  <Icon name="globe" size={16} />
                  Based In
                </h3>
                <span className="contact-card-value">Pakistan · Exporting Worldwide</span>
              </div>
            </div>
          </div>

          <form className="contactForm" onSubmit={handleSubmit}>
            <h2>Send us a message</h2>
            <p className="contact-form-note">Fill out the form and our team will reply by email.</p>

            {feedback && (
              <div
                className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}
                role="alert"
              >
                <Icon name={feedback.type === 'success' ? 'check' : 'alert'} size={16} />
                <span>{feedback.text}</span>
              </div>
            )}

            <label htmlFor="contact-name">Full Name *</label>
            <input
              id="contact-name"
              className="input-full"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <label htmlFor="contact-email">Email *</label>
            <input
              id="contact-email"
              className="input-full"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <label htmlFor="contact-phone">Phone (optional)</label>
            <input
              id="contact-phone"
              className="input-full"
              type="tel"
              placeholder="03XX XXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <label htmlFor="contact-subject">Subject *</label>
            <select
              id="contact-subject"
              className="input-full"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            >
              <option value="">Select a topic</option>
              <option value="Wholesale / Bulk Order">Wholesale / Bulk Order</option>
              <option value="Product Inquiry">Product Inquiry</option>
              <option value="Shipping & Export">Shipping & Export</option>
              <option value="Custom Order">Custom Order</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="contact-message">Message *</label>
            <textarea
              id="contact-message"
              className="input-full"
              rows={6}
              placeholder="Tell us what you need — quantities, designs, destination country, etc."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
