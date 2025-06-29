import {  NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
        take: 4, // Number of recent posts to show
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          createdAt: true,
          author: {
            select: {
              name: true
            }
          }
        }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
