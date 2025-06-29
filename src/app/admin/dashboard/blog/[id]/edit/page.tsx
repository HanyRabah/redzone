
// app/admin/blog/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
//import BlogPostForm from '@/components/admin/forms/BlogPostForm'
import { notFound } from 'next/navigation'


type PageProps = {
  params: Promise<{ id: string }>;
};


async function getBlogPostData(id: string) {
  const [post, categories, posts, tags, authors] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id }
    }),
    prisma.blogCategory.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.blogPost.findMany({
      select: { tags: true }
    }),
    prisma.blogTag.findMany({
      include: {
        posts: true
      }
    }),
    prisma.user.findMany()
  ])

  if (!post) {
    notFound()
  }


  return {
    post,
    categories,
    posts,
    tags,
    authors
  }
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const {post } = await getBlogPostData(id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Blog Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {post.title}
          </p>
        </div>
      </div>

      {/* Blog Post Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <p>{post.authorId}</p> 
          {/* <BlogPostForm 
            post={post}
            categories={categories}
            existingTags={tags}
            authors={authors}
            setIsDialogOpen={() => {}}
          /> */}
        </CardContent>
      </Card>
    </div>
  )
}