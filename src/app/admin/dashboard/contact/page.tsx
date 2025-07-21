import { prisma } from '@/lib/prisma'
import ContactPage from '@/components/Dashboard/Contact'

async function getContactData() {
  const [heroSlider, contactDetails, submissions] = await Promise.all([
    prisma.heroSlider.findUnique({
      where: { page: "contact" },
      include: {
        slides: true,
      },
    }),
    prisma.contactDetails.findFirst(),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    heroSlider,
    contactDetails,
    submissions,
  };
}

export default async function Page() {
  const data = await getContactData()
  return <ContactPage data={data} />
}
