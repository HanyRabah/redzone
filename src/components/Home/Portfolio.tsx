"use client"
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronArrowWithTail } from "../Layout/Arrow/arrow";
import Link from "next/link";
import { Project } from "@prisma/client";

interface PortfolioArticleProps {
  project: Project;
  index: number;
  isInView?: boolean;
}

// Individual Article Component
const PortfolioArticle: React.FC<Omit<PortfolioArticleProps, 'isInView'>> = ({
  project,
  index,
}) => {
  const articleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(articleRef, {
    once: true,
    margin: "-200px",
  });

  // Helper function to process title into lines
  const getTitleLines = (title: string | string[]): string[] => {
    if (Array.isArray(title)) {
      return title;
    }

    // Method 1: Split by line breaks (\n)
    if (title.includes("\n")) {
      return title.split("\n");
    }

    // Method 2: Auto-break by word count (every 3-4 words)
    const words = title.split(" ");
    const lines: string[] = [];
    const wordsPerLine = 3; // Adjust this number as needed

    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(" "));
    }

    return lines;
  };

  const titleLines = getTitleLines(project.title);

  // Animation variants for description sliding up
  const descriptionVariants = {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 1.2,
        duration: 0.8,
        ease: [0.767, 0.01, 0.18, 1.01],
      },
    },
  };

  const isEven = index % 2 === 0;
  // Image overlay animation variants
  const imageOverlayVariants = {
    hidden: {
      x: isEven ? "0%" : "0%",
    },
    visible: {
      x: isEven ? "100%" : "-100%",
      transition: {
        delay: 0.3,
        duration: 1.2,
        ease: [0.767, 0.01, 0.18, 1.01],
      },
    },
  };

  const overlayVariants = {
    hidden: { x: 0 },
    visible: (i: number) => ({
      x: "110%",
      transition: {
        delay: 0.6 + i * 0.1,
        duration: 1,
        ease: [0.858, 0.01, 0.068, 0.99],
      },
    }),
  };

  return (
    <div ref={articleRef}>
      <article
        className={`h-auto lg:h-[60vh] mt-20 flex flex-col md:flex-row lg:flex-row items-stretch ${
          isEven ? "" : "lg:flex-row-reverse"
        }`}
      >
        {/* Content Section */}
        <div
          className={`w-full sm:w-full md:w-1/2 lg:w-1/2 flex items-center justify-${
            isEven ? "end" : "start"
          }`}
        >
          <div className="w-full sm:w-full md:w-full lg:w-2/3 2xl:w-1/2 justify-end px-6">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span
                className={`uppercase tracking-widest text-sm font-bold text-red-500`}
              >
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

            <Link
              href={project.link || "#"}
              className="group w-fit flex items-center space-x-3 bg-black text-white px-8 py-4 uppercase tracking-[6px] text-sm font-semibold transition-all duration-300"
            >
              <span>Read More</span>
              <motion.div
                whileHover={{ x: 30 }}
                transition={{ duration: 0.6, ease: [0.767, 0.01, 0.18, 1.01] }}
              >
                <ChevronArrowWithTail direction="right" size="md" />
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 h-[40vh] lg:h-[60vh] my-6 relative overflow-hidden group pointer-large">
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
    </div>
  );
};

// Main Portfolio Component
interface PortfolioProps {
  projects?: Project[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects = [] }) => {
  return (
    <div className="bg-gray-50 py-30">
      {/* Section Header */}
      <div className="">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.767, 0.01, 0.18, 1.01] }}
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-black uppercase tracking-widest text-sm font-bold">
              We Offer Digital Solutions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-0">
        {projects.map((project, index) => (
          <PortfolioArticle
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
