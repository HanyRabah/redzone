
// app/api/admin/categories/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

type PageProps = {
  params: Promise<{ id: string }>;
};



export async function DELETE(request: NextRequest, { params }: PageProps) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const moveToUncategorized = request.nextUrl.searchParams.get('moveToUncategorized')
    if (moveToUncategorized) {
      // Move all projects in this category to "Uncategorized"
      await prisma.project.updateMany({
        where: {
          categoryId: id
        },
        data: {
          categoryId: 'Uncategorized'
        }
      })
    } else {
      // Delete all projects in this category
      await prisma.projectCategory.delete({
        where: { id }
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


export async function PATCH(request: NextRequest) {
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
    const existingCategory = await prisma.projectCategory.findFirst({
      where: {
        name: {
          equals: oldName,
          mode: 'insensitive'
        }
      }
    })

    if (existingCategory && existingCategory.name !== oldName) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Update all projects with the old category name
    await prisma.projectCategory.updateMany({
      where: {
        name: oldName
      },
      data: {
        name: newName
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
