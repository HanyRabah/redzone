import TestimonialsPage from "@/components/Dashboard/Testimonials"
import { prisma } from "@/lib/prisma"
import { Testimonial } from "@prisma/client"

async function getTestimonialsData() {
  const [
    totalTestimonials,
    testimonials,
  ] = await Promise.all([
    prisma.testimonial.count({ where: { isActive: true } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return {
    totalTestimonials,
    testimonials,
  }
}
 

export default async function Page() {
    const { testimonials } = await getTestimonialsData()
    return <TestimonialsPage testimonials={testimonials as Testimonial[]} />
}