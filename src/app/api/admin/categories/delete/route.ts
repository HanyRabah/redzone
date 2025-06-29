
// app/api/admin/categories/delete/route.ts
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

    const { categoryName, moveToUncategorized } = await request.json()

    if (!categoryName) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    if (moveToUncategorized) {
      // Move all projects in this category to "Uncategorized"
      await prisma.project.updateMany({
        where: {
          category: categoryName
        },
        data: {
          category: 'Uncategorized'
        }
      })
    } else {
      // Delete all projects in this category
      await prisma.project.deleteMany({
        where: {
          category: categoryName
        }
      })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
