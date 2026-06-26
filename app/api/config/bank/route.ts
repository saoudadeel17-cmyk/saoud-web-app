import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    bank_name: process.env.BANK_NAME ?? '',
    bank_account_title: process.env.BANK_ACCOUNT_TITLE ?? '',
    bank_account_number: process.env.BANK_ACCOUNT_NUMBER ?? '',
    bank_iban: process.env.BANK_IBAN ?? '',
  })
}
