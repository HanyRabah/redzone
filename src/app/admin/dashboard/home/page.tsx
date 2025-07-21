// app/admin/home/page.tsx
import { prisma } from '@/lib/prisma'
import HomePage from '@/components/Dashboard/Home'

async function getHomePageData() {
  const [heroSlider, aboutUsSection, clients, testimonials, projects, categories, sections] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'home' }, include: {slides: true} }),
    prisma.aboutUsSection.findFirst(),
    prisma.client.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.project.findMany(),
    prisma.projectCategory.findMany(),
    prisma.sections.findMany({ where: { page: 'home' } })
  ])

  return {
    heroSlider,
    aboutUsSection,
    clients,
    testimonials,
    projects,
    categories,
    sections
  }
}

export default async function Page() {
  const data = await getHomePageData()

  return (
   <HomePage data={data} />
  )
}
