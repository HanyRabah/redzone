'use client'

import {
  Box,
  Button,
  Chip,
  Typography,
  Grid,
  Paper,
  Stack,
  alpha,
  Avatar,
  LinearProgress,
  ChipProps
} from '@mui/material'
import {
  Add as AddIcon,
  Article as FileTextIcon,
  Visibility as EyeIcon,
  Schedule as CalendarIcon,
  LocalOffer as TagIcon,
  Folder as FolderIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { BlogPost, BlogCategory, BlogTag, User } from '@prisma/client'

type BlogPostWithAuthor = BlogPost & {
  author: User | null
}

interface BlogStatsOverviewProps {
  posts: BlogPostWithAuthor[]
  categories: BlogCategory[]
  tags: BlogTag[]
}

export default function BlogStatsOverview({ posts, categories, tags }: BlogStatsOverviewProps) {
  const publishedPosts = posts.filter(post => post.isPublished)
  const draftPosts = posts.filter(post => !post.isPublished)
  const featuredPosts = posts.filter(post => post.isFeatured)
  const recentPosts = posts.slice(0, 5)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const stats = [
    {
      title: 'Total Posts',
      value: posts.length,
      icon: FileTextIcon,
      description: 'All blog posts',
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
    },
    {
      title: 'Published',
      value: publishedPosts.length,
      icon: EyeIcon,
      description: 'Live on website',
      color: '#2e7d32',
      gradient: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
    },
    {
      title: 'Drafts',
      value: draftPosts.length,
      icon: CalendarIcon,
      description: 'Unpublished posts',
      color: '#ed6c02',
      gradient: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)'
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: FolderIcon,
      description: 'Content categories',
      color: '#9c27b0',
      gradient: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)'
    },
    {
      title: 'Tags',
      value: tags.length,
      icon: TagIcon,
      description: 'Content tags',
      color: '#d81b60',
      gradient: 'linear-gradient(135deg, #d81b60 0%, #c2185b 100%)'
    },
    {
      title: 'Featured',
      value: featuredPosts.length,
      icon: TrendingUpIcon,
      description: 'Featured posts',
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)'
    }
  ]

  const quickActions = [
    {
      label: 'New Blog Post',
      href: '/admin/dashboard/blog/new',
      icon: AddIcon,
      variant: 'contained' as const,
      color: 'primary' as const
    },
    {
      label: `View Drafts (${draftPosts.length})`,
      href: '/admin/dashboard/blog?tab=posts&filter=drafts',
      icon: EditIcon,
      variant: 'outlined' as const
    },
    {
      label: 'Manage Categories',
      href: '/admin/dashboard/blog?tab=categories',
      icon: FolderIcon,
      variant: 'outlined' as const
    },
    {
      label: 'Manage Tags',
      href: '/admin/dashboard/blog?tab=tags',
      icon: TagIcon,
      variant: 'outlined' as const
    }
  ]

  const maxCategoryCount = Math.max(...categories.map(c => c.postCount), 1)

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Blog Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your blog content and track performance
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Quick Actions
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <Button
                key={index}
                variant={action.variant}
                color={action.color}
                startIcon={<IconComponent />}
                component={Link}
                href={action.href}
                sx={{ borderRadius: 2 }}
              >
                {action.label}
              </Button>
            )
          })}
        </Stack>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    borderColor: alpha(stat.color, 0.4)
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: stat.gradient,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <IconComponent />
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={4}>
        {/* Recent Posts */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Recent Posts
            </Typography>
            
            {recentPosts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <FileTextIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No posts yet
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {recentPosts.map((post) => (
                  <Paper
                    key={post.id}
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: post.isPublished ? 'success.main' : 'warning.main',
                          width: 40,
                          height: 40
                        }}
                      >
                        {post.isPublished ? <EyeIcon /> : <EditIcon />}
                      </Avatar>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600, 
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          by {post.author?.name} • {formatDate(post.createdAt)}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={post.isPublished ? 'Published' : 'Draft'}
                            size="small"
                            color={post.isPublished ? 'success' : 'warning'}
                            variant="filled"
                          />
                          {post.isFeatured && (
                            <Chip
                              label="Featured"
                              size="small"
                              color="primary"
                              icon={<StarIcon />}
                              variant="filled"
                            />
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Top Categories */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Top Categories
            </Typography>
            
            {categories.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No categories yet
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {categories
                  .sort((a, b) => b.postCount - a.postCount)
                  .slice(0, 6)
                  .map((category, index) => {
                    const percentage = (category.postCount / maxCategoryCount) * 100
                    const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d81b60', '#f57c00']
                    const color = colors[index % colors.length]
                    
                    return (
                      <Box key={category.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: alpha(color, 0.1),
                                color: color,
                                width: 32,
                                height: 32
                              }}
                            >
                              <FolderIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {category.name}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${category.postCount} posts`}
                            size="small"
                            sx={{
                              bgcolor: alpha(color, 0.1),
                              color: color,
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.max(5, percentage)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(color, 0.1),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: color,
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                    )
                  })}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Popular Tags */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Popular Tags
            </Typography>
            
            {tags.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <TagIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No tags yet
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags
                  .sort((a, b) => b.postCount - a.postCount)
                  .slice(0, 15)
                  .map((tag, index) => {
                    const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info']
                    const color = colors[index % colors.length] as ChipProps['color']
                    
                    return (
                      <Chip
                        key={tag.name}
                        label={`${tag.name} (${tag.postCount})`}
                        variant="outlined"
                        color={color}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: alpha('#1976d2', 0.1)
                          }
                        }}
                      />
                    )
                  })}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}