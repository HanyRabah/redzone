import React from 'react';
import HeroSlider from '@/components/Home/HeroSlider';
import PortfolioComponent from '@/components/Home/Portfolio';
import { prisma } from '@/lib/prisma';

const getPageData = async () => {
  const [heroSlider, featuredProjects] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'portfolio' }, include: {slides: true} }),
    prisma.project.findMany({ 
      orderBy: { sortOrder: 'asc' }
    }),
  ])

  return {
    heroSlider,
    featuredProjects,
  }
}

export default async function Portfolio() {
  const {heroSlider, featuredProjects} = await getPageData();
  return (
    <main className="relative mb-100">
     <HeroSlider pageSlides={heroSlider} />
     <PortfolioComponent projects={featuredProjects} />
    </main>
  );
}
