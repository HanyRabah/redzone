import { BlogTag } from "@prisma/client";


const TagClouds = ({ tagClouds }: { tagClouds: BlogTag[] }) => {
  return (
    <div className="p-6 border-b border-gray-700">
      <h4 className="text-red-600 font-['Oswald'] font-bold uppercase tracking-wider mb-6">Tag Clouds</h4>
      <div className="flex flex-wrap gap-2">
        {tagClouds.map((tag, index) => (
          <a 
            key={index}
            href={`/tag/${tag.name}`} 
            className="text-white hover:text-red-600 hover:bg-red-600 hover:bg-opacity-20 transition-all duration-300 font-['Oswald'] text-sm uppercase tracking-wide px-3 py-1 rounded border border-gray-600 hover:border-red-600"
          >
            {tag.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default TagClouds;