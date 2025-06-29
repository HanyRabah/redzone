// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.siteSettings.findMany()
    
    // Convert to object for easier use
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json(settingsObject)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Update each setting
    const settingsToUpdate = [
      'siteName',
      'siteDescription', 
      'siteUrl',
      'siteLogo',
      'favicon',
      'contactEmail',
      'contactPhone',
      'socialFacebook',
      'socialTwitter',
      'socialInstagram',
      'socialLinkedin',
      'googleAnalytics',
      'maintenanceMode',
      'seoDefaultTitle',
      'seoDefaultDescription'
    ]

    for (const key of settingsToUpdate) {
      if (data[key] !== undefined) {
        await prisma.siteSettings.upsert({
          where: { key },
          update: { value: data[key] },
          create: { 
            key, 
            value: data[key] 
          }
        })
      }
    }

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
