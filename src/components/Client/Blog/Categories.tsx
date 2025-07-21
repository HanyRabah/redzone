import React from 'react';
import { BlogCategory } from '@prisma/client';
 
const Categories = ({categories}: {categories: BlogCategory[]}) => {
  return (
    <div className="p-6 border-b border-gray-700">
      <h4 className="text-red-600 font-['Oswald'] font-bold uppercase tracking-wider mb-6">Categories</h4>
      <ul className="space-y-3">
        {categories.map((category, index) => (
          <li key={index}>
            <a 
              href={`/category/${category.slug}`} 
              className="text-white hover:text-red-600 transition-colors font-['Oswald'] text-sm uppercase tracking-wide block py-1"
            >
              {category.name} ({category.postCount})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
