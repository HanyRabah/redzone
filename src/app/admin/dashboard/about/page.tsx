// app/admin/about/page.tsx
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HeroSectionForm from '@/components/admin/forms/HeroSectionForm'
import WhoWeAreSectionForm from '@/components/admin/forms/WhoWeAreSectionForm'
import TeamSectionManager from '@/components/admin/managers/TeamSectionManager'
import WeAreCreativeSectionForm from '@/components/admin/forms/WeAreCreativeSectionForm'

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

export default async function AboutPageManager() {
  const {heroSlider, whoWeAreSection, teamSection, teamMembers, weAreCreativeSection} = await getAboutPageData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          About Page Content
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage all content sections for your about page
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="who-we-are">Who We Are</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="creative">We Are Creative</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent>
              <HeroSectionForm 
                page="about" 
                initialData={heroSlider} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="who-we-are">
          <Card>
            <CardHeader>
              <CardTitle>Who We Are Section</CardTitle>
            </CardHeader>
            <CardContent>
              <WhoWeAreSectionForm 
                initialData={whoWeAreSection} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Section</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamSectionManager 
                teamSection={teamSection}
                teamMembers={teamMembers} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creative">
          <Card>
            <CardHeader>
              <CardTitle>We Are Creative Section</CardTitle>
            </CardHeader>
            <CardContent>
              <WeAreCreativeSectionForm 
                initialData={weAreCreativeSection} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}