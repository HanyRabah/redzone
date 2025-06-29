
// app/api/admin/contact-submissions/stats/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalSubmissions,
      unreadSubmissions,
      repliedSubmissions,
      todaySubmissions,
      thisWeekSubmissions,
      recentSubmissions
    ] = await Promise.all([
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.contactSubmission.count({ where: { isReplied: true } }),
      prisma.contactSubmission.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.contactSubmission.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.contactSubmission.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          message: true,
          isRead: true,
          isReplied: true,
          createdAt: true
        }
      })
    ])

    const responseRate = totalSubmissions > 0 ? Math.round((repliedSubmissions / totalSubmissions) * 100) : 0

    return NextResponse.json({
      totalSubmissions,
      unreadSubmissions,
      repliedSubmissions,
      todaySubmissions,
      thisWeekSubmissions,
      responseRate,
      recentSubmissions
    })
  } catch (error) {
    console.error('Error fetching contact stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact stats' },
      { status: 500 }
    )
  }
}