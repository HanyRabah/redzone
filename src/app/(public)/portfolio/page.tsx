import React from 'react';
import HeroSlider from '@/components/Home/HeroSlider';
import PortfolioComponent from '@/components/Home/Portfolio';
import { prisma } from '@/lib/prisma';

const getPageData = async () => {
  const [heroSlider, featuredProjects, categories] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'portfolio' }, include: {slides: true} }),
    prisma.project.findMany({ 
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.projectCategory.findMany(),
  ])

  return {
    heroSlider,
    featuredProjects,
    categories,
  }
}

export default async function Portfolio() {
  const {heroSlider, featuredProjects, categories} = await getPageData();
  return (
    <main className="relative mb-100">
     <HeroSlider pageSlides={heroSlider} />
     <PortfolioComponent projects={featuredProjects} categories={categories} />
    </main>
  );
}
