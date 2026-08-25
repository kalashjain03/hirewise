import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function loadDotEnv() {
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^([^#=\s]+)=(.*)$/)
    if (!m) continue
    const key = m[1]
    let val = m[2]
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

async function main() {
  loadDotEnv()
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error('Supabase env vars not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
    process.exit(1)
  }
  const supabase = createClient(url, key)
  try {
    const { data, error } = await supabase.from('candidates').select('*').limit(1).single()
    if (error) {
      console.error('Supabase query error:', error)
      process.exit(1)
    }
    if (!data) {
      console.log('No candidates found in table')
      process.exit(0)
    }
    console.log('One candidate row:')
    console.log(JSON.stringify(data, null, 2))
    console.log('\nColumns:')
    console.log(Object.keys(data).join(', '))
    if (data.id) console.log('\nFound id value:', data.id)
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
}

main()
