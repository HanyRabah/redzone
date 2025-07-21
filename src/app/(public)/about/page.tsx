import React from 'react';
import Team from '@/components/Client/About/Team';
import WeAreCreative from '@/components/Client/About/WeAreCreative';
import WhoWeAre from '@/components/Client/About/WhoWeAre';
import HeroSlider from '@/components/Client/Home/HeroSlider';
import Testimonials from '@/components/Client/Home/Testimonials';
import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

const getPageData = async () => {
  noStore();
  const [heroSlider, whoWeAreSection, teamSection, teamMembers, weAreCreativeSection, testimonials] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'about' }, include: {slides: true} }),
    prisma.whoWeAreSection.findFirst(),
    prisma.teamSection.findFirst(),
    prisma.teamMember.findMany({ 
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.weAreCreativeSection.findFirst(),
    prisma.testimonial.findMany()
  ])

  return {
    heroSlider,
    whoWeAreSection,
    teamSection,
    teamMembers,
    weAreCreativeSection,
    testimonials
  }
}


export default async function About() {
  const {heroSlider, whoWeAreSection, teamSection, teamMembers, weAreCreativeSection, testimonials} = await getPageData();
  return (
    <main className="relative mb-100">
     <HeroSlider pageSlides={heroSlider}/>
     <WhoWeAre pageData={whoWeAreSection}/>
     <Team teamSection={teamSection} teamMembers={teamMembers}/>
     <WeAreCreative pageData={weAreCreativeSection}/>
     <Testimonials pageData={testimonials} /> 
    </main>
  );
}
