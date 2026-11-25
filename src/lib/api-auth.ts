// src/lib/api-auth.ts
// Shared authentication/authorization guards for API route handlers.
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { NextResponse } from 'next/server'

// Columns safe to return to clients. Never includes `password`.
export const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  bio: true,
  createdAt: true,
  updatedAt: true,
} as const

// Valid roles in the app. Anything else is coerced to the least-privileged.
export const ROLES = ['admin', 'author'] as const
export function normalizeRole(role: unknown): string {
  return (ROLES as readonly string[]).includes(role as string) ? (role as string) : 'author'
}

/** Require any authenticated user. Returns { session, error }; if error is set, return it. */
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { session, error: null as null }
}

/** Require an authenticated user whose role is exactly "admin". */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  if (session.user.role !== 'admin') {
    return { session: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { session, error: null as null }
}
