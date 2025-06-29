"use client"
import { useEffect, useState } from "react";
import { Project } from "@prisma/client";



const BlogHero = ({ project }: { project: Project| null }) => {
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
                <div className="flex flex-wrap gap-4">
                  {/* TODO: add category */}
                  {/* @ts-ignore fix type later */}
                  In: {project?.category?.name}
                </div>
                <div className="flex flex-wrap gap-4">
                  <span
                    className="text-gray-300"
                    style={{ transitionDelay: "800ms" }}
                  >
                    {project?.createdAt?.toDateString()}
                  </span>
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
