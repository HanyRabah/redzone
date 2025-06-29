
// app/api/admin/about-us-section/route.ts
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
    
    const aboutUsSection = await prisma.aboutUsSection.upsert({
      where: { id: data.id || 'main' },
      update: {
        titleLines: data.titleLines,
        contentLines: data.contentLines,
        closeLine: data.closeLine,
        isActive: data.isActive,
      },
      create: {
        id: data.id || 'main',
        titleLines: data.titleLines,
        contentLines: data.contentLines,
        closeLine: data.closeLine,
        isActive: data.isActive,
      },
    })

    return NextResponse.json(aboutUsSection)
  } catch (error) {
    console.error('Error saving about us section:', error)
    return NextResponse.json(
      { error: 'Failed to save about us section' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  return POST(request)
}