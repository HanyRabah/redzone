'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  alpha,
  Fab,
  Alert,
  AlertTitle,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Work as WorkIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
} from '@mui/icons-material'
import { toast } from 'sonner'
import { useState } from 'react'
import { ExternalLinkIcon, BriefcaseBusiness as PortfolioIcon } from 'lucide-react'
import { Project } from '@prisma/client'



interface HomeProjectsManagerProps {
  projects: Project[]
}

export default function HomeProjectsManager({ projects }: HomeProjectsManagerProps) {
  const router = useRouter()
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)

  const handleToggleFeatured = async (projectId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      })

      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ path: '/portfolio' }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      toast.success(isFeatured ? 'Removed from featured' : 'Added to featured')
      router.refresh()
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    }
  }

  const featuredProjects = projects.filter(project => project.isFeatured)
  const activeProjects = projects.filter(project => project.isActive)
  const displayedProjects = showOnlyFeatured ? featuredProjects : projects

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      'web': '#1976d2',
      'mobile': '#2e7d32', 
      'design': '#ed6c02',
      'branding': '#9c27b0',
      'ecommerce': '#d32f2f'
    }
    return colors[categoryId.toLowerCase() as keyof typeof colors] || '#757575'
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <HomeIcon sx={{ color: 'white' }} />
          </Avatar>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
            Home Projects Manager
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
          Manage which projects appear on the home page. Featured projects are showcased to visitors.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ExternalLinkIcon />}
          component={Link}
          href="/admin/dashboard/portfolio"
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
          }}
        >
          Manage All Projects
        </Button>
      </Paper>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: 'Total Projects',
            value: projects.length,
            icon: WorkIcon,
            color: '#1976d2'
          },
          {
            title: 'Featured Projects',
            value: featuredProjects.length,
            icon: StarIcon,
            color: '#ed6c02'
          },
          {
            title: 'Active Projects',
            value: activeProjects.length,
            icon: VisibilityIcon,
            color: '#2e7d32'
          }
        ].map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
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

      {/* Filter Controls */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Projects Display
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyFeatured}
                onChange={(e) => setShowOnlyFeatured(e.target.checked)}
                color="primary"
              />
            }
            label="Show Only Featured"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {showOnlyFeatured 
            ? `Showing ${featuredProjects.length} featured projects`
            : `Showing all ${projects.length} projects`
          }
        </Typography>
      </Paper>

      {/* Projects Grid */}
      {displayedProjects.length === 0 ? (
        <Paper sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {showOnlyFeatured ? 'No featured projects found' : 'No projects found'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {showOnlyFeatured 
                ? 'Start by featuring some projects to showcase on your home page'
                : 'Create your first project to get started'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<PortfolioIcon />}
              component={Link}
              href="/admin/portfolio"
              sx={{ borderRadius: 2 }}
            >
              Go to Portfolio Manager
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {displayedProjects.map((project) => {
            const categoryColor = getCategoryColor(project.categoryId || 'web')
            
            return (
              <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    border: project.isFeatured ? `2px solid ${alpha('#ed6c02', 0.3)}` : '1px solid',
                    borderColor: project.isFeatured ? alpha('#ed6c02', 0.3) : 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  {/* Project Image */}
                  <Box sx={{ position: 'relative', height: 200 }}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    
                    {/* Featured Toggle */}
                    <Tooltip title={project.isFeatured ? 'Remove from featured' : 'Add to featured'}>
                      <Fab
                        size="small"
                        onClick={() => handleToggleFeatured(project.id, project.isFeatured)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: project.isFeatured ? '#ed6c02' : 'rgba(255,255,255,0.9)',
                          color: project.isFeatured ? 'white' : '#ed6c02',
                          '&:hover': {
                            bgcolor: project.isFeatured ? '#f57c00' : 'white'
                          }
                        }}
                      >
                        {project.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                      </Fab>
                    </Tooltip>

                    {/* Category Badge */}
                    <Chip
                      icon={<CategoryIcon />}
                      label={project.categoryId}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: alpha(categoryColor, 0.9),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />

                    {/* Featured Badge */}
                    {project.isFeatured && (
                      <Chip
                        icon={<StarIcon />}
                        label="Featured"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          bgcolor: '#ed6c02',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {project.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {project.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!project.isActive && (
                          <Chip
                            icon={<VisibilityOffIcon />}
                            label="Inactive"
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      <Tooltip title="Edit Project">
                        <IconButton
                          component={Link}
                          href="/admin/dashboard/portfolio"
                          size="small"
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Information Panel */}
      <Alert 
        severity="info" 
        sx={{ 
          borderRadius: 3,
          bgcolor: alpha('#1976d2', 0.05),
          border: `1px solid ${alpha('#1976d2', 0.2)}`
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>How Featured Projects Work</AlertTitle>
        <Typography variant="body2">
          Projects marked as Featured will automatically appear on your home page in a dedicated showcase section. 
          You can manage all projects from the Portfolio Manager and toggle featured status here or there. 
          Featured projects help highlight your best work to visitors.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            icon={<StarIcon />}
            label="Click star to feature/unfeature"
            variant="outlined"
          />
          <Chip
            size="small"
            icon={<EditIcon />}
            label="Click edit to modify project"
            variant="outlined"
          />
        </Box>
      </Alert>

      {/* Quick Actions Fab */}
      <Fab
        color="primary"
        aria-label="manage portfolio"
        component={Link}
        href="/admin/dashboard/portfolio"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <PortfolioIcon />
      </Fab>
    </Box>
  )
}