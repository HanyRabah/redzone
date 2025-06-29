
import React from 'react';
import HeroSlider from '@/components/Home/HeroSlider';
//import Newsletter from '@/components/Layout/Newsletter/Newsletter';
import { prisma } from '@/lib/prisma';
import BlogPage from '@/components/Blog';

const getBlogData = async () => {
  const [heroSlider, categories, posts, tags] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'blog' }, include: {slides: true} }),
    prisma.blogCategory.findMany(),
    prisma.blogPost.findMany(
      {
        include: {
          categories: true,
          tags: true
        }
      }
    ),
    prisma.blogTag.findMany({
      include: {
        posts: true
      }
    }),
  ])

  return {
    heroSlider,
    categories,
    posts,
    tags 
  }
}
export default async function Blog() {
  const { heroSlider, categories, posts, tags} = await getBlogData();

  return (
    <main className="relative mb-100">
     <HeroSlider pageSlides={heroSlider}/>
     <BlogPage blogPosts={posts} categories={categories} tags={tags}/>
     {/* <Newsletter/> */}
    </main>
  );
}
