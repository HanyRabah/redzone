
// app/api/admin/team-section/route.ts
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
    
    const teamSection = await prisma.teamSection.upsert({
      where: { id: data.id || 'main' },
      update: {
        smallTitle: data.smallTitle,
        titleLines: data.titleLines,
        isActive: data.isActive,
      },
      create: {
        id: data.id || 'main',
        smallTitle: data.smallTitle,
        titleLines: data.titleLines,
        isActive: data.isActive,
      },
    })

    return NextResponse.json(teamSection)
  } catch (error) {
    console.error('Error saving team section:', error)
    return NextResponse.json(
      { error: 'Failed to save team section' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  return POST(request)
}
