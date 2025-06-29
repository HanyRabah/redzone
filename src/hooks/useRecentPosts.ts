import { useEffect, useState } from "react";

interface RecentPostType {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  excerpt: string;
  content: string;
  authorId: string | null;
  author: {
    name: string | null;
  } | null;
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
}

export const useRecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState<RecentPostType[]>([]);

  const getRecentPosts = async () => {
    const recentPosts = await fetch('/api/admin/blog/recent-posts').then(res => res.json());
    setRecentPosts(recentPosts);
  };

  useEffect(() => {
    getRecentPosts();
  }, []);

  return {
    recentPosts,
  };
};
  