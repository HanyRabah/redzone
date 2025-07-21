import { prisma } from '@/lib/prisma'
import AboutPage from '@/components/Dashboard/About'

async function getAboutPageData() {
  const [heroSlider, whoWeAreSection, teamSection, teamMembers, weAreCreativeSection] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'about' }, include: {slides: true} }),
    prisma.whoWeAreSection.findFirst(),
    prisma.teamSection.findFirst(),
    prisma.teamMember.findMany({ 
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.weAreCreativeSection.findFirst()
  ])

  return {
    heroSlider,
    whoWeAreSection,
    teamSection,
    teamMembers,
    weAreCreativeSection
  }
}

export default async function Page() {
  const data = await getAboutPageData()

  return (
    <AboutPage data={data} />
  )
}