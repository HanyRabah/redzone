// components/admin/forms/ProjectForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import ImageUpload from '@/components/admin/ImageUpload'
import { Loader2, Plus } from 'lucide-react'
import { Project } from '@prisma/client'


interface ProjectFormProps {
  project?: Project | null
  categories: string[]
  onClose: () => void
}

export default function ProjectForm({ project, categories, onClose }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)

  const [formData, setFormData] = useState({
    title: project?.title || '',
    category: project?.category || '',
    description: project?.description || '',
    image: project?.image || '',
    link: project?.link || '',
    slug: project?.slug || '',
    isActive: project?.isActive ?? true,
    isFeatured: project?.isFeatured ?? false,
    sortOrder: project?.sortOrder || 0
  })

  const [newCategory, setNewCategory] = useState('')

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleCategorySelect = (value: string) => {
    if (value === 'new') {
      setShowNewCategory(true)
    } else {
      setFormData(prev => ({ ...prev, category: value }))
      setShowNewCategory(false)
    }
  }

  const handleNewCategoryAdd = () => {
    if (newCategory.trim()) {
      setFormData(prev => ({ ...prev, category: newCategory.trim() }))
      setNewCategory('')
      setShowNewCategory(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required')
      setIsLoading(false)
      return
    }

    if (!formData.category.trim()) {
      toast.error('Category is required')
      setIsLoading(false)
      return
    }

    if (!formData.description.trim()) {
      toast.error('Description is required')
      setIsLoading(false)
      return
    }

    if (!formData.image.trim()) {
      toast.error('Project image is required')
      setIsLoading(false)
      return
    }

    try {
      const url = project 
        ? `/api/admin/projects/${project.id}`
        : '/api/admin/projects'
      
      const method = project ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || generateSlug(formData.title)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save project')
      }

      toast.success(`Project ${project ? 'updated' : 'created'} successfully`)
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save project')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Amazing Project Name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              {showNewCategory ? (
                <div className="flex space-x-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    onKeyPress={(e) => e.key === 'Enter' && handleNewCategoryAdd()}
                  />
                  <Button type="button" size="sm" onClick={handleNewCategoryAdd}>
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowNewCategory(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Select value={formData.category} onValueChange={handleCategorySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">
                      <div className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Category
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Brief description of the project..."
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Media</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            label="Project Image *"
            value={formData.image}
            onChange={(image) => setFormData(prev => ({ ...prev, image }))}
          />
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="link">External Link (optional)</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://project-website.com"
                type="url"
              />
            </div>
            
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="project-url-slug"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(isActive) => setFormData(prev => ({ ...prev, isActive }))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(isFeatured) => setFormData(prev => ({ ...prev, isFeatured }))}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            project ? 'Update Project' : 'Create Project'
          )}
        </Button>
      </div>
    </form>
  )
}
