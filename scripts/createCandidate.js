import { createClient } from '@supabase/supabase-js'

// Usage: node ./scripts/createCandidate.js --name "Jane Doe" --email "jane@example.com" --role "Engineer"

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const val = args[i + 1]
      out[key] = val
      i++
    }
  }
  return out
}

async function main() {
  const args = parseArgs()
  const name = args.name
  const email = args.email
  const role = args.role || ''

  if (!name || !email) {
    console.error('Usage: --name "Jane Doe" --email "jane@example.com" [--role "Role"]')
    process.exit(1)
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL/SUPABASE_ANON_KEY)')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const resp = await supabase.from('candidates').insert([{ name, email, role }]).select('id').single()
    if (resp.error) {
      console.error('Supabase insert error:', resp.error)
      process.exit(1)
    }
    const id = resp.data && resp.data.id
    if (!id) {
      console.error('No id returned from Supabase insert')
      process.exit(1)
    }
    const url = `${process.env.APP_ORIGIN || 'http://localhost:5175'}/interview?candidateId=${encodeURIComponent(id)}`
    console.log('Candidate successfully created')
    console.log('Candidate ID:', id)
    console.log('Interview URL:')
    console.log(url)
    process.exit(0)
  } catch (err) {
    console.error('Unexpected error', err)
    process.exit(1)
  }
}

main()
