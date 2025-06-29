"use client"
import { Project } from "@prisma/client";

const NextProjectButton = ({PortfolioData, slug}: {PortfolioData?: Project[] | null, slug?: string}) => {
    if (!PortfolioData || !slug) {
        return null;
    }
    const handleNextProject = () => {
        const currentIndex = PortfolioData.findIndex((project) => project.slug === slug);
        const nextIndex = (currentIndex + 1) % PortfolioData.length;
        const nextProject = PortfolioData[nextIndex];
        window.location.href = `/portfolio/${nextProject?.slug}`;
    };
    return (
        <button className="bg-red-500 text-black px-4 py-30 text-6xl font-bold uppercase tracking-wider  -m-20 rounded-none w-screen" onClick={handleNextProject} >Next Project</button>  
    );
};

export default NextProjectButton;