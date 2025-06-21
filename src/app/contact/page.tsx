
import React from 'react';
import HeroSlider from '@/components/Home/HeroSlider';
import { SlideData } from '@/types';
import ContactInfo from '@/components/Contact/ContactInfo';
import ContactForm from '@/components/Contact/ContactForm';

const slides: SlideData[] = [
  {
    title: ["The Best", "Agency for", "Your Business"],
    bgImage: "/images/backgrounds/double-exposure-2390185_1920.jpg",
  },
];

export default function Contact() {
  //const posts = await getBlogPosts();
  return (
    <main className="relative mb-100">
     <HeroSlider slides={slides} showReadMore={false}/>
     <ContactInfo/>
    <ContactForm/>
    </main>
  );
}
