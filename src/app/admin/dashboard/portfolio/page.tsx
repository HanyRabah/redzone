import { prisma } from '@/lib/prisma'
import PortfolioPage from '@/components/Dashboard/Portfolio'

async function getPortfolioData() {
  const [heroSlider, projects, categories, sections] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'portfolio' },
      include: {
        slides: true
      }
    }),    prisma.project.findMany({ 
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.projectCategory.findMany(),
    prisma.sections.findMany({ where: { page: 'portfolio' } })
  ])

  return {
    heroSlider,
    projects,
    categories,
    sections
  }
}

export default async function Page() {
  const data = await getPortfolioData();

 return <PortfolioPage data={data} />
}

