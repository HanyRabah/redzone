'use client';
import React, { useState } from 'react';
import { Box, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}



const testimonials:Testimonial[] = [
  {
    id: '1',
    name: 'Balanchaev Balancha',
    role: 'Investor',
    content: 'Copper mug vexillologist +1 prism iPhone fashion axe portland. Hella quinoa woke blog af umami tacos freegan vinyl snackwave microdosing. Fanny pack direct trade XOXO drinking vinegar.',
    avatar: '/images/testimonials/adult-beanie-black-background-1529350.jpg'
  },
  {
    id: '2',
    name: 'Fred Kinney',
    role: 'Designer',
    content: 'Bushwick tumeric slow-carb photo booth letterpress franzen kombucha tumblr listicle cronut waistcoat mustache. Jean shorts tilde swag cray. Microdosing heirloom wayfarers YOLO.',
    avatar: '/images/testimonials/pexels-photo-428340.jpeg'
  },
  {
    id: '3',
    name: 'Steve Kong',
    role: 'Web developer',
    content: 'Pitchfork vaporware hella, vice next level art party subway tile swag portland. Cliche authentic photo booth, seitan sartorial iPhone brooklyn bicycle rights whatever small batch selvage.',
    avatar: '/images/testimonials/pexels-photo-764529.jpeg'
  },
  {
    id: '4',
    name: 'John Doe',
    role: 'Creative Director',
    content: 'Chambray enamel pin synth shabby chic palo santo. Franzen 90\'s man bun wayfarers, put a bird on it twee four loko roof party shabby chic kale chips photo booth salvia mixtape lumbersexual.',
    avatar: '/images/testimonials/pexels-photo-809433.jpeg'
  },
  {
    id: '5',
    name: 'Jane Smith',
    role: 'Art Director',
    content: 'Pok pok authentic fashion axe, vegan venmo leggings raclette tousled twee tattooed. Banh mi humblebrag hammock tacos fashion axe aesthetic vegan sustainable taiyaki thundercats.',
    avatar: '/images/testimonials/pexels-photo-894156.jpeg'
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-[#f0f0f0] py-30">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            el: '.testimonials-pagination',
            clickable: true,
            bulletClass: 'testimonial-bullet',
            bulletActiveClass: 'testimonial-bullet-active',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full"
          speed={1000}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.767, 0.01, 0.18, 1.01] }}
              >
                <Avatar
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  sx={{ width: 100, height: 100 }}
                  className="mx-auto mb-12 rounded-full"
                />
                
                <Box className="relative bg-black p-12 mb-8 max-w-4xl mx-auto">
                  {/* Quote Triangle */}
                  <Box className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-black rotate-45" />
                  
                  <p className="text-xl font-black text-white tracking-wide text-justify">
                    {testimonial.content}
                  </p>
                </Box>

                <p className="text-red-500 text-xs uppercase tracking-widest font-semibold">
                  {testimonial.name}, <span className="text-gray-600">{testimonial.role}</span>
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom Pagination */}
        <div className="testimonials-pagination flex items-center justify-center space-x-6 mt-12">
          {testimonials.map((_, index) => (
            <motion.div
              key={index}
              className={`testimonial-bullet w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === index 
                  ? 'testimonial-bullet-active bg-black scale-125' 
                  : 'bg-gray-400 scale-75'
              }`}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
    </div>
  );
};

export default Testimonials;