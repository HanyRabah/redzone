'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  TextField,
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
  Stack,
  LinearProgress,
  alpha,
  Avatar,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Fab,
  Zoom,
  CircularProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocalOffer as TagIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  CloudQueue as CloudIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material'
import { toast } from 'sonner'
import { BlogTag } from '@prisma/client'

interface BlogTagsManagerProps {
  tags: BlogTag[]
}

// TagForm Component
function TagForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tagName, setTagName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/blog/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: tagName.trim().toLowerCase(), slug: tagName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create tag')
      }

      toast.success('Tag created successfully')
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create tag')
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
            label="Tag Name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter tag name"
            required
            error={!tagName.trim()}
            helperText={!tagName.trim() ? 'Tag name is required' : 'Tag will be automatically converted to lowercase'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TagIcon color="action" />
                </InputAdornment>
              )
            }}
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
          disabled={isLoading || !tagName.trim()}
          startIcon={isLoading ? <CircularProgress size={16} /> : <AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          {isLoading ? 'Creating...' : 'Create Tag'}
        </Button>
      </DialogActions>
    </Box>
  )
}

export default function BlogTagsManager({ tags }: BlogTagsManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteTag = async (tagName: string) => {
    const tagToDelete = tags.find(tag => tag.name === tagName)

    if (!tagToDelete) {
      toast.error('Tag not found')
      return
    }
    
    if (tagToDelete) {
      if (!confirm(`the tag ${tagToDelete.name} is used in ${tagToDelete.postCount} post(s). Are you sure you want to remove it from all posts?`)) {
        return
      }
    }

    try {
      const response = await fetch(`/api/admin/blog/tags/${encodeURIComponent(tagToDelete.id)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete tag')
      }

      toast.success('Tag deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting tag:', error)
      toast.error('Failed to delete tag')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTags.length === 0) {
      toast.error('Please select tags to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedTags.length} tag(s)?`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/blog/tags/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: selectedTags }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete tags')
      }

      toast.success(`${selectedTags.length} tag(s) deleted successfully`)
      setSelectedTags([])
      router.refresh()
    } catch (error) {
      console.error('Error deleting tags:', error)
      toast.error('Failed to delete tags')
    }
  }

  const toggleTagSelection = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    )
  }

  const selectAllTags = () => {
    if (selectedTags.length === filteredTags.length) {
      setSelectedTags([])
    } else {
      setSelectedTags(filteredTags.map(tag => tag.name))
    }
  }

  const getTagSize = (count: number, maxCount: number) => {
    const ratio = count / maxCount
    if (ratio > 0.7) return 'large'
    if (ratio > 0.4) return 'medium'
    return 'small'
  }

  type TagColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'

  const getTagColor = (index: number) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    return colors[index % colors.length]  as TagColor
  }

  const maxCount = Math.max(...tags.map(t => t.postCount), 1)
  const multiUseTags = tags.filter(tag => tag.postCount > 1).length
  const singleUseTags = tags.filter(tag => tag.postCount === 1).length

  const stats = [
    {
      title: 'Total Tags',
      value: tags.length,
      icon: TagIcon,
      color: '#1976d2'
    },
    {
      title: 'Multi-use Tags',
      value: multiUseTags,
      icon: TrendingUpIcon,
      color: '#2e7d32'
    },
    {
      title: 'Single-use Tags',
      value: singleUseTags,
      icon: BarChartIcon,
      color: '#ed6c02'
    }
  ]

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Blog Tags Manager
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage tags used across your blog posts
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            {selectedTags.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                sx={{ borderRadius: 2 }}
              >
                Delete Selected ({selectedTags.length})
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsDialogOpen(true)}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Add Tag
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Grid key={index} sx={{ xs: 12, sm: 4 }}>
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

      {/* Tags Cloud */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
        <Box sx={{ 
          p: 3, 
          bgcolor: alpha('#1976d2', 0.05),
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <CloudIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tags Cloud
            </Typography>
          </Box>
          
          {filteredTags.length > 0 && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedTags.length === filteredTags.length}
                  indeterminate={selectedTags.length > 0 && selectedTags.length < filteredTags.length}
                  onChange={selectAllTags}
                />
              }
              label="Select All"
            />
          )}
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          {filteredTags.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {filteredTags
                .sort((a, b) => b.postCount - a.postCount)
                .map((tag, index) => {
                  const isSelected = selectedTags.includes(tag.name)
                  const size = getTagSize(tag.postCount, maxCount)
                  const color = getTagColor(index)
                  
                  return (
                    <Box
                      key={tag.name}
                      sx={{ 
                        position: 'relative',
                        '&:hover .delete-btn': {
                          opacity: 1,
                        }
                      }}
                    >
                      <Chip
                        label={`#${tag.name} (${tag.postCount})`}
                        variant={isSelected ? 'filled' : 'outlined'}
                        color={isSelected ? 'primary' : color}
                        size={size === 'large' ? 'medium' : 'small'}
                        onClick={() => toggleTagSelection(tag.name)}
                        sx={{
                          fontSize: size === 'large' ? '1rem' : size === 'medium' ? '0.875rem' : '0.75rem',
                          height: size === 'large' ? 36 : size === 'medium' ? 32 : 28,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: isSelected ? '2px solid' : '1px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: 2
                          }
                        }}
                      />
                      <Fab
                        className="delete-btn"
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTag(tag.name)
                        }}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 20,
                          height: 20,
                          minHeight: 20,
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          '& .MuiSvgIcon-root': {
                            fontSize: '0.75rem'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </Fab>
                    </Box>
                  )
                })}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <TagIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? 'No tags match your search' : 'No tags found'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {!searchTerm && 'Create your first tag to get started'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Paper>

      {/* Popular Tags */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
            <TrendingUpIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Most Popular Tags
          </Typography>
        </Box>
        
        <Stack spacing={3}>
          {tags
            .sort((a, b) => b.postCount - a.postCount)
            .slice(0, 10)
            .map((tag, index) => {
              const percentage = (tag.postCount / maxCount) * 100
              //const color = getTagColor(index)
              
              return (
                <Box key={tag.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha('#1976d2', 0.1),
                          color: 'primary.main',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        #{tag.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {percentage.toFixed(1)}%
                      </Typography>
                      <Chip
                        label={tag.postCount}
                        size="small"
                        sx={{
                          bgcolor: alpha('#1976d2', 0.1),
                          color: 'primary.main',
                          fontWeight: 600,
                          minWidth: 40
                        }}
                      />
                      <Button
                        variant="text"
                        size="small" 
                        onClick={() => handleDeleteTag(tag.name)}
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.max(5, percentage)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha('#1976d2', 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#1976d2',
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              )
            })}
        </Stack>
      </Paper>

      {/* Tag Form Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ borderRadius: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 1 }}>
          <DialogTitle sx={{ p: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Add New Tag
          </DialogTitle>
          <IconButton onClick={() => setIsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <TagForm onClose={() => setIsDialogOpen(false)} />
      </Dialog>

      {/* Floating Action Button */}
      <Zoom in={selectedTags.length === 0}>
        <Fab
          color="primary"
          aria-label="add tag"
          onClick={() => setIsDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </Box>
  )
}