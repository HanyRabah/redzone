import BlogDetailPage from "@/components/Blog/SinglePost";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getPageData = async (slug: string) => {
  const blogPost = await prisma.blogPost.findUnique({
    where: {
      slug: slug,
    },
    include: {
      categories: true,
      tags: true,
      author: {
        include: {
          social: true,
        },
      },
    },
  });

  return blogPost;
};

const BlogPost = async ({ params }: PageProps) => {
  const { slug } = await params;
  const blogPost = await getPageData(slug);

  return (
    // @ts-ignore I need to look into this
    <BlogDetailPage blogPost={blogPost} />
  );
};

export default BlogPost;
