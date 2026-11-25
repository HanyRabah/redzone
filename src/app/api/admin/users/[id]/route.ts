// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { requireAdmin, userSafeSelect, ROLES } from '@/lib/api-auth'

type PageProps = { params: Promise<{ id: string }> }

const MIN_PASSWORD = 10
const roleOrUndefined = (r: unknown) =>
  (ROLES as readonly string[]).includes(r as string) ? (r as string) : undefined

export async function PUT(request: NextRequest, { params }: PageProps) {
  const { error } = await requireAdmin()
  if (error) return error
  try {
    const data = await request.json()
    const { id } = await params

    let hashedPassword: string | undefined
    if (data.password) {
      if (String(data.password).length < MIN_PASSWORD) {
        return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD} characters` }, { status: 400 })
      }
      hashedPassword = await bcrypt.hash(String(data.password), 12)
    }
    const role = roleOrUndefined(data.role)

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image,
        email: data.email ? String(data.email).trim().toLowerCase() : undefined,
        ...(role ? { role } : {}),
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

export async function DELETE(request: NextRequest, { params }: PageProps) {
  const { session, error } = await requireAdmin()
  if (error) return error
  try {
    const { id } = await params
    if (id === session?.user?.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
    }
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (e) {
    console.error('Error deleting user:', e)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
