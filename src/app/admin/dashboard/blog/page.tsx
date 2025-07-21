import { prisma } from "@/lib/prisma";
import BlogPage from "@/components/Dashboard/Blog";

async function getBlogData() {
  const [heroSection, posts, categories, tags, authors] = await Promise.all([
    prisma.heroSlider.findUnique({
      where: { page: "blog" },
      include: {
        slides: true,
      },
    }),
    prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    }),
    prisma.blogCategory.findMany({
      include: {
        posts: true,
      },
    }),
    prisma.blogTag.findMany({
      include: {
        posts: true,
      },
    }),
    prisma.user.findMany(),
  ]);

  return {
    heroSection,
    posts,
    categories,
    tags,
    authors,
  };
}

export default async function Page() {
  const data = await getBlogData();

  return <BlogPage data={data} />;
}
