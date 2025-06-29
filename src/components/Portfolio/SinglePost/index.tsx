"use client"
import Hero from "./Hero";
import ContentRenderer from "./ContentRenderer";
import { Project } from "@prisma/client";
import NextProjectButton from "../NextProjectButton";


const PortfolioDetailPage = ({ allprojects, project }: { allprojects?: Project[] | null, project?: Project | null }) => {
    console.log("🚀 ~ PortfolioDetailPage ~ project:", project)
    if (!project) {
      return null;
    }
    return (
      <div className="min-h-screen">
        <Hero project={project} />
  
        {/* Main Content */}
        <div id="content" className="py-20">
          <div className="flex flex-wrap lg:flex-nowrap gap-8">
            {/* Article Content */}
            <div className="w-full">
              <article className="bg-white rounded-lg overflow-hidden shadow-lg px-10 md:px-20 py-20">
                {/* Article Content */}
                <div className="flex flex-row gap-10 md:gap-40 items-center mb-10">
                  <div className="text-3xl font-semibold uppercase">{project.title}</div>
                  <div className="text-gray-400 text-xl">{project.description}</div>
                </div>
                <div className="p-8 lg:p-12">
                  <ContentRenderer content={project.content} />
                </div>
                <div className="p-8 lg:p-12 mb-20">
                  {/* // youtube viedo link player */}
                  <iframe className="w-full h-300" src={project.link || ""} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </div>
              <NextProjectButton PortfolioData={allprojects} slug={project.slug} />
              </article>
  
              {/* Related Posts */}
              {/* <RelatedPosts posts={[]} /> */}
            </div>  
  
          </div>
        </div>
      </div>
    );
  };
  
  export default PortfolioDetailPage;