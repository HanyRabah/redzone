import PortfolioDetailPage from "@/components/Client/Portfolio/SinglePost";
import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from 'next/cache';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getPageData = async () => {
  noStore();
  const [categories, projects] = await Promise.all([
    prisma.projectCategory.findMany(),
    prisma.project.findMany({ 
      orderBy: { sortOrder: 'asc' }
    }),
  ])

  return {
    categories,
    projects,
  };
};

const PortfolioPage= async ({ params }: PageProps) => {
  const { slug } = await params;
  const {categories, projects} = await getPageData();
  const currentProject = projects.find((project) => project.slug === slug);

  return (
    <main className="relative mb-100">
    <PortfolioDetailPage project={currentProject} allprojects={projects} categories={categories} />
    </main>
  );
};

export default PortfolioPage;
