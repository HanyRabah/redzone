import TestimonialsManager from "@/components/admin/managers/TestimonialsManager"
import { prisma } from "@/lib/prisma"
import { Testimonial } from "@prisma/client"

async function getDashboardStats() {
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
 

const TestimonialsPage = async () => {
    const { testimonials } = await getDashboardStats()
    return <TestimonialsManager testimonials={testimonials as Testimonial[]} />
}

export default TestimonialsPage