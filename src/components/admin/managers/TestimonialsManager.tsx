
// components/admin/managers/TestimonialsManager.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { Testimonial } from "@prisma/client"
import { Box, Button, Divider, Drawer, Typography } from '@mui/material'
import React from 'react'
import { TableList } from '../tables/TestimonialsTable'
import TestimonialForm from '../forms/TestimonialForm'

interface TestimonialsManagerProps {
  testimonials: Testimonial[]
}

export default function TestimonialsManager({ testimonials }: TestimonialsManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingTestimonial(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete testimonial')
      }

      toast.success('Testimonial deleted successfully')

      router.refresh()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Failed to delete testimonial')
    }
  }

 

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Customer testimonials and reviews
        </p>
        <React.Fragment key={"right"}>
          <Button onClick={openCreateDialog} variant="contained">
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>

          <Drawer
            anchor="right"
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
          >
            <Box
              sx={{
                width: "40vw",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "20px",
              }}
            >
              <Typography variant="h6">
                {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
              </Typography>
              <TestimonialForm 
              testimonial={editingTestimonial} 
              onClose={() => setIsDialogOpen(false)}
            />
            </Box>
          </Drawer>
        </React.Fragment> 
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ justifyContent: "center" }}>
          <CardContent className="flex justify-center items-center gap-2 align-middle ">
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "32px" }}>{testimonials.length}</Typography>
            <Typography variant="body2" sx={{ fontWeight: "normal", fontSize: "14px" }}>Total Testimonials</Typography>
          </CardContent>
        </Card>
        <Card style={{ justifyContent: "center" }}>
          <CardContent className="flex justify-center items-center gap-2 align-middle ">
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "32px" }}>{testimonials.filter(c => c.isActive).length}</Typography>
            <Typography variant="body2" sx={{ fontWeight: "normal", fontSize: "14px" }}>Active Testimonials</Typography>
          </CardContent>
        </Card>
        <Card style={{ justifyContent: "center" }}>
          <CardContent className="flex justify-center items-center gap-2 align-middle ">
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "32px" }}>{testimonials.filter(c => c.isFeatured).length}</Typography>
            <Typography variant="body2" sx={{ fontWeight: "normal", fontSize: "14px" }}>Featured Testimonials</Typography>
          </CardContent>
        </Card>
        <Card style={{ justifyContent: "center" }}>
          <CardContent className="flex justify-center items-center gap-2 align-middle ">
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "32px" }}>{testimonials.reduce((total, testimonial) => total + (testimonial.rating || 0), 0) / testimonials.length}</Typography>
            <Typography variant="body2" sx={{ fontWeight: "normal", fontSize: "14px" }}>Average Rating</Typography>
          </CardContent>
        </Card>
      </div>
      <Divider sx={{ my: 2 }}/>

      <div className="flex w-full">
        <TableList<Testimonial> data={testimonials} editItem={openEditDialog} deleteItem={handleDelete} />
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No testimonials found</p>
        </div>
      )}
    </div>
  )
}

