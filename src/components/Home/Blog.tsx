"use client";
import React, { useRef } from "react";
import { Box } from "@mui/material";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MdPushPin } from "react-icons/md";
import { FaTags } from "react-icons/fa6";
import { BlogCategory, BlogPost, BlogTag, User } from "@prisma/client";

interface BlogPostTypes extends BlogPost {
  categories: BlogCategory[]
  tags: BlogTag[];
  author: User | null;
    
}
interface BlogProps {
  blogPosts: BlogPostTypes[];
}

const Blog = ({ blogPosts }: BlogProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.767, 0.01, 0.18, 1.01],
      },
    },
  };

  const overlayVariants = {
    hidden: { x: 0 },
    visible: { x: "100%" },
  };

  return (
    <Box className="bg-[#f5f5f5] py-20 mb-20" ref={ref}>
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="overflow-hidden">
            <h2 className="text-[40px] md:text-[55px] lg:text-[65px] font-black text-black uppercase tracking-tight text-center">
              <motion.span
                className="inline-block relative"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 1,
                      ease: [0.767, 0.01, 0.18, 1.01],
                    },
                  },
                }}
              >
                From the blog
                <motion.div
                  className="absolute inset-0 bg-[#f5f5f5]"
                  variants={overlayVariants}
                  transition={{ duration: 1, ease: [0.858, 0.01, 0.068, 0.99] }}
                />
              </motion.span>
            </h2>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-black uppercase tracking-widest text-sm font-semibold">
              Check our latest news
            </p>
          </motion.div>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {blogPosts.map((post) => {
            const wordPairs = post.title.split(" ").reduce((acc: string[][], w: string, i: number) => {
              if (i % 2 === 0)
                acc.push([w]); 
              else acc[acc.length - 1].push(w);
              return acc;
            }, []);

            return (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="bg-[#f0f0f0] overflow-hidden group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <Box className="relative h-[300px] overflow-hidden pointer-large">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.858, 0.01, 0.068, 0.99],
                      }}
                      className="h-full"
                    >
                      <Image
                        src={post.image || ""}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-[#f0f0f0]"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: [0.858, 0.01, 0.068, 0.99],
                        }}
                        style={{ opacity: 0.7 }}
                      />
                    </motion.div>
                  </Box>

                  <Box className="p-6">
                    <h5
                      className="
                        inline-flex flex-col
                        w-max
                        gap-x-2
                        leading-none
                        text-[30px] font-medium uppercase tracking-tight
                        mb-4 group-hover:text-red-500 transition-colors duration-300 pointer-large
                      "
                    >
                      {wordPairs.map((pair: string[], rowIdx: number) => (
                        <span key={rowIdx} className="flex gap-0">
                          {" "}
                          {pair.map((word: string, colIdx: number) => (
                            <motion.span
                              key={colIdx}
                              className="overflow-hidden mr-2" /* clip for animation   */
                            >
                              <motion.span
                                className="inline-block"
                                initial={{ y: "100%" }}
                                animate={isInView ? { y: 0 } : { y: "100%" }}
                                transition={{
                                  delay: 0.5 + (rowIdx * 2 + colIdx) * 0.05,
                                  duration: 0.8,
                                  ease: [0.767, 0.01, 0.18, 1.01],
                                }}
                              >
                                {word}
                              </motion.span>
                            </motion.span>
                          ))}
                        </span>
                      ))}
                    </h5>

                    {/* Categories */}
                    <Box className="flex flex-wrap gap-2 my-4">
                      <Box className="flex items-center text-gray-600 text-xs tracking-[5px] uppercase pointer-small">
                        <MdPushPin className="w-4 h-4 mr-2 text-gray-400" />
                        {post.categories.map((category, i) => (
                          <span
                            key={i}
                            className="mr-2 hover:text-red-500 transition-colors"
                          >
                            {category.name}
                          </span>
                        ))}
                      </Box>
                    </Box>

                    {/* Tags */}
                    <Box className="flex flex-wrap gap-2 mb-4">
                      <Box className="flex items-center text-gray-600 text-xs tracking-[5px] uppercase pointer-small">
                        <FaTags className="w-4 h-4 mr-2 text-gray-400" />
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="mr-2 hover:text-red-500 transition-colors"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </Box>
                    </Box>

                    {/* Author and Date */}
                    <Box className="flex justify-between text-xs text-black font-semibold uppercase tracking-[1px] mt-10 pointer-small">
                      <span className="hover:text-red-500 transition-colors">
                        {post.author?.name}
                      </span>
                      <span className="hover:text-red-500 transition-colors">
                        {post.publishedAt?.toLocaleDateString()}
                      </span>
                    </Box>
                  </Box>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </Box>
  );
};

export default Blog;
