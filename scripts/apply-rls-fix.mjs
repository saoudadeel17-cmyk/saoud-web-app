/**
 * Applies lib/db/fix-all-rls.sql to your Supabase database.
 *
 * Set DATABASE_URL in .env.local (Supabase → Project Settings → Database → Connection string URI)
 * Then run: node scripts/apply-rls-fix.mjs
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(root, '.env.local'), 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq)
      const val = trimmed.slice(eq + 1)
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    // ignore
  }
}

loadEnvLocal()

const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL

if (!databaseUrl) {
  console.error(
    'Missing DATABASE_URL.\n' +
      'Add to .env.local (from Supabase → Settings → Database → Connection string → URI):\n' +
      'DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres\n\n' +
      'Or paste lib/db/fix-all-rls.sql into Supabase SQL Editor and run it manually.'
  )
  process.exit(1)
}

const sql = readFileSync(resolve(root, 'lib/db/fix-all-rls.sql'), 'utf8')

const { default: postgres } = await import('postgres')

const sqlClient = postgres(databaseUrl, { ssl: 'require', max: 1 })

try {
  console.log('Applying RLS fix...')
  await sqlClient.unsafe(sql)
  console.log('Done. Refresh /dashboard/order')
} catch (err) {
  console.error('Failed:', err.message)
  process.exit(1)
} finally {
  await sqlClient.end()
}
