import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronArrowWithTail } from '../Layout/Arrow/arrow';
import Link from 'next/link';

// TypeScript interfaces
interface ProjectData {
  id: number | string;
  category: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface PortfolioArticleProps {
  project: ProjectData;
  index: number;
  isInView: boolean;
}

// Individual Article Component
const PortfolioArticle: React.FC<PortfolioArticleProps> = ({ project, index, isInView }) => {
  // Helper function to process title into lines
  const getTitleLines = (title: string | string[]): string[] => {
    if (Array.isArray(title)) {
      return title;
    }
    
    // Method 1: Split by line breaks (\n)
    if (title.includes('\n')) {
      return title.split('\n');
    }
    
    // Method 2: Auto-break by word count (every 3-4 words)
    const words = title.split(' ');
    const lines: string[] = [];
    const wordsPerLine = 3; // Adjust this number as needed
    
    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    
    return lines;
  };

  const titleLines = getTitleLines(project.title);

  // Animation variants for description sliding up
  const descriptionVariants = {
    hidden: { 
      y: 50,
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 1.2,
        duration: 0.8,
        ease: [0.767, 0.01, 0.18, 1.01]
      }
    }
  };

  // Animation variants for button
  const buttonVariants = {
    hidden: { 
      y: 30,
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 1.6,
        duration: 0.6,
        ease: [0.767, 0.01, 0.18, 1.01]
      }
    }
  };
  const isEven = index % 2 === 0;
  // Image overlay animation variants
  const imageOverlayVariants = {
    hidden: { 
      x: isEven ? '0%' : '0%'
    },
    visible: {
      x: isEven ? '100%' : '-100%',
      transition: {
        delay: 0.3,
        duration: 1.2,
        ease: [0.767, 0.01, 0.18, 1.01]
      }
    }
  };


  const overlayVariants = {
    hidden: { x: 0 },
    visible: (i: number) => ({
      x: "100%",
      transition: {
        delay: 0.6 + i * 0.1,
        duration: 1,
        ease: [0.858, 0.01, 0.068, 0.99],
      },
    }),
  };


  return (
    <article className={`min-h-[60vh] h-[60vh] mt-20 flex flex-col lg:flex-row items-stretch ${isEven ? '' : 'lg:flex-row-reverse'}`}>
      {/* Content Section */}
      <div className={`sm:w-full md:w-1/2 flex items-center justify-${isEven ? 'end' : 'start'} p-8 lg:p-16 bg-gray-50`}>
        <div className="w-1/3 justify-end">
          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className={`uppercase tracking-widest text-sm font-bold text-red-500`}>
              {project.category}
            </span>
          </motion.div>

          {/* Animated Title with Overlay Effect - Line by Line */}
          <div className="mb-8">
            <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-black uppercase tracking-tight leading-tight">
            {titleLines.map((line, i) => (
              <div key={i} className="mb-1">
                <div className="overflow-hidden relative w-fit">
                    {line}
                   <motion.div
                      custom={i}
                      variants={overlayVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      className="absolute inset-0 bg-black"
                    />    
                </div>
              </div>
            ))}
                  </h3>

          </div>

          {/* Description sliding up */}
          <motion.div
            variants={descriptionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-8"
          >
            <p className="text-gray-500 font-[Open_Sans] leading-8 text-sm tracking-[1px]">
              {project.description}
            </p>
          </motion.div>

          {/* Read More Button */}
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Link href={project.link} className="group w-fit flex items-center space-x-3 bg-black text-white px-8 py-4 uppercase tracking-[6px] text-sm font-semibold transition-all duration-300">
              <span>Read More</span>
              <ChevronArrowWithTail direction="right" size="md" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2 relative overflow-hidden group" style={{ minHeight: '60vh' }}>
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${project.image})` }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.767, 0.01, 0.18, 1.01] }}
        />
        
        {/* Overlay that slides away on entrance */}
        <motion.div
          className="absolute inset-0 bg-black z-10"
          variants={imageOverlayVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        />
      </div>
    </article>
  );
};


// Main Portfolio Component
interface PortfolioProps {
  projects?: ProjectData[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects = [] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  

  // Header animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.767, 0.01, 0.18, 1.01]
      }
    }
  };

  return (
    <div className="bg-gray-50 py-30" ref={ref}>
      {/* Section Header */}
      <div className="">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-2"
          >
            <div className="overflow-hidden inline-block">
              <div className="relative">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black uppercase tracking-tight">
                  Recent Works
                </h1>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: .5, duration: 0.6 }}
          >
            <p className="text-black uppercase tracking-widest text-sm font-bold">
              We Offer Digital Solutions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-0">
        {projects.map((project, index) => {
          const articleRef = useRef(null);
          const articleInView = useInView(articleRef, { once: true, margin: "-200px" });
          
          return (
            <div key={project.id} ref={articleRef}>
              <PortfolioArticle 
                project={project} 
                index={index} 
                isInView={articleInView}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;