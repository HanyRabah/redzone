"use client"
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import BlogPosts from '@/components/Dashboard/Blog/Components/BlogPosts'
import BlogCategories from '@/components/Dashboard/Blog/Components/BlogCategories'
import BlogTags from '@/components/Dashboard/Blog/Components/BlogTags'
//import BlogStatsOverview from '@/components/Dashboard/Blog/Components/BlogStatsOverview'

import HeroSectionForm from '@/components/Dashboard/_Components/HeroSectionForm'
import PageTitle from '@/components/Dashboard/_Layout/PageTitle'
import EnhancedTabs from '@/components/Dashboard/_Layout/Tabs'



const tabs =[
  { label: "Hero Section", value: 0 },
  // { label: "Overview", value: 1 },
  { label: "Posts", value: 2 },
  { label: "Categories", value: 3 },
  { label: "Tags", value: 4 },
]

export default function BlogPage({data}) {
    const {heroSection, posts, categories, tags, authors} = data;
    const params = useSearchParams();
    const tab = params?.get("tab");
    const [value, setValue] = useState(0);
    
    useEffect(() => {
      if(tab) {
        setValue(Number(tab));
      }
    },[tab])

  return (
    <div className="space-y-6">
      <PageTitle
        title="Blog Page"
        description="Manage your blog content, posts, categories, and settings"
      />

      <EnhancedTabs
        tabs={tabs}
        defaultValue={value}
      >
        <HeroSectionForm page="blog" initialData={heroSection} />
        {/* <BlogStatsOverview posts={posts} categories={categories} tags={tags} /> */}
        <BlogPosts posts={posts} categories={categories} tags={tags} authors={authors} />
        <BlogCategories categories={categories} posts={posts} />
        <BlogTags tags={tags} />
      </EnhancedTabs>
    </div>
  )
}
