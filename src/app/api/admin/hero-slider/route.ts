// app/api/admin/hero-slider/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

// Type definitions
interface HeroSlideInput {
  id?: string
  backgroundImage?: string
  welcomeText?: string
  titleLines: [string, string, string]
  description: string
  buttonText?: string
  buttonLink?: string
  buttonType: 'internal' | 'anchor'
  isActive: boolean
}

interface HeroSliderInput {
  id?: string
  page: string
  slides: HeroSlideInput[]
  autoplay: boolean
  autoplaySpeed: number
  showDots: boolean
  showArrows: boolean
  isActive: boolean
}

// GET - Fetch hero slider by page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (!page) {
      return NextResponse.json(
        { error: 'Page parameter is required' },
        { status: 400 }
      )
    }

    const heroSlider = await prisma.heroSlider.findUnique({
      where: { page },
      include: {
        slides: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!heroSlider) {
      return NextResponse.json({ heroSlider: null })
    }

    return NextResponse.json({ heroSlider })
  } catch (error) {
    console.error('Error fetching hero slider:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero slider' },
      { status: 500 }
    )
  }
}

// POST - Create new hero slider
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data: HeroSliderInput = await request.json()

    // Validate required fields
    if (!data.page || !data.slides || data.slides.length === 0) {
      return NextResponse.json(
        { error: 'Page and slides are required' },
        { status: 400 }
      )
    }

    // Check if hero slider already exists for this page
    const existingSlider = await prisma.heroSlider.findUnique({
      where: { page: data.page }
    })

    if (existingSlider) {
      return NextResponse.json(
        { error: 'Hero slider already exists for this page' },
        { status: 409 }
      )
    }

    // Create hero slider with slides
    const heroSlider = await prisma.heroSlider.create({
      data: {
        page: data.page,
        autoplay: data.autoplay,
        autoplaySpeed: data.autoplaySpeed,
        showDots: data.showDots,
        showArrows: data.showArrows,
        isActive: data.isActive,
        slides: {
          create: data.slides.map((slide, index) => ({
            backgroundImage: slide.backgroundImage || null,
            welcomeText: slide.welcomeText || null,
            titleLines: slide.titleLines,
            description: slide.description,
            buttonText: slide.buttonText || null,
            buttonLink: slide.buttonLink || null,
            buttonType: slide.buttonType,
            isActive: slide.isActive,
            sortOrder: index
          }))
        }
      },
      include: {
        slides: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return NextResponse.json({
      message: 'Hero slider created successfully',
      heroSlider
    })
  } catch (error) {
    console.error('Error creating hero slider:', error)
    return NextResponse.json(
      { error: 'Failed to create hero slider' },
      { status: 500 }
    )
  }
}

// PUT - Update existing hero slider
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data: HeroSliderInput = await request.json()

    // Validate required fields
    if (!data.id || !data.page || !data.slides || data.slides.length === 0) {
      return NextResponse.json(
        { error: 'ID, page, and slides are required' },
        { status: 400 }
      )
    }

    // Check if hero slider exists
    const existingSlider = await prisma.heroSlider.findUnique({
      where: { id: data.id },
      include: { slides: true }
    })

    if (!existingSlider) {
      return NextResponse.json(
        { error: 'Hero slider not found' },
        { status: 404 }
      )
    }

    // Use transaction to update slider and slides
    const heroSlider = await prisma.$transaction(async (tx) => {
      // Delete existing slides
      await tx.heroSlide.deleteMany({
        where: { heroSliderId: data.id }
      })

      // Update hero slider and create new slides
      return await tx.heroSlider.update({
        where: { id: data.id },
        data: {
          page: data.page,
          autoplay: data.autoplay,
          autoplaySpeed: data.autoplaySpeed,
          showDots: data.showDots,
          showArrows: data.showArrows,
          isActive: data.isActive,
          slides: {
            create: data.slides.map((slide, index) => ({
              backgroundImage: slide.backgroundImage || null,
              welcomeText: slide.welcomeText || null,
              titleLines: slide.titleLines,
              description: slide.description,
              buttonText: slide.buttonText || null,
              buttonLink: slide.buttonLink || null,
              buttonType: slide.buttonType,
              isActive: slide.isActive,
              sortOrder: index
            }))
          }
        },
        include: {
          slides: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      })
    })

    return NextResponse.json({
      message: 'Hero slider updated successfully',
      heroSlider
    })
  } catch (error) {
    console.error('Error updating hero slider:', error)
    return NextResponse.json(
      { error: 'Failed to update hero slider' },
      { status: 500 }
    )
  }
}

// DELETE - Delete hero slider
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }

    // Check if hero slider exists
    const existingSlider = await prisma.heroSlider.findUnique({
      where: { id }
    })

    if (!existingSlider) {
      return NextResponse.json(
        { error: 'Hero slider not found' },
        { status: 404 }
      )
    }

    // Delete hero slider (slides will be deleted automatically due to cascade)
    await prisma.heroSlider.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Hero slider deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting hero slider:', error)
    return NextResponse.json(
      { error: 'Failed to delete hero slider' },
      { status: 500 }
    )
  }
}