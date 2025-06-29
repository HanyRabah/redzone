"use client"
import BlogHero from "./BlogHero";
import ContentRenderer from "./ContentRenderer";
import SocialShare from "./SocialShare";
import RelatedPosts from "./RelatedPosts";
import AuthorBio from "./AuthorBio";
import Sidebar from "../SideBar";
import { BlogPost, UserSocial } from "@prisma/client";
import { BlogCategory, BlogTag, User } from "@prisma/client";


interface UserType extends User {
  social: UserSocial;
}

interface BlogPostType extends BlogPost {
  categories: BlogCategory[];
  tags: BlogTag[];
  author: UserType;
} 

const BlogDetailPage = ({ blogPost }: { blogPost: BlogPostType | null }) => {
    if (!blogPost) {
      return null;
    }
    return (
      <div className="min-h-screen bg-gray-50">
        <BlogHero post={blogPost} />
  
        {/* Main Content */}
        <div id="content" className="container mx-auto px-4 py-20">
          <div className="flex flex-wrap lg:flex-nowrap gap-8">
            {/* Article Content */}
            <div className="w-full lg:w-2/3">
              <article className="bg-white rounded-lg overflow-hidden shadow-lg">
                {/* Featured Image */}
                {/* <div className="overflow-hidden">
                  <Image 
                    src={blogPost.image || ''}
                    alt={blogPost.title}
                    fill
                    className="w-full h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  />
                </div> */}
  
                {/* Article Content */}
                <div className="p-8 lg:p-12">
                  <ContentRenderer content={blogPost.content} />
                  <SocialShare />
                </div>
              </article>
  
              {/* Related Posts */}
              <RelatedPosts posts={[]} />
  
              {/* Author Bio */}
              <AuthorBio author={blogPost.author} />
            </div>
  
            {/* Sidebar */}
            <Sidebar categories={blogPost.categories} tagClouds={blogPost.tags} onSearch={() => {}} />
          </div>
        </div>
      </div>
    );
  };
  
  export default BlogDetailPage;