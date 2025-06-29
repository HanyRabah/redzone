
// app/api/admin/blog/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

type PageProps = {
  params: Promise<{ id: string }>;
};


export async function PUT(
  request: NextRequest,
  { params }: PageProps
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, slug } = await request.json()
    const { id } = await params

    const category = await prisma.blogCategory.update({
      where: { id },
      data: {
        name: name?.trim(),
        slug: slug || name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: PageProps
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get category name before deletion
    const category = await prisma.blogCategory.findUnique({
      where: { id },
      select: { name: true }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // First, find all posts that have this category
    const postsWithCategory = await prisma.blogPost.findMany({
      where: {
        categories: {
          some: {
            id: id
          }
        }
      },
      select: {
        id: true
      }
    });

    // Disconnect the category from each post
    await Promise.all(
      postsWithCategory.map(post =>
        prisma.blogPost.update({
          where: { id: post.id },
          data: {
            categories: {
              disconnect: { id }
            }
          }
        })
      )
    )

    await prisma.blogCategory.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}