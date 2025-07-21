import React from 'react';
import HeroSlider from '@/components/Client/Home/HeroSlider';
import PortfolioComponent from '@/components/Client/Home/Portfolio';
import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

const getPageData = async () => {
  noStore();
  const [heroSlider, featuredProjects, categories, sections] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'portfolio' }, include: {slides: true} }),
    prisma.project.findMany({ 
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.projectCategory.findMany(),
    prisma.sections.findMany({ where: { page: 'portfolio' } })
  ])

  return {
    heroSlider,
    featuredProjects,
    categories,
    sections
  }
}

export default async function Portfolio() {
  const {heroSlider, featuredProjects, categories, sections} = await getPageData();
  const sectionTitle = sections.find((section) => section.section === "our_portfolio");

  return (
    <main className="relative mb-100">
     <HeroSlider pageSlides={heroSlider} />
     <PortfolioComponent projects={featuredProjects} categories={categories} section={sectionTitle} />
    </main>
  );
}
