
// app/api/admin/categories/rename/route.ts
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

    const { oldName, newName } = await request.json()

    if (!oldName || !newName) {
      return NextResponse.json({ error: 'Old and new category names are required' }, { status: 400 })
    }

    // Check if new category name already exists
    const existingCategory = await prisma.project.findFirst({
      where: {
        category: {
          name: {
            equals: newName,
            mode: 'insensitive'
          }
        }
      }
    })

    if (existingCategory && existingCategory.categoryId !== oldName) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Update all projects with the old category name
    await prisma.project.updateMany({
      where: {
        categoryId: oldName
      },
      data: {
        categoryId: newName
      }
    })

    return NextResponse.json({ message: 'Category renamed successfully' })
  } catch (error) {
    console.error('Error renaming category:', error)
    return NextResponse.json(
      { error: 'Failed to rename category' },
      { status: 500 }
    )
  }
}
