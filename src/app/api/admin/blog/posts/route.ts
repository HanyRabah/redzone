import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { BlogCategory, BlogTag } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    console.log("Received data:", data);

    // Validation
    if (!data.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!data.content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (!data.authorId?.trim()) {
      return NextResponse.json({ error: "Author is required" }, { status: 400 });
    }

    // Check if slug already exists
    if (data.slug) {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: data.slug },
      });

      if (existingPost) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }
    }

    // Generate slug if not provided
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Handle categories and tags properly
    const { categoryIds = [], newCategories = [], tagIds = [], newTags = [] } = data;

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
    const allCategoryIds = [...categoryIds, ...createdCategories.map((cat) => cat.id)];
    const allTagIds = [...tagIds, ...createdTags.map((tag) => tag.id)];

    // Create the blog post with direct many-to-many relationships
    const post = await prisma.blogPost.create({
      data: {
        title: data.title.trim(),
        slug,
        excerpt: data.excerpt?.trim() || "",
        content: data.content.trim(),
        image: data.image?.trim() || null,
        authorId: data.authorId.trim(),
        isPublished: data.isPublished ?? false,
        isFeatured: data.isFeatured ?? false,
        publishedAt: data.isPublished ? (data.publishedAt || new Date()) : null,
        seoTitle: data.seoTitle?.trim() || null,
        seoDescription: data.seoDescription?.trim() || null,
        seoKeywords: data.seoKeywords || [],
        // Connect categories using direct many-to-many
        categories: {
          connect: allCategoryIds.map(id => ({ id }))
        },
        // Connect tags using direct many-to-many
        tags: {
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
    });

    // Update category post counts (only once)
    if (allCategoryIds.length > 0) {
      await prisma.blogCategory.updateMany({
        where: { id: { in: allCategoryIds } },
        data: { postCount: { increment: 1 } }
      });
    }

    // Update tag post counts (only once)
    if (allTagIds.length > 0) {
      await prisma.blogTag.updateMany({
        where: { id: { in: allTagIds } },
        data: { postCount: { increment: 1 } }
      });
    }

    return NextResponse.json(post, { status: 201 });
    
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        slug: true,
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
        