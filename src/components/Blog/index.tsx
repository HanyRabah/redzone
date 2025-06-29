"use client"
import { BlogCategory, BlogPost as BlogPostType, BlogTag } from "@prisma/client";
import { useState } from "react";
//import LoadMoreButton from "./LoadMore";
import BlogPost from "./BlogPost";
import Sidebar from "./SideBar";

const BlogPage = ({blogPosts, categories, tags}: {blogPosts: BlogPostType[], categories: BlogCategory[], tags: BlogTag[]}) => {
    const [posts, setPosts] = useState(blogPosts);
    
   
    const [searchTerm, setSearchTerm] = useState('');
    console.log("🚀 ~ BlogPage ~ searchTerm:", searchTerm)

    const onSearch = (searchTerm: string) => {
      if(!searchTerm) {
        setPosts(blogPosts);
        return;
      }
      setSearchTerm(searchTerm);
    };
   
    // useEffect(() => {
    //   const filteredPosts = posts.filter((post) => {
    //     return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    //   });
    //   setPosts(filteredPosts);
    // }, [searchTerm, posts]);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-wrap lg:flex-nowrap gap-8">
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              {posts.map((post, index) => (
                <BlogPost key={post.id} post={post} index={index} />
              ))}
              {/* <LoadMoreButton loadMorePosts={loadMorePosts} /> */}
            </div>
  
            {/* Sidebar */}
            <Sidebar categories={categories} tagClouds={tags} onSearch={onSearch} />
          </div>
        </div>
      </div>
    );
  };
  
  export default BlogPage;