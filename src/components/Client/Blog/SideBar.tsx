import Categories from "./Categories";
import RecentPosts from "./RecentPosts";
import SearchForm from "./SearchForm";
import TagClouds from "./TagClouds";
//import InstagramWidget from "./InstagramWidget";
import { BlogCategory, BlogTag } from "@prisma/client";
 interface SidebarProps {
    categories: BlogCategory[];
    tagClouds: BlogTag[];
    //instagramPosts?: string[];
    onSearch: (searchTerm: string) => void;
}
const Sidebar = ({categories, tagClouds, onSearch}: SidebarProps) => {
  
  return (
    <aside className="w-full lg:w-1/3">
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
        <SearchForm onSearch={onSearch} />
        <Categories categories={categories} />
        <RecentPosts />
        <TagClouds tagClouds={tagClouds} />
        {/* <InstagramWidget instagramPosts={instagramPosts} /> */}
      </div>
    </aside>
  );
};

export default Sidebar;
