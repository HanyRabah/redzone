// app/api/admin/projects/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import type { Project } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, projectIds } = await request.json()

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({ error: 'No project IDs provided' }, { status: 400 })
    }

    let updateData: Partial<Project> = {}

    switch (action) {
      case 'activate':
        updateData = { isActive: true }
        break
      case 'deactivate':
        updateData = { isActive: false }
        break
      case 'feature':
        updateData = { isFeatured: true }
        break
      case 'unfeature':
        updateData = { isFeatured: false }
        break
      case 'delete':
        await prisma.project.deleteMany({
          where: {
            id: {
              in: projectIds
            }
          }
        })
        return NextResponse.json({ message: 'Projects deleted successfully' })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await prisma.project.updateMany({
      where: {
        id: {
          in: projectIds
        }
      },
      data: updateData
    })

    return NextResponse.json({ message: `Projects ${action}d successfully` })
  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    )
  }
}