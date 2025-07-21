import { User, UserSocial } from "@prisma/client";
import Image from "next/image";

const AuthorBio = ({ author }: { author: User & { social: UserSocial } }) => {
    return (
      <div className="bg-white rounded-lg p-8 mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
          {author.image &&
          <div className="flex-shrink-0">
            <Image 
              src={author.image}
              alt={author.name || ""}
              className="w-32 h-32 rounded-lg object-cover"
              width={128}
              height={128}
            />
          </div>
          }
          <div className="flex-1">
            <h5 className="text-xl font-bold text-gray-900 font-['Oswald'] mb-4">
              {author.name}
            </h5>
            <p className="text-gray-600 leading-relaxed mb-4">
              {author.bio}
            </p>
            <div className="flex space-x-4">
              {author?.social && Object.entries(author?.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  className="w-8 h-8 bg-gray-100 hover:bg-red-600 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <i className={`fab fa-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AuthorBio;

