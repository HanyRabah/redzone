
import React from 'react';
import HeroSlider from '@/components/Home/HeroSlider';
import Newsletter from '@/components/Layout/Newsletter/Newsletter';
import { SlideData } from '@/types';

// const posts = [
//   {
//     id: 1,
//     title: 'organic activated charcoal vape viral ennui',
//     category: 'Directing',
//     description: 'Tote bag cornhole pork belly swag, cronut hoodie snackwave 90\'s messenger bag pour-over disrupt chartreuse. Vape ugh cardigan hell of.',
//     image: '/images/projects/chocolate-delicious-dessert-890500.jpg',
//     link: '/project/4',
//     createdAt: new Date(),
//     author: {
//       name: 'John Doe',
//       image: '/images/projects/chocolate-delicious-dessert-890500.jpg',
//     }
//   },
//   {
//     id: 2,
//     title: 'organic activated charcoal vape viral ennui',
//     category: 'Directing',
//     description: 'Tote bag cornhole pork belly swag, cronut hoodie snackwave 90\'s messenger bag pour-over disrupt chartreuse. Vape ugh cardigan hell of.',
//     image: '/images/projects/chocolate-delicious-dessert-890500.jpg',
//     link: '/project/4',
//     createdAt: new Date(),
//     author: {
//       name: 'John Doe',
//       image: '/images/projects/chocolate-delicious-dessert-890500.jpg',
//     }
//   }
// ];

const slides: SlideData[] = [
  {
    title: ["Best Solutions", "& ideas for", "Your Business"],
    subtitle: "Welcome Red Zone",
    bgImage: "/images/backgrounds/adolescent-adult-diversity-1034361.jpg",
    theme: "light",
  },
];

export default function Blog() {
  //const posts = await getBlogPosts();
  return (
    <main className="relative mb-100">
     <HeroSlider slides={slides}/>
     <Newsletter/>
    </main>
  );
}
