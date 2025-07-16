'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  LinearProgress,
  alpha,
  Avatar,
  CircularProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  BarChart as BarChartIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  Link as LinkIcon
} from '@mui/icons-material'
import { toast } from 'sonner'
import { BlogCategory, BlogPost } from '@prisma/client'



interface BlogCategoriesManagerProps {
  categories: BlogCategory[]
  posts: BlogPost[]
}

// CategoryForm Component
function CategoryForm({ 
  category, 
  onClose 
}: { 
  category: BlogCategory | null
  onClose: () => void 
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: ''
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = category 
        ? `/api/admin/blog/categories/${category.id}`
        : '/api/admin/blog/categories'
      
      const method = category ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || generateSlug(formData.name)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save category')
      }

      toast.success(`Category ${category ? 'updated' : 'created'} successfully`)
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save category')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Category Name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter category name"
            required
            error={!formData.name.trim()}
            helperText={!formData.name.trim() ? 'Category name is required' : ''}
          />

          <TextField
            fullWidth
            label="URL Slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="url-friendly-slug"
            required
            error={!formData.slug.trim()}
            helperText={!formData.slug.trim() ? 'URL slug is required' : `URL: /blog/category/${formData.slug}`}
            InputProps={{
              startAdornment: <LinkIcon sx={{ color: 'action.active', mr: 1 }} />
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Category description for SEO and organization"
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          disabled={isLoading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          disabled={isLoading || !formData.name.trim() || !formData.slug.trim()}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
          sx={{ borderRadius: 2 }}
        >
          {isLoading ? 'Saving...' : category ? 'Update' : 'Create'} Category
        </Button>
      </DialogActions>
    </Box>
  )
}

export default function BlogCategoriesManager({ categories, posts }: BlogCategoriesManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)

  const openEditDialog = (category: BlogCategory) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (categoryId: string) => {
    const postsInCategory = posts.filter(post => post.categoryId === categoryId)
    
    if (postsInCategory.length > 0) {
      const confirmMessage = `This category has ${postsInCategory.length} post(s). What would you like to do?`
      
      if (!confirm(`${confirmMessage}\n\nClick OK to remove the category from posts or Cancel to abort.`)) {
        return
      }
    }

    try {
      const response = await fetch(`/api/admin/blog/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      toast.success('Category deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const maxPostCount = Math.max(...categories.map(c => c.postCount), 1)
  const totalPosts = categories.reduce((sum, cat) => sum + cat.postCount, 0)

  const getCategoryColor = (index: number) => {
    const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1', '#7b1fa2', '#5d4037']
    return colors[index % colors.length]
  }

  const stats = [
    {
      title: 'Total Categories',
      value: categories.length,
      icon: CategoryIcon,
      color: '#1976d2'
    },
    {
      title: 'Total Posts',
      value: totalPosts,
      icon: ArticleIcon,
      color: '#2e7d32'
    },
    {
      title: 'Most Popular',
      value: categories.length > 0 ? categories.sort((a, b) => b.postCount - a.postCount)[0]?.name || 'None' : 'None',
      icon: TrendingUpIcon,
      color: '#ed6c02',
      isText: true
    }
  ]

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Blog Categories
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Organize your blog posts into categories for better content structure
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Add Category
          </Button>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Grid key={index} sx={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(stat.color, 0.1),
                        color: stat.color
                      }}
                    >
                      <IconComponent />
                    </Box>
                    <Box>
                      <Typography variant={stat.isText ? "h6" : "h4"} sx={{ 
                        fontWeight: 700, 
                        color: stat.color,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 150
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </Box>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No categories found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create categories to organize your blog posts
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{ borderRadius: 2 }}
          >
            Create Your First Category
          </Button>
        </Paper>
      ) : (
        <Stack spacing={4}>
          {/* Categories Cards */}
          <Grid container spacing={3}>
            {categories.map((category, index) => {
              const categoryColor = getCategoryColor(index)
              const percentage = (category.postCount / maxPostCount) * 100
              
              return (
                <Grid key={category.id} sx={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: alpha(categoryColor, 0.2),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                        borderColor: alpha(categoryColor, 0.4)
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(categoryColor, 0.1),
                              color: categoryColor
                            }}
                          >
                            <FolderIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {category.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LinkIcon fontSize="small" />
                              /{category.slug}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {category.postCount} post{category.postCount !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit Category">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(category)}
                              sx={{ color: categoryColor }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Category">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(category.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Usage
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(percentage)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.max(5, percentage)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(categoryColor, 0.1),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: categoryColor,
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={`${category.postCount} posts`}
                          size="small"
                          sx={{
                            bgcolor: alpha(categoryColor, 0.1),
                            color: categoryColor,
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>

          {/* Category Statistics */}
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <BarChartIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Category Statistics
              </Typography>
            </Box>
            
            <Stack spacing={3}>
              {categories
                .sort((a, b) => b.postCount - a.postCount)
                .map((category, index) => {
                  const categoryColor = getCategoryColor(index)
                  const percentage = (category.postCount / totalPosts) * 100
                  
                  return (
                    <Box key={category.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: categoryColor
                            }}
                          />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {category.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {percentage.toFixed(1)}%
                          </Typography>
                          <Chip
                            label={category.postCount}
                            size="small"
                            sx={{
                              bgcolor: alpha(categoryColor, 0.1),
                              color: categoryColor,
                              fontWeight: 600,
                              minWidth: 40
                            }}
                          />
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.max(2, percentage)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(categoryColor, 0.1),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: categoryColor,
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  )
                })}
            </Stack>
          </Paper>
        </Stack>
      )}

      {/* Category Form Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 1 }}>
          <DialogTitle sx={{ p: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <IconButton onClick={() => setIsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <CategoryForm 
          category={editingCategory} 
          onClose={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </Box>
  )
}