// app/api/user/route.ts  (admin-only user management)
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
    const body = await request.json()
    if (!body?.email?.trim() || !body?.password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (String(body.password).length < MIN_PASSWORD) {
      return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD} characters` }, { status: 400 })
    }
    const hashed = await bcrypt.hash(String(body.password), 12)
    const user = await prisma.user.create({
      data: {
        name: body.name ?? null,
        email: String(body.email).trim().toLowerCase(),
        role: normalizeRole(body.role),
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

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const body = await request.json()
    if (!body?.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    let hashedPassword: string | undefined
    if (body.password) {
      if (String(body.password).length < MIN_PASSWORD) {
        return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD} characters` }, { status: 400 })
      }
      hashedPassword = await bcrypt.hash(String(body.password), 12)
    }

    const user = await prisma.user.update({
      where: { id: body.id },
      data: {
        name: body.name,
        email: body.email ? String(body.email).trim().toLowerCase() : undefined,
        ...(body.role ? { role: normalizeRole(body.role) } : {}),
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
      select: userSafeSelect,
    })
    return NextResponse.json(user)
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
    console.error('Error updating user:', e)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAdmin()
  if (error) return error
  try {
    const body = await request.json().catch(() => ({}))
    const id = body?.id
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    if (id === session?.user?.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
    }
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ message: 'User deleted' })
  } catch (e) {
    console.error('Error deleting user:', e)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
