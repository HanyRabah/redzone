import PortfolioDetailPage from "@/components/Portfolio/SinglePost";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getPageData = async () => {
  const PortfolioData = await prisma.project.findMany({
 
    include: {
      category: true,
    },
  });

  return PortfolioData;
};

const PortfolioPage= async ({ params }: PageProps) => {
  const { slug } = await params;
  const PortfolioData = await getPageData();
  const currentProject = PortfolioData.find((project) => project.slug === slug);

  return (
    <main className="relative mb-100">
    <PortfolioDetailPage project={currentProject} allprojects={PortfolioData} />
    </main>
  );
};

export default PortfolioPage;
