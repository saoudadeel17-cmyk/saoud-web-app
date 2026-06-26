import { getResend } from '@/lib/resend'

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

const CONTACT_TO = process.env.CONTACT_EMAIL ?? 'saoudadeel17@gmail.com'

export async function sendContactFormEmail(data: ContactFormData) {
  const resend = getResend()
  if (!resend) {
    throw new Error('Email service is not configured. Please set RESEND_API_KEY in your environment.')
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? 'SAQR Heritage <onboarding@resend.dev>'

  const { error } = await resend.emails.send({
    from,
    to: CONTACT_TO,
    replyTo: data.email,
    subject: `[SAQR Contact] ${data.subject}`,
    text: [
      'New contact form submission',
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      `Subject: ${data.subject}`,
      '',
      'Message:',
      data.message,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  if (error) {
    throw new Error(error.message)
  }
}
