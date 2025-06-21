'use client';

import React from 'react';
import Team from '@/components/About/Team';
import WeAreCreative from '@/components/About/WeAreCreative';
import WhoWeAre from '@/components/About/WhoWeAre';
import HeroSlider from '@/components/Home/HeroSlider';
import Testimonials from '@/components/Home/Testimonials';
import { SlideData } from '@/types';

const slides: SlideData[] = [
  {
    title: ["Best solutions", "& Ideas for", "Your Business"],
    subtitle: "About Us",
    bgImage: "/images/backgrounds/adolescent-adult-diversity-1034361.jpg",
    theme: "light",
  },
];

export default function About() {
  return (
    <main className="relative mb-100">
     <HeroSlider slides={slides} showReadMore={false} />
     <WhoWeAre/>
     <Team/>
     <WeAreCreative/>
     <Testimonials /> 
    </main>
  );
}
