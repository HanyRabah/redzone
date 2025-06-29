// app/admin/home/page.tsx
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HeroSectionForm from '@/components/admin/forms/HeroSectionForm'
import AboutUsSectionForm from '@/components/admin/forms/AboutUsSectionForm'
import ClientsManager from '@/components/admin/managers/ClientsManager'
import TestimonialsManager from '@/components/admin/managers/TestimonialsManager'
import HomeProjectsManager from '@/components/admin/managers/HomeProjectsManager'

async function getHomePageData() {
  const [heroSlider, aboutUsSection, clients, testimonials, featuredProjects] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'home' }, include: {slides: true} }),
    prisma.aboutUsSection.findFirst(),
    prisma.client.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.project.findMany({ 
      where: { isFeatured: true },
      orderBy: { sortOrder: 'asc' }
    })
  ])

  return {
    heroSlider,
    aboutUsSection,
    clients,
    testimonials,
    featuredProjects
  }
}

export default async function HomePageManager() {
  const data = await getHomePageData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Home Page Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your home page content and sections
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Us</TabsTrigger>
          <TabsTrigger value="projects">Featured Projects</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent>
              <HeroSectionForm 
                page="home" 
                initialData={data.heroSlider} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Us Section</CardTitle>
            </CardHeader>
            <CardContent>
              <AboutUsSectionForm 
                initialData={data.aboutUsSection} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Featured Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <HomeProjectsManager 
                projects={data.featuredProjects}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clients Showcase</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientsManager 
                clients={data.clients}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Client Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <TestimonialsManager 
                testimonials={data.testimonials}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
