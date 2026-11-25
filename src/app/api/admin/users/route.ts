// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { requireAdmin, userSafeSelect, normalizeRole } from '@/lib/api-auth'

const MIN_PASSWORD = 10

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' }, select: userSafeSelect })
    return NextResponse.json(users)
  } catch (e) {
    console.error('Error fetching users:', e)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const data = await request.json()
    if (!data?.email?.trim() || !data?.password || !data?.name?.trim()) {
      return NextResponse.json({ error: 'name, email and password are required' }, { status: 400 })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (String(data.password).length < MIN_PASSWORD) {
      return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD} characters` }, { status: 400 })
    }
    const hashed = await bcrypt.hash(String(data.password), 12)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        image: data.image ?? null,
        role: normalizeRole(data.role),
        email: String(data.email).trim().toLowerCase(),
        password: hashed,
      },
      select: userSafeSelect,
    })
    return NextResponse.json(user, { status: 201 })
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
    console.error('Error creating user:', e)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
