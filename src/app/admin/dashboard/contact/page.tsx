// app/admin/contact/page.tsx
import { prisma } from '@/lib/prisma'
import HeroSectionForm from '@/components/admin/forms/HeroSectionForm'
import ContactDetailsForm from '@/components/admin/forms/ContactDetailsForm'
import ContactAccordion from '@/components/admin/contact/accordion'

interface ContactDetailsData {
  id?: string
  title: string
  description: string
  contacts: ContactItem[]
  isActive: boolean
}

interface ContactItem {
  title: string
  items: string[]
}

async function getContactData() {
  const [heroSlider, contactDetails] = await Promise.all([
    prisma.heroSlider.findUnique({ where: { page: 'contact' },
      include: {
        slides: true
      }
    }),
    prisma.contactDetails.findFirst(),
   
  ])

  return {
    heroSlider,
    contactDetails,
  }
}

export default async function ContactManager() {
  const data = await getContactData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contact Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage contact page content and form submissions
        </p>
      </div>

      {/* <ContactAccordion data={data} /> */}

      <ContactAccordion data={[{
        title: "Hero Section",
        children: <HeroSectionForm page="contact" initialData={data.heroSlider} /> 
      },
      {
        title: "Contact Us Section",
        children: <ContactDetailsForm initialData={data.contactDetails as unknown as ContactDetailsData} />
      }
      // }, 
      // {
      //   title: "Contact Form",
      //   children: <ContactSubmissionsManager submissions={data.submissions} />
      // }
    ]} />
    </div>
  )
}
