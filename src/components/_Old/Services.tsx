'use client';

import { useEffect, useRef } from 'react';

const services = [
  {
    icon: '🎯',
    title: 'Digital Strategy',
    description: 'We develop comprehensive digital strategies that align with your business goals and target audience.',
  },
  {
    icon: '🎨',
    title: 'Brand Identity',
    description: 'Create a unique and memorable brand identity that resonates with your customers and stands out in the market.',
  },
  {
    icon: '💻',
    title: 'Web Development',
    description: 'Build responsive, user-friendly websites that provide an exceptional user experience and drive conversions.',
  },
  {
    icon: '📱',
    title: 'Social Media',
    description: 'Engage your audience and grow your brand presence across all major social media platforms.',
  },
  {
    icon: '📊',
    title: 'Analytics & SEO',
    description: 'Optimize your digital presence with data-driven insights and search engine optimization strategies.',
  },
  {
    icon: '🎬',
    title: 'Content Creation',
    description: 'Produce engaging content that tells your brand story and connects with your target audience.',
  }
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const serviceElements = document.querySelectorAll('.service-item');
    serviceElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of digital services to help your business thrive in the digital age.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-item opacity-0 bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <a
                href="/services"
                className="inline-block mt-6 text-red-600 hover:text-red-700 font-medium"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
