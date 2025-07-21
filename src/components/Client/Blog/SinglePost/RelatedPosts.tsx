import { BlogPost, BlogCategory, BlogTag, User } from "@prisma/client";
import Image from "next/image";


interface BlogPostType extends BlogPost {
  categories: BlogCategory[];
  tags: BlogTag[];
  author: User;
}
  
const RelatedPosts = ({ posts }: { posts: BlogPostType[] }) => {
    return (
      <div className="mt-16 pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 font-['Oswald'] uppercase tracking-wider">
          You might also like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="overflow-hidden">
                <Image 
                  src={post.image || ''}
                  alt={post.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-['Oswald'] text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300 mb-2">
                  {post.title}
                </h3>
                <div className="text-gray-500 text-sm">
                  {post.publishedAt?.toDateString()}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };
  
  export default RelatedPosts;