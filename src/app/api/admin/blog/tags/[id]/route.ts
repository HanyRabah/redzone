
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  request: NextRequest,
  { params }: PageProps
) {
  try {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { id } = await params

    // Check if tag exists before deleting
    const existingTag = await prisma.blogTag.findUnique({
      where: { id },
    })

    if (!existingTag) {
      return new NextResponse(
        JSON.stringify({ error: 'Tag not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Delete the tag
    const tag = await prisma.blogTag.delete({
      where: { id },
    })

    return new NextResponse(JSON.stringify(tag), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete tag' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Handle unsupported methods
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
