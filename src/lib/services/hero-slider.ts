// lib/services/hero-slider.ts
import { prisma } from '@/lib/prisma'

export interface HeroSlide {
  id: string
  backgroundImage?: string | null
  welcomeText?: string | null
  titleLines: string[]
  description: string
  buttonText?: string | null
  buttonLink?: string | null
  buttonType: string
  isActive: boolean
  sortOrder: number
}

export interface HeroSlider {
  id: string
  page: string
  slides: HeroSlide[]
  autoplay: boolean
  autoplaySpeed: number
  showDots: boolean
  showArrows: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Get hero slider for a specific page
 */
export async function getHeroSliderByPage(page: string): Promise<HeroSlider | null> {
  try {
    const heroSlider = await prisma.heroSlider.findUnique({
      where: { 
        page,
        isActive: true
      },
      include: {
        slides: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return heroSlider
  } catch (error) {
    console.error('Error fetching hero slider:', error)
    return null
  }
}

/**
 * Get all hero sliders (for admin)
 */
export async function getAllHeroSliders(): Promise<HeroSlider[]> {
  try {
    const heroSliders = await prisma.heroSlider.findMany({
      include: {
        slides: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { page: 'asc' }
    })

    return heroSliders
  } catch (error) {
    console.error('Error fetching hero sliders:', error)
    return []
  }
}

/**
 * Get hero slider by ID (for admin editing)
 */
export async function getHeroSliderById(id: string): Promise<HeroSlider | null> {
  try {
    const heroSlider = await prisma.heroSlider.findUnique({
      where: { id },
      include: {
        slides: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return heroSlider
  } catch (error) {
    console.error('Error fetching hero slider by ID:', error)
    return null
  }
}

/**
 * Check if a page has an active hero slider
 */
export async function hasActiveHeroSlider(page: string): Promise<boolean> {
  try {
    const count = await prisma.heroSlider.count({
      where: {
        page,
        isActive: true,
        slides: {
          some: {
            isActive: true
          }
        }
      }
    })

    return count > 0
  } catch (error) {
    console.error('Error checking for active hero slider:', error)
    return false
  }
}

/**
 * Get pages that have hero sliders
 */
export async function getPagesWithHeroSliders(): Promise<string[]> {
  try {
    const heroSliders = await prisma.heroSlider.findMany({
      select: { page: true },
      where: { isActive: true },
      orderBy: { page: 'asc' }
    })

    return heroSliders.map(slider => slider.page)
  } catch (error) {
    console.error('Error fetching pages with hero sliders:', error)
    return []
  }
}