import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If env vars are missing, export a harmless noop client so the app doesn't crash during dev.
// Real projects should set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file.
let supabase: any
if (supabaseUrl && supabaseAnonKey) {
	supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
	supabase = {
		from: (_table: string) => ({
			select: (_q: string) => ({
				eq: (_col: string, _val: any) => ({
					single: async () => ({ data: null, error: new Error('Supabase not configured') }),
				}),
			}),
		}),
	}
}

export { supabase }
export default supabase
