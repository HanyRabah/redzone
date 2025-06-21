'use client';

import { useState } from 'react';

const projects = [
  {
    title: 'Brand Identity Design',
    category: 'Branding',
    image: '/images/portfolio/project1.jpg',
    description: 'Complete brand identity design for a tech startup.',
  },
  {
    title: 'E-commerce Website',
    category: 'Web Development',
    image: '/images/portfolio/project2.jpg',
    description: 'Custom e-commerce platform with advanced features.',
  },
  {
    title: 'Social Media Campaign',
    category: 'Marketing',
    image: '/images/portfolio/project3.jpg',
    description: 'Successful social media campaign for a retail brand.',
  },
  {
    title: 'Mobile App Design',
    category: 'UI/UX',
    image: '/images/portfolio/project4.jpg',
    description: 'User interface design for a fitness tracking app.',
  },
  {
    title: 'Content Strategy',
    category: 'Marketing',
    image: '/images/portfolio/project5.jpg',
    description: 'Content strategy and creation for a lifestyle brand.',
  },
  {
    title: 'Website Redesign',
    category: 'Web Development',
    image: '/images/portfolio/project6.jpg',
    description: 'Complete website redesign for a corporate client.',
  }
];

const categories = ['All', 'Branding', 'Web Development', 'Marketing', 'UI/UX'];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Portfolio</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our latest work and see how we help businesses achieve their goals.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{project.category}</p>
                <p className="text-center">{project.description}</p>
                <a
                  href={`/portfolio/${project.title.toLowerCase().replace(/ /g, '-')}`}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/portfolio"
            className="inline-block px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
}
