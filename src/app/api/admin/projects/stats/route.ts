
// app/api/admin/projects/stats/route.ts
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
      totalProjects,
      activeProjects,
      featuredProjects,
      categories,
      recentProjects
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { isActive: true } }),
      prisma.project.count({ where: { isFeatured: true } }),
      prisma.project.groupBy({
        by: ['category'],
        _count: {
          id: true
        }
      }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          category: true,
          isActive: true,
          isFeatured: true,
          createdAt: true
        }
      })
    ])

    const categoryStats = categories.map(cat => ({
      name: cat.category,
      count: cat._count.id
    }))

    return NextResponse.json({
      totalProjects,
      activeProjects,
      featuredProjects,
      totalCategories: categories.length,
      categories: categoryStats,
      recentProjects
    })
  } catch (error) {
    console.error('Error fetching portfolio stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio stats' },
      { status: 500 }
    )
  }
}