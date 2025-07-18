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
  LinearProgress,
  Alert,
  Stack,
  alpha,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  BarChart as BarChartIcon,
  Close as CloseIcon,
  Warning as WarningIcon
} from '@mui/icons-material'
import { toast } from 'sonner'
import { Project, ProjectCategory } from '@prisma/client'

interface PortfolioCategoriesManagerProps {
  categories: ProjectCategory[]
  projects: Project[]
}

export default function PortfolioCategoriesManager({ categories, projects }: PortfolioCategoriesManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string>('')
  const [newCategoryName, setNewCategoryName] = useState('')

  const openEditDialog = (categoryName: string) => {
    setEditingCategory(categoryName)
    setNewCategoryName(categoryName)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingCategory('')
    setNewCategoryName('')
    setIsDialogOpen(true)
  }

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    // Check if category already exists (case insensitive)
    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === newCategoryName.toLowerCase() && cat.name !== editingCategory
    )

    if (existingCategory) {
      toast.error('Category already exists')
      return
    }

    try {
      if (editingCategory) {
        // Update category (rename all projects with this category)
        const response = await fetch(`/api/admin/categories/${editingCategory}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldName: editingCategory,
            newName: newCategoryName.trim()
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update category')
        }

        toast.success('Category updated successfully')
      } else {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newCategoryName.trim()
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create category')
        }
        toast.success('Category created successfully')
      }

      router.refresh()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Failed to save category')
    }
  }

  const handleDeleteCategory = async (categoryName: string) => {
    // ADD a confirmation from the user
    const confirmMessage = `Are you sure you want to delete the category "${categoryName}"?`
    const action = confirm(confirmMessage)
    if (!action) return
    
    const projectsInCategory = projects.filter(p => categories.find(cat => cat.id === p.categoryId)?.name === categoryName)
    let moveToUncategorized = false
    if (projectsInCategory.length > 0) {
      const confirmMessage = `This category has ${projectsInCategory.length} project(s). What would you like to do with them?`
      
      const action = confirm(`${confirmMessage}\n\nClick OK to move them to "Uncategorized" or Cancel to abort.`)
      
      if (!action) {
        return
      }
      moveToUncategorized = true
    }

    try {
      const categoryId = categories.find(cat => cat.name === categoryName)?.id
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: categoryId,
          moveToUncategorized
        }),
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

  const totalProjects = projects.length

  const getCategoryColor = (index: number) => {
    const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1', '#7b1fa2', '#5d4037']
    return colors[index % colors.length]
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Portfolio Categories
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Organize your portfolio projects into categories
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
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#1976d2', 0.05), border: `1px solid ${alpha('#1976d2', 0.1)}` }}>
          <Stack direction="row" spacing={4} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FolderIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                {categories.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categories
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BarChartIcon sx={{ color: '#2e7d32' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                {totalProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Projects
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <FolderOpenIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No categories found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Categories are created automatically when you add projects, or you can create them manually.
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
              
              return (
                <Grid key={category.name} size={{ xs: 12, sm: 6, md: 4 }}>
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
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: alpha(categoryColor, 0.1),
                              color: categoryColor
                            }}
                          >
                            <FolderIcon />
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {category.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {projects.filter(p => p.categoryId === category.id).length} project{projects.filter(p => p.categoryId === category.id).length !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit Category">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(category.name)}
                              sx={{ color: categoryColor }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={category.postCount > 0 ? "Cannot delete category with projects" : "Delete Category"}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteCategory(category.name)}
                                disabled={category.postCount > 0}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Usage
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round((projects.filter(p => p.categoryId === category.id).length / projects.length) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.max(5, (projects.filter(p => p.categoryId === category.id).length / projects.length) * 100)} // Minimum 5% for visibility
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
                          label={`${projects.filter(p => p.categoryId === category.id).length} projects`}
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
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Category Statistics
            </Typography>
            
            <Stack spacing={3}>
              {categories
                .sort((a, b) => b.postCount - a.postCount)
                .map((category, index) => {
                  const categoryColor = getCategoryColor(index)
                  const totalProjects = projects.filter(p => p.categoryId === category.id).length || 0
                  const percentage = Math.round(totalProjects / projects.length * 100)
                  
                  return (
                    <Box key={category.name}>
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
                        value={Math.max(2, percentage)} // Minimum 2% for visibility
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
        
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveCategory()}
              autoFocus
            />
            
            {editingCategory && (
              <Alert 
                severity="warning" 
                icon={<WarningIcon />}
                sx={{ borderRadius: 2 }}
              >
                <Typography variant="body2">
                  <strong>Warning:</strong> Renaming this category will update all{' '}
                  {projects.filter(p => p.categoryId === categories.find(cat => cat.name === editingCategory)?.id).length || 0} project(s) that use it.
                </Typography>
              </Alert>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            variant="outlined" 
            onClick={() => setIsDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveCategory}
            disabled={!newCategoryName.trim()}
            sx={{ borderRadius: 2 }}
          >
            {editingCategory ? 'Update' : 'Create'} Category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}