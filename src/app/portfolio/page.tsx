'use client';

import React from 'react';
import HeroSlider from '@/components/Home/HeroSlider';
import { ProjectData, SlideData } from '@/types';
import Portfolio from '@/components/Home/Portfolio';

const projects: ProjectData[] = [
  {
    id: 1,
    category: "Commercial",
    title: "Bushwick Selfies Pork Belly Lyft Brooklyn Messeng",
    description: "Narwhal pop-up intelligentsia tbh pinterest, microdosing tilde cloud bread gochujang tattooed leggings cornhole 8-bit. Austin fam chia cold-pressed raw denim. Glossier drinking vinegar portland lo-fi, polaroid bespoke lomo. Banjo art party XOXO, fashion axe sustainable retro ethical gentrify.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
    link: '/project/1'
  },
  {
    id: 2,
    category: "Graphic Design",
    title: "Tumeric Tumblr Gluten-Free Man Bun Small",
    description: "Slow-carb green juice subway tile bicycle rights, fanny pack raclette palo santo put a bird on it mustache actually fam mumblecore iPhone. Iceland post-ironic health goth snackwave, mixtape synth four dollar toast sartorial. Health goth la croix vexillologist, before they sold out shabby chic.",
    image: "https://images.pexels.com/photos/1034361/pexels-photo-1034361.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
    link: '/project/2'
  },
  {
    id: 3,
    category: "Web Design",
    title: "Authentic Letterpress Drinking Vinegar",
    description: "Portland authentic letterpress drinking vinegar, viral seitan blog kinfolk put a bird on it single-origin coffee VHS locavore. Everyday carry retro tumblr squid. Blog kinfolk put a bird on it single-origin coffee VHS locavore typewriter, artisan ugh woke banjo.",
    image: "/assets/images/projects/blur-close-up-equipment-1034651.jpg",
    link: '/project/3'
  },
  {
    id: 4,
    title: 'organic activated charcoal vape viral ennui',
    category: 'Directing',
    description: 'Tote bag cornhole pork belly swag, cronut hoodie snackwave 90\'s messenger bag pour-over disrupt chartreuse. Vape ugh cardigan hell of.',
    image: '/images/projects/chocolate-delicious-dessert-890500.jpg',
    link: '/project/4'
  }
];

const slides: SlideData[] = [
  {
    title: ["New Approcach", "To Desgin", "& Marketing"],
    bgImage: "/images/backgrounds/adolescent-adult-diversity-1034361.jpg",
    theme: "light",
  },
];

export default function About() {
  return (
    <main className="relative mb-100">
     <HeroSlider slides={slides} showReadMore={false} />
     <Portfolio projects={projects} />
    </main>
  );
}
