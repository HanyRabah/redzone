// app/api/admin/hero-sections/route.ts
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
    
    const heroSection = await prisma.heroSection.upsert({
      where: { page: data.page },
      update: {
        backgroundImage: data.backgroundImage,
        theme: data.theme,
        welcomeText: data.welcomeText,
        titleLines: data.titleLines,
        descriptionLines: data.descriptionLines,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        isActive: data.isActive,
      },
      create: {
        page: data.page,
        backgroundImage: data.backgroundImage,
        theme: data.theme,
        welcomeText: data.welcomeText,
        titleLines: data.titleLines,
        descriptionLines: data.descriptionLines,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        isActive: data.isActive,
      },
    })

    return NextResponse.json(heroSection)
  } catch (error) {
    console.error('Error saving hero section:', error)
    return NextResponse.json(
      { error: 'Failed to save hero section' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  return POST(request) // Same logic for upsert
}