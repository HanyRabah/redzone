'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  Stack,
  CardMedia,
  alpha
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as ExternalLinkIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Category as CategoryIcon,
  Work as WorkIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { toast } from 'sonner'
import ProjectForm from '@/components/admin/forms/ProjectForm'
import { Project, ProjectCategory } from '@prisma/client'

 


interface PortfolioProjectsManagerProps {
  projects: Project[]
  categories: ProjectCategory[]
}

export default function PortfolioProjectsManager({ projects, categories }: PortfolioProjectsManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.categoryId?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategoryId === 'all' || categories.find(cat => cat.id === project.categoryId)?.name === selectedCategoryId
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && project.isActive) ||
                           (statusFilter === 'inactive' && !project.isActive) ||
                           (statusFilter === 'featured' && project.isFeatured)
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [projects, searchTerm, selectedCategoryId, statusFilter, categories])

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingProject(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      toast.success('Project deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  // const handleBulkAction = async (action: string, projectIds: string[]) => {
  //   if (projectIds.length === 0) {
  //     toast.error('Please select projects first')
  //     return
  //   }

  //   if (!confirm(`Are you sure you want to ${action} ${projectIds.length} project(s)?`)) return

  //   try {
  //     const response = await fetch('/api/admin/projects/bulk', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         action,
  //         projectIds
  //       }),
  //     })

  //     if (!response.ok) {
  //       throw new Error(`Failed to ${action} projects`)
  //     }

  //     toast.success(`Projects ${action}d successfully`)
  //     router.refresh()
  //   } catch (error) {
  //     console.error(`Error ${action}ing projects:`, error)
  //     toast.error(`Failed to ${action} projects`)
  //   }
  // }

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: WorkIcon,
      color: '#1976d2'
    },
    {
      title: 'Active Projects',
      value: projects.filter(p => p.isActive).length,
      icon: VisibilityIcon,
      color: '#2e7d32'
    },
    {
      title: 'Featured Projects',
      value: projects.filter(p => p.isFeatured).length,
      icon: StarIcon,
      color: '#ed6c02'
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: CategoryIcon,
      color: '#9c27b0'
    }
  ]

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Portfolio Projects
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your portfolio projects and showcase your work
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  transition: 'transform 0.2s ease',
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
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
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

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategoryId}
              label="Category"
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.name} value={category.name}>
                  {category.name} ({category.postCount})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active Only</MenuItem>
              <MenuItem value="inactive">Inactive Only</MenuItem>
              <MenuItem value="featured">Featured Only</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{ borderRadius: 2, px: 3, py: 1.5 }}
          >
            Add Project
          </Button>
        </Stack>
      </Paper>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || categories.find(cat => cat.name === selectedCategoryId)?.name !== 'all' || statusFilter !== 'all'
              ? 'No projects match your filters'
              : 'No projects found'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {!searchTerm && categories.find(cat => cat.name === selectedCategoryId)?.name === 'all' && statusFilter === 'all' && 
              'Get started by adding your first project'
            }
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredProjects.map((project) => (
              <Grid key={project.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  {/* Project Image */}
                  <Box sx={{ position: 'relative', height: 200 }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: '100%',
                        backgroundImage: `url(${project.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}
                    />
                    
                    {/* Status Badges */}
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <Stack spacing={1}>
                        {project.isFeatured && (
                          <Chip
                            label="Featured"
                            size="small"
                            icon={<StarIcon />}
                            sx={{
                              bgcolor: alpha('#ed6c02', 0.9),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        )}
                        {!project.isActive && (
                          <Chip
                            label="Inactive"
                            size="small"
                            icon={<VisibilityOffIcon />}
                            sx={{
                              bgcolor: alpha('#d32f2f', 0.9),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        )}
                        <Chip
                          label={categories.find(cat => cat.id === project.categoryId)?.name}
                          size="small"
                          sx={{
                            bgcolor: alpha('#1976d2', 0.9),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </Stack>
                    </Box>

                    {/* Sort Order Badge */}
                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                      <Chip
                        label={`#${project.sortOrder}`}
                        size="small"
                        sx={{
                          bgcolor: alpha('#000', 0.7),
                          color: 'white',
                          fontWeight: 600,
                          minWidth: 40
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Project Content */}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {project.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {project.description}
                    </Typography>
                  </CardContent>

                  {/* Actions */}
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit Project">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(project)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete Project">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(project.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {project.link && (
                        <Tooltip title="View Project">
                          <IconButton
                            size="small"
                            component="a"
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: 'success.main' }}
                          >
                            <ExternalLinkIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {project.createdAt.toLocaleDateString()}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Results Summary */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredProjects.length} of {projects.length} projects
            </Typography>
          </Box>
        </>
      )}

      {/* Project Form Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 1 }}>
          <DialogTitle sx={{ p: 0, fontSize: '1.5rem', fontWeight: 600 }}>
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
          <IconButton onClick={() => setIsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 1 }}>
          {/* Uncomment when ProjectForm is available */}
          <ProjectForm 
            project={editingProject} 
            categories={categories}
            onClose={() => setIsDialogOpen(false)}
          />
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              ProjectForm component will be rendered here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {editingProject ? `Editing: ${editingProject.title}` : 'Creating new project'}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}