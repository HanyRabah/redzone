'use client';
import React from 'react';
import HeroSlider from '@/components/Home/HeroSlider';
import About from '@/components/Home/About';
import Portfolio from '@/components/Home/Portfolio';
import Clients from '@/components/Home/Clients';
import Testimonials from '@/components/Home/Testimonials';
import Blog from '@/components/Home/Blog';
import { ProjectData } from '@/types';
 
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

const clients = [
  { id: '1', name: 'Client 1', logo: '/images/clients/3eabc7ab-8bae-44f0-8389-0169389e38c2.png', logoHover: '/images/clients/1c4bfb0e-0b9f-4c19-ba5c-113fb0714514.png' },
  { id: '2', name: 'Client 2', logo: '/images/clients/6b9fcb90-c595-432a-a97c-fcd318b74c04.png', logoHover: '/images/clients/699301b6-83ff-47f8-ad46-a6b871e79293.png' },
  { id: '3', name: 'Client 3', logo: '/images/clients/7d1fe64f-fbd7-4e5f-896d-6d79c91f29bf.png', logoHover: '/images/clients/858e2e28-faae-441c-bd9c-5c490c72b562.png' },
  { id: '4', name: 'Client 4', logo: '/images/clients/8b587214-bdcb-4d74-bb61-2480d1d15aa7.png', logoHover: '/images/clients/4b983c9a-759d-4921-ba60-dbbcaa702ee5.png' },
  { id: '5', name: 'Client 5', logo: '/images/clients/8f65e211-cd41-46dc-8c1d-ba228ac36eb9.png', logoHover: '/images/clients/9c30d6d6-6af9-4fb1-bed3-e5ea4df4c281.png' },
  { id: '6', name: 'Client 6', logo: '/images/clients/4731da4b-b2fb-4c10-aee7-c89484a5d473.png', logoHover: '/images/clients/69cb9e61-d0b8-4420-b8bd-454c9b9e1dc1.png' },
  { id: '7', name: 'Client 7', logo: '/images/clients/492492b2-b7d9-4648-a164-f530ecd6321a.png', logoHover: '/images/clients/9a6c570f-d03a-4806-9a30-dddc648707d9.png' },
  { id: '8', name: 'Client 8', logo: '/images/clients/b908b85c-f837-4dba-80cf-d961d6fcad29.png', logoHover: '/images/clients/6e63c653-6997-42c6-b788-28e9fb6d15b7.png' },
  { id: '9', name: 'Client 9', logo: '/images/clients/d5f831cf-3fb0-490b-aadc-3591c8b64156.png', logoHover: '/images/clients/2ed0436b-e3ea-48aa-85ca-755de0719c9a.png' },
  { id: '10', name: 'Client 10', logo: '/images/clients/d51e13e6-1320-4227-8bc8-c36aaa82dffd.png', logoHover: '/images/clients/aed14647-8ecf-4fef-8274-737d79a7ede1.png' },
  { id: '11', name: 'Client 11', logo: '/images/clients/d383cf8d-abee-4290-810d-a965f6c0fa6c.png', logoHover: '/images/clients/7f7b6ede-3a3e-4e17-af25-f881c0121d63.png' }
];

const blogPosts = [
  {
    id: '1',
    title: 'subway tile brooklyn bun pickled bespoke',
    excerpt: 'Narwhal pop-up intelligentsia tbh pinterest, microdosing tilde cloud bread gochujang tattooed leggings cornhole 8-bit.',
    image: '/images/blog/bodypaint-female-girl-50595.jpg',
    author: 'Balanchaev Balancha',
    date: 'March 20, 2025',
    categories: ['branding', 'design', 'art'],
    tags: ['template', 'post formats']
  },
  {
    id: '2',
    title: 'Cornhole slow franzen woke master cleanse',
    excerpt: 'Slow-carb green juice subway tile bicycle rights, fanny pack raclette palo santo put a bird on it mustache actually fam.',
    image: '/images/blog/auto-automobile-automotive-358201.jpg',
    author: 'Steve Kong',
    date: 'March 13, 2025',
    categories: ['branding', 'design', 'art'],
    tags: ['template', 'post formats']
  },
  {
    id: '3',
    title: 'Man bun 8-bit artisan pickled hot chicken',
    excerpt: 'Mlkshk YOLO wolf, leggings vinyl crucifix stumptown tousled. Pabst venmo gentrify deep v microdosing migas occupy.',
    image: '/images/blog/art-blur-close-up-1826029.jpg',
    author: 'James Basinski',
    date: 'March 10, 2025',
    categories: ['branding', 'design', 'art'],
    tags: ['template', 'post formats']
  }
];

export default function Home() {
  return (
    <main className="relative mb-150">
      <HeroSlider />
      <About />
      <Portfolio projects={projects} />
      <Clients clients={clients} />
      <Testimonials />
      <Blog posts={blogPosts} />
    </main>
  );
}