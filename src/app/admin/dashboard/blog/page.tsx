// app/admin/blog/page.tsx
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HeroSectionForm from '@/components/admin/forms/HeroSectionForm'
import BlogPostsManager from '@/components/admin/managers/BlogPostsManager'
import BlogCategoriesManager from '@/components/admin/managers/BlogCategoriesManager'
import BlogTagsManager from '@/components/admin/managers/BlogTagsManager'
import BlogStatsOverview from '@/components/admin/components/BlogStatsOverview'

async function getBlogData() {
  const [heroSection, posts, categories, tags, authors] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'blog' },
      include: {
        slides: true
      }}),   
    prisma.blogPost.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        categories: true,
        tags: true
      }
    }),
    prisma.blogCategory.findMany({
      include: {
        posts: true
      }
    }),
    prisma.blogTag.findMany({
      include: {
        posts: true
      }
    }),
    prisma.user.findMany()
  ])

  return {
    heroSection,
    posts,
    categories,
    tags,
    authors
  }
}

export default async function BlogManager() {
  const {heroSection, posts, categories, tags, authors} = await getBlogData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Blog Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your blog content, posts, categories, and settings
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BlogStatsOverview 
            posts={posts}
            categories={categories}
            tags={tags}
          />
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogPostsManager 
                posts={posts}
                categories={categories}
                tags={tags}
                authors={authors}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Blog Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogCategoriesManager 
                categories={categories}
                posts={posts}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Blog Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogTagsManager 
                tags={tags}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Blog Hero Section</CardTitle>
            </CardHeader>
            <CardContent>
              <HeroSectionForm 
                page="blog" 
                initialData={heroSection} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
