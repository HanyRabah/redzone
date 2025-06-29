
// app/api/admin/contact-submissions/bulk/route.ts
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

    const { action, submissionIds } = await request.json()

    if (!Array.isArray(submissionIds) || submissionIds.length === 0) {
      return NextResponse.json({ error: 'No submission IDs provided' }, { status: 400 })
    }

    switch (action) {
      case 'mark-read':
        await prisma.contactSubmission.updateMany({
          where: {
            id: {
              in: submissionIds
            }
          },
          data: { isRead: true }
        })
        break

      case 'mark-unread':
        await prisma.contactSubmission.updateMany({
          where: {
            id: {
              in: submissionIds
            }
          },
          data: { isRead: false }
        })
        break

      case 'delete':
        await prisma.contactSubmission.deleteMany({
          where: {
            id: {
              in: submissionIds
            }
          }
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ message: `Submissions ${action}d successfully` })
  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    )
  }
}
