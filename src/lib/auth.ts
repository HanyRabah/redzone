import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return session
}

export async function getSession() {
  return await getServerSession(authOptions)
}