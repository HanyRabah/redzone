// app/api/admin/blog/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { BlogCategory, BlogTag } from '@prisma/client'

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

    // Validation
    if (!data.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!data.content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (!data.authorId?.trim()) {
      return NextResponse.json({ error: 'Author is required' }, { status: 400 })
    }

    // Get current post to compare categories and tags
    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        categories: {
          select: { id: true, name: true }
        },
        tags: {
          select: { id: true, name: true }
        }
      }
    })

    if (!currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Handle categories and tags properly
    const { categoryIds = [], newCategories = [], tagIds = [], newTags = [] } = data

    // Create new categories first
    const createdCategories = await Promise.all(
      newCategories.map(async (cat: BlogCategory) => {
        return await prisma.blogCategory.create({
          data: {
            name: cat.name,
            slug: cat.slug,
            postCount: 0,
          },
        });
      })
    );

    // Create new tags
    const createdTags = await Promise.all(
      newTags.map(async (tag: BlogTag) => {
        return await prisma.blogTag.create({
          data: {
            name: tag.name,
            slug: tag.slug,
            postCount: 0,
          },
        });
      })
    );

    // Combine all category and tag IDs
    const allCategoryIds = [...categoryIds, ...createdCategories.map((cat) => cat.id)]
    const allTagIds = [...tagIds, ...createdTags.map((tag) => tag.id)]

    // Get current category and tag IDs for comparison
    const currentCategoryIds = currentPost.categories.map(cat => cat.id)
    const currentTagIds = currentPost.tags.map(tag => tag.id)

    // Update the blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug: data.slug,
        excerpt: data.excerpt?.trim() || '',
        content: data.content.trim(),
        image: data.image?.trim() || null,
        authorId: data.authorId.trim(),
        isPublished: data.isPublished ?? false,
        isFeatured: data.isFeatured ?? false,
        publishedAt: data.isPublished && !currentPost.publishedAt ? new Date() : data.publishedAt,
        seoTitle: data.seoTitle?.trim() || null,
        seoDescription: data.seoDescription?.trim() || null,
        seoKeywords: data.seoKeywords || [],
        // Update categories - disconnect old ones and connect new ones
        categories: {
          disconnect: currentCategoryIds.map(id => ({ id })),
          connect: allCategoryIds.map(id => ({ id }))
        },
        // Update tags - disconnect old ones and connect new ones
        tags: {
          disconnect: currentTagIds.map(id => ({ id })),
          connect: allTagIds.map(id => ({ id }))
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    // Update category post counts
    // Decrement old categories that are no longer associated
    const removedCategoryIds = currentCategoryIds.filter(id => !allCategoryIds.includes(id))
    if (removedCategoryIds.length > 0) {
      await prisma.blogCategory.updateMany({
        where: { id: { in: removedCategoryIds } },
        data: { postCount: { decrement: 1 } }
      })
    }

    // Increment new categories
    const addedCategoryIds = allCategoryIds.filter(id => !currentCategoryIds.includes(id))
    if (addedCategoryIds.length > 0) {
      await prisma.blogCategory.updateMany({
        where: { id: { in: addedCategoryIds } },
        data: { postCount: { increment: 1 } }
      })
    }

    // Update tag post counts
    // Decrement old tags that are no longer associated
    const removedTagIds = currentTagIds.filter(id => !allTagIds.includes(id))
    if (removedTagIds.length > 0) {
      await prisma.blogTag.updateMany({
        where: { id: { in: removedTagIds } },
        data: { postCount: { decrement: 1 } }
      })
    }

    // Increment new tags
    const addedTagIds = allTagIds.filter(id => !currentTagIds.includes(id))
    if (addedTagIds.length > 0) {
      await prisma.blogTag.updateMany({
        where: { id: { in: addedTagIds } },
        data: { postCount: { increment: 1 } }
      })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
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

    // Get post categories and tags before deletion
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        categories: {
          select: { id: true }
        },
        tags: {
          select: { id: true }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Delete the blog post (this will also remove the many-to-many relationships)
    await prisma.blogPost.delete({
      where: { id },
    })

    // Update category post counts
    const categoryIds = post.categories.map(cat => cat.id)
    if (categoryIds.length > 0) {
      await prisma.blogCategory.updateMany({
        where: { id: { in: categoryIds } },
        data: { postCount: { decrement: 1 } }
      })
    }

    // Update tag post counts
    const tagIds = post.tags.map(tag => tag.id)
    if (tagIds.length > 0) {
      await prisma.blogTag.updateMany({
        where: { id: { in: tagIds } },
        data: { postCount: { decrement: 1 } }
      })
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: PageProps
) {
  try {
    const { id } = await params

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}