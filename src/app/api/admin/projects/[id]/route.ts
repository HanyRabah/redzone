
// app/api/admin/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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

    const data = await request.json()
    const { id } = await params

    if (data.categoryId) {
      const categoryExists = await prisma.projectCategory.findUnique({
        where: { id: data.categoryId }
      })
      console.log(categoryExists)
      if (!categoryExists) {
        throw new Error('Category not found')
      }
    }
    
    const updateData: Prisma.ProjectUpdateInput = {
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image,
      link: data.link ? `https://www.youtube.com/embed/${data.link.trim()}` : null,
      slug: data.slug,
      client: data.client,        
      role: data.role,            
      year: data.year ? parseInt(data.year) : null, 
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
    }

    // Handle category relationship
    if (data.categoryId && data.categoryId !== "") {
      updateData.category = {
        connect: { id: data.categoryId }
      }
    } else {
      // Disconnect category if none selected
      updateData.category = {
        disconnect: true
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
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
    
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}