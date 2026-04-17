import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/setup'

  if (token_hash && type) {
    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Email confirmed successfully
      return NextResponse.redirect(new URL(`${next}?confirmed=true`, request.url))
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/login?error=confirmation_failed', request.url))
}
