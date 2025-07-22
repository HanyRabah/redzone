import HeroSlider from '@/components/Client/Home/HeroSlider';
import About from '@/components/Client/Home/About';
import Portfolio from '@/components/Client/Home/Portfolio';
import Clients from '@/components/Client/Home/Clients';
import Testimonials from '@/components/Client/Home/Testimonials';
import Blog from '@/components/Client/Home/Blog';
import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
 

const getPageData = async () => {
  noStore();
  const [heroSlider, aboutUsSection, clients, testimonials, featuredProjects, categories, blogPosts, sections] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'home' }, include: {slides: true} }),
    prisma.aboutUsSection.findFirst(),
    prisma.client.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
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
    }),
    prisma.sections.findMany({ where: { page: 'home' } })
  ])

  return {
    heroSlider,
    aboutUsSection,
    clients,
    testimonials,
    featuredProjects,
    categories,
    blogPosts,
    sections
  }
}

export default async function Home() {
  const {heroSlider, aboutUsSection, clients, testimonials, featuredProjects, categories, blogPosts, sections} = await getPageData();
  const sectionTitle = sections.find((section) => section.section === "portfolio");
  return (
    <>
      <HeroSlider pageSlides={heroSlider} />
      <About pageData={aboutUsSection} />
      <Portfolio projects={featuredProjects} categories={categories} section={sectionTitle} />
      <Clients clients={clients} />
      <Testimonials pageData={testimonials} />
      {blogPosts && blogPosts.length > 0 ? <Blog blogPosts={blogPosts} /> : null}
    </>
  );
}