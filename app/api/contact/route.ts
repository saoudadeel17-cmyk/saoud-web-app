import { NextResponse } from 'next/server'
import { sendContactFormEmail } from '@/lib/emails/contactForm'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const subject = String(body.subject ?? '').trim()
    const message = String(body.message ?? '').trim()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters.' },
        { status: 400 }
      )
    }

    await sendContactFormEmail({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to send message. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
