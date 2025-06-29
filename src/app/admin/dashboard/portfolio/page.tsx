// app/admin/portfolio/page.tsx
import { prisma } from '@/lib/prisma'
import { Card, CardContent} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HeroSectionForm from '@/components/admin/forms/HeroSectionForm'
import PortfolioProjectsManager from '@/components/admin/managers/PortfolioProjectsManager'
import PortfolioCategoriesManager from '@/components/admin/managers/PortfolioCategoriesManager'

async function getPortfolioData() {
  const [heroSlider, projects, categories] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'portfolio' },
      include: {
        slides: true
      }
    }),    prisma.project.findMany({ 
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.projectCategory.findMany()
  ])

  return {
    heroSlider,
    projects,
    categories
  }
}

export default async function PortfolioManager() {
  const data = await getPortfolioData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Portfolio Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your portfolio page content and projects
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero Slider</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardContent>
              <HeroSectionForm 
                page="portfolio" 
                initialData={data.heroSlider} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardContent>
              <PortfolioProjectsManager 
                projects={data.projects}
                categories={data.categories}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardContent>
              <PortfolioCategoriesManager 
                categories={data.categories}
                projects={data.projects}
              />
            </CardContent>
          </Card>
        </TabsContent>

      
      </Tabs>
    </div>
  )
}

