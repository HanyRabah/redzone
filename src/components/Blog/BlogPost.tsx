import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { BlogPost as BlogPostType } from "@prisma/client";

interface BlogPostProps {
    post: BlogPostType;
    index: number;
}

const BlogPost = ({ post, index }: BlogPostProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <article className={`mb-20 bg-[#f0f0f0] rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <a href={`/blog/${post.slug}`} className="block relative overflow-hidden">
        <div className="relative overflow-hidden h-[200px] md:h-[400px] lg:h-[600px]">
          <Image     
            className="w-full object-cover transform group-hover:scale-115 transition-transform duration-700 ease-in-out" 
            src={post.image || ''}
            alt={post.title || ''}
            fill
          />
          {/* <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div> */}
        </div>
        <div className="p-6">
          <h3 className="text-3xl uppercase font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
            {/* {post.title.map((line, i) => (
              <span key={i} className={`block transition-all duration-300 delay-${i * 100}`}>
                {line}
              </span>
            ))} */}
            {post.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </a>
      <div className="p-6 pt-0">
        {/* Categories */}
        <ul className="flex flex-wrap items-center mb-3 text-sm">
          <li><i className="fas fa-thumbtack text-red-600 mr-2"></i></li>
          {/* {post.categories.map((category, i) => (
            <li key={i}>
              <a href={`/category/${category}`} className="text-gray-600 hover:text-red-600 transition-colors mr-3 font-['Oswald'] uppercase tracking-wide">
                {category}
              </a>
            </li>
          ))} */}
        </ul>
        
        {/* Tags */}
        <ul className="flex flex-wrap items-center mb-6 text-sm">
          <li><i className="fas fa-tags text-red-600 mr-2"></i></li>
          {/* {post.tags.map((tag, i) => (
            <li key={i}>
              <a href={`/tag/${tag}`} className="text-gray-600 hover:text-red-600 transition-colors mr-3 font-['Oswald'] uppercase tracking-wide">
                {tag}
              </a>
            </li>
          ))} */}
        </ul>
        
        {/* Author & Date */}
        <div className="flex justify-between items-center text-sm">
          {/* <a href={`/author/${post.author.toLowerCase().replace(' ', '-')}`} className="font-xs text-gray-900 hover:text-red-600 transition-colors font-semibold uppercase tracking-wide pointer-small">
            {post.author}
          </a> */}
          <span className="font-xs text-gray-900 hover:text-red-600 font-semibold uppercase tracking-wide pointer-small">
            {post.publishedAt?.toDateString()}
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;