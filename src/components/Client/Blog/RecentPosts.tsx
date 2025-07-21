"use client";
import Image from "next/image";
import { useRecentPosts } from "@/hooks/useRecentPosts";


export default function RecentPosts() { 
  const { recentPosts } =  useRecentPosts();

  return (
    <div className="p-6 border-b border-gray-700">
      <h4 className="text-red-600 font-['Oswald'] font-bold uppercase tracking-wider mb-6">Recent Posts</h4>
      <div className="space-y-4">
        {recentPosts.map((post) => (
          <div key={post.id} className="flex items-center space-x-3 group">
            <a href={`/blog/${post.id}`} className="flex-shrink-0 w-16 h-16 overflow-hidden">
              <Image 
                className="object-cover rounded-xs" 
                src={post.image || ''}
                alt={post.title}
                width={64}
                height={64}
              />
            </a>
            <div className="flex-1 min-w-0">
              <a 
                href={`/blog/${post.id}`} 
                className="text-white hover:text-red-600 transition-colors font-['Oswald'] text-sm leading-tight block group-hover:text-red-600"
              >
                {post.title}
              </a>
              <div className="text-gray-400 text-xs mt-1">{new Date(post.createdAt).toDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};  