import HeroSlider from '@/components/Home/HeroSlider';
import About from '@/components/Home/About';
import Portfolio from '@/components/Home/Portfolio';
import Clients from '@/components/Home/Clients';
import Testimonials from '@/components/Home/Testimonials';
import Blog from '@/components/Home/Blog';
import { prisma } from '@/lib/prisma';
 

const getPageData = async () => {
  const [heroSlider, aboutUsSection, clients, testimonials, featuredProjects, categories, blogPosts] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'home' }, include: {slides: true} }),
    prisma.aboutUsSection.findFirst(),
    prisma.client.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.project.findMany({ 
      where: { isFeatured: true },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.projectCategory.findMany(),
    prisma.blogPost.findMany({
      include: {
        categories: true,
        tags: true,
        author: true,
      },
    })
  ])

  return {
    heroSlider,
    aboutUsSection,
    clients,
    testimonials,
    featuredProjects,
    categories,
    blogPosts
  }
}

export default async function Home() {
  const {heroSlider, aboutUsSection, clients, testimonials, featuredProjects, categories, blogPosts} = await getPageData();
  return (
    <main className="relative mb-150">
      <HeroSlider pageSlides={heroSlider} />
      <About pageData={aboutUsSection} />
      <Portfolio projects={featuredProjects} categories={categories} />
      <Clients clients={clients} />
      <Testimonials pageData={testimonials} />
      <Blog blogPosts={blogPosts} />
    </main>
  );
}