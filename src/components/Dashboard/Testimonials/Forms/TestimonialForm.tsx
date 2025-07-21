
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ImageUpload from '@/components/Dashboard/_Components/ImageUpload'
import { Testimonial } from "@prisma/client"
import React from 'react'
import { Button, FormControl, Switch, TextField } from '@mui/material'
import { Label } from '@radix-ui/react-dropdown-menu'

// TestimonialForm Component
export default function TestimonialForm({ testimonial, onClose }: { testimonial: Testimonial | null, onClose: () => void }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
      name: testimonial?.name || '',
      role: testimonial?.role || '',
      content: testimonial?.content || '',
      avatar: testimonial?.avatar || '',
      rating: testimonial?.rating || 5,
      isActive: testimonial?.isActive ?? true,
      isFeatured: testimonial?.isFeatured ?? false,
      sortOrder: testimonial?.sortOrder || 0
    })
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
  
      try {
        const url = testimonial 
          ? `/api/admin/testimonials/${testimonial.id}`
          : '/api/admin/testimonials'
        
        const method = testimonial ? 'PUT' : 'POST'
        debugger
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to save testimonial')
        }
  
        toast.success(`Testimonial ${testimonial ? 'updated' : 'created'} successfully`)
  
        router.refresh()
        onClose()
      } catch (error) {
        console.error('Error saving testimonial:', error)
        toast.error('Failed to save testimonial')
      } finally {
        setIsLoading(false)
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormControl>
            <TextField
              id="name"
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </FormControl>
          <FormControl>
            <TextField
              id="role"
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              required
            />
          </FormControl>
        </div>
  
        <FormControl fullWidth>
          <TextField
            id="content"
            label="Content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            multiline
            required
            rows={4}
            sx={{ my: 2 }}
          />
        </FormControl>
  
        <ImageUpload
          label="Avatar (optional)"
          value={formData.avatar}
          onChange={(avatar) => setFormData(prev => ({ ...prev, avatar }))}
        />
  
        <div className="grid grid-cols-4 gap-4">
            <FormControl>
            <TextField
              id="sortOrder"
              label="Sort Order"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
            />
            </FormControl>
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            />
            <Label>Active</Label>
          </div>
        </div>
  
        <div className="flex justify-end space-x-2 gap-2">
          <Button type="button" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Saving...' : testimonial ? 'Update' : 'Create'} Testimonial
          </Button>
        </div>
      </form>
    )
  }