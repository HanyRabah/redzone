// app/api/admin/blog/posts/[id]/quick-action/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { BlogPost } from '@prisma/client'

interface BlogPostUpdateInput extends Partial<BlogPost> {
  customData?: string
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: NextRequest,
  { params }: PageProps
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()
    const { id } = await params

    // Validate that the post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { id: true, isPublished: true, isFeatured: true, publishedAt: true }
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    let updateData: BlogPostUpdateInput = {}
    let message = ''

    switch (action) {
      case 'publish':
        updateData = { 
          isPublished: true,
          publishedAt: existingPost.publishedAt || new Date()
        }
        message = 'Post published successfully'
        break
      case 'unpublish':
        updateData = { 
          isPublished: false
          // Keep publishedAt for potential republishing
        }
        message = 'Post unpublished successfully'
        break
      case 'feature':
        updateData = { isFeatured: true }
        message = 'Post featured successfully'
        break
      case 'unfeature':
        updateData = { isFeatured: false }
        message = 'Post unfeatured successfully'
        break
      case 'toggle-publish':
        updateData = existingPost.isPublished 
          ? { isPublished: false }
          : { 
              isPublished: true,
              publishedAt: existingPost.publishedAt || new Date()
            }
        message = existingPost.isPublished 
          ? 'Post unpublished successfully'
          : 'Post published successfully'
        break
      case 'toggle-feature':
        updateData = { isFeatured: !existingPost.isFeatured }
        message = existingPost.isFeatured 
          ? 'Post unfeatured successfully'
          : 'Post featured successfully'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        isPublished: true,
        isFeatured: true,
        publishedAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ 
      message,
      post: updatedPost
    })
  } catch (error) {
    console.error(`Error performing quick action:`, error)
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}

// Optional: Add a GET route to fetch current post status
export async function GET(
  request: NextRequest,
  { params }: PageProps
) {
  try {
    const { id } = await params

    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        isPublished: true,
        isFeatured: true,
        publishedAt: true,
        updatedAt: true
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post status' },
      { status: 500 }
    )
  }
}