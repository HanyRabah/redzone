'use client';

import { useState, useEffect } from 'react';

const slides = [
  {
    image: '/images/backgrounds/pexels-photo-1806031.jpeg',
    title: 'Creative Digital Agency',
    subtitle: 'We create innovative solutions for your digital presence',
    description: 'Transform your brand with our cutting-edge digital strategies and creative solutions.',
  },
  {
    image: '/images/backgrounds/adolescent-adult-diversity-1034361.jpg',
    title: 'Strategic Marketing',
    subtitle: 'Data-driven marketing strategies that deliver results',
    description: 'Reach your target audience and achieve your business goals with our expert marketing team.',
  },
  {
    image: '/images/backgrounds/art-artistic-artsy-1988681.jpg',
    title: 'Brand Development',
    subtitle: 'Building memorable brands that stand out',
    description: 'Create a lasting impression with our comprehensive branding solutions.',
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl text-white">
                <h1 className={`text-5xl md:text-6xl font-bold mb-4 animate-fadeInUp ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  {slide.title}
                </h1>
                <h2 className={`text-2xl md:text-3xl mb-6 animate-fadeInUp delay-200 ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  {slide.subtitle}
                </h2>
                <p className={`text-lg md:text-xl mb-8 animate-fadeInUp delay-300 ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  {slide.description}
                </p>
                <div className={`animate-fadeInUp delay-400 ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <a
                    href="#services"
                    className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors inline-block"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-red-600' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
