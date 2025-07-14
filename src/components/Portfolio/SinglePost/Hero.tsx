"use client";
import { useEffect, useState } from "react";
import { Project, ProjectCategory } from "@prisma/client";

const BlogHero = ({
  project,
  categories,
}: {
  project: Project | null;
  categories: ProjectCategory[] | null;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute left-0 top-0 w-full lg:w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${project?.image})` }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-32">
        <div className="flex items-center min-h-screen">
          <div className="w-full lg:w-1/2 lg:ml-auto lg:pl-16">
            <div
              className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-white font-['Oswald'] leading-tight mb-8">
                <span
                  className={`block transform transition-all duration-700 delay-300 uppercase`}
                >
                  {project?.title}
                </span>
              </h1>

              <div className="flex flex-col gap-4 text-white font-['Oswald'] text-sm uppercase tracking-wider">
                <div className="flex flex-wrap gap-8">
                  <div className="font-bold">CLIENT: {project?.client}</div>
                  <div className="font-bold">YEAR: {project?.year}</div>
                  <div className="font-bold">CATEGORY:
                  {
                    categories?.find(
                      (category) => category.id === project?.categoryId
                    )?.name
                  }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
