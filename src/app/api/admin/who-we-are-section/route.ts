// app/api/admin/who-we-are-section/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const whoWeAreSection = await prisma.whoWeAreSection.upsert({
      where: { id: data.id || 'main' },
      update: {
        title: data.title,
        description: data.description,
        extras: data.extras,
        isActive: data.isActive,
      },
      create: {
        id: data.id || 'main',
        title: data.title,
        description: data.description,
        extras: data.extras,
        isActive: data.isActive,
      },
    })

    return NextResponse.json(whoWeAreSection)
  } catch (error) {
    console.error('Error saving who we are section:', error)
    return NextResponse.json(
      { error: 'Failed to save who we are section' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  return POST(request)
}
