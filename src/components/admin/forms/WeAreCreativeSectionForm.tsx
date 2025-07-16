'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  Grid,
  Chip,
  alpha,
  Avatar,
  CircularProgress,
  Fab,
  Badge
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Palette as PaletteIcon,
  Image as ImageIcon,
  Title as TitleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PhotoLibrary as PhotoLibraryIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material'
import { toast } from 'sonner'
import ImageUpload from '../ImageUpload'
import AdvancedRichTextEditor from '@/components/RichTextEditor'

interface WeAreCreativeSectionData {
  id?: string
  title: string
  description: string
  images: string[]
  isActive: boolean
}

interface WeAreCreativeSectionFormProps {
  initialData?: WeAreCreativeSectionData | null
}

export default function WeAreCreativeSectionForm({ initialData }: WeAreCreativeSectionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<WeAreCreativeSectionData>({
    title: initialData?.title || 'We Are Creative',
    description: initialData?.description || '',
    images: initialData?.images || [''],
    isActive: initialData?.isActive ?? true
  })

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImage = (index: number) => {
    if (formData.images.length <= 1) {
      toast.error('At least one image is required')
      return
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Filter out empty images
    const filteredImages = formData.images.filter(img => img.trim() !== '')
    
    if (filteredImages.length === 0) {
      toast.error('At least one image is required')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/we-are-creative-section', {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: filteredImages,
          id: initialData?.id || 'main'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save creative section')
      }

      toast.success('We Are Creative section saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving creative section:', error)
      toast.error('Failed to save creative section')
    } finally {
      setIsLoading(false)
    }
  }

  const validImages = formData.images.filter(img => img.trim() !== '')
  const getImageColor = (index: number) => {
    const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1']
    return colors[index % colors.length]
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #9c27b0 0%, #e1bee7 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <PaletteIcon sx={{ color: 'white' }} />
          </Avatar>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
            {initialData ? 'Edit' : 'Create'} Creative Section
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Showcase your creative work and approach with stunning visuals
        </Typography>
      </Paper>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Basic Information */}
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardHeader
              sx={{ 
                bgcolor: alpha('#9c27b0', 0.05),
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
              avatar={
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <TitleIcon />
                </Avatar>
              }
              title="Section Content"
              subheader="Main section title and description"
              action={
                <Chip
                  icon={formData.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  label={formData.isActive ? 'Active' : 'Inactive'}
                  color={formData.isActive ? 'success' : 'default'}
                  variant="outlined"
                />
              }
            />
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Section Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="We Are Creative"
                  required
                  error={!formData.title.trim()}
                  helperText={!formData.title.trim() ? 'Section title is required' : ''}
                  InputProps={{
                    startAdornment: <TitleIcon sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />

                {/* <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your creative process and approach..."
                  required
                  error={!formData.description.trim()}
                  helperText={
                    !formData.description.trim() 
                      ? 'Description is required' 
                      : `${formData.description.length} characters`
                  }
                  InputProps={{
                    startAdornment: <DescriptionIcon sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                  }}
                /> */}

                <AdvancedRichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                />  

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      color="secondary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {formData.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      <Typography>
                        {formData.isActive ? 'Section Active' : 'Section Inactive'}
                      </Typography>
                    </Box>
                  }
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Creative Gallery */}
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardHeader
              sx={{ 
                bgcolor: alpha('#1976d2', 0.05),
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
              avatar={
                <Badge badgeContent={validImages.length} color="primary">
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PhotoLibraryIcon />
                  </Avatar>
                </Badge>
              }
              title="Creative Gallery"
              subheader={`${formData.images.length} image${formData.images.length !== 1 ? 's' : ''} (${validImages.length} with content)`}
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addImage}
                  sx={{ borderRadius: 2 }}
                >
                  Add Image
                </Button>
              }
            />
            <CardContent sx={{ p: 0 }}>
              {formData.images.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No images added yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add images to showcase your creative work
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addImage}
                    sx={{ borderRadius: 2 }}
                  >
                    Add First Image
                  </Button>
                </Box>
              ) : (
                <Box sx={{ p: 4 }}>
                  {/* Image Preview Gallery */}
                  {/* {validImages.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Gallery Preview
                      </Typography>
                      <ImageList 
                        variant="masonry" 
                        cols={3} 
                        gap={8}
                        sx={{ 
                          borderRadius: 2,
                          overflow: 'hidden',
                          maxHeight: 300
                        }}
                      >
                        {validImages.map((image, index) => (
                          <ImageListItem key={index} sx={{ width: '100%', height: '120px' }}>
                            <Image  
                              src={image}
                              alt={`Creative work ${index + 1}`}
                              fill
                              style={{ borderRadius: 8 }}
                              onError={(e) => {
                                (e.target  as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
                              }}
                            />
                            <ImageListItemBar
                              title={`Image ${index + 1}`}
                              subtitle={`${image.substring(0, 30)}...`}
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )} */}

                  {/* <Divider sx={{ mb: 4 }} /> */}

                  {/* Image Management */}
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Manage Images
                  </Typography>
                  <Grid container spacing={3}>
                    {formData.images.map((image, index) => {
                      const imageColor = getImageColor(index)
                      const hasContent = image.trim() !== ''
                      
                      return (
                        <Grid key={index} size={{xs: 12, md: 6}}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              borderRadius: 2,
                              border: `2px solid ${hasContent ? imageColor : 'transparent'}`,
                              borderColor: hasContent ? alpha(imageColor, 0.3) : 'divider',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: hasContent ? imageColor : alpha('#1976d2', 0.5),
                                boxShadow: 2
                              }
                            }}
                          >
                            <CardHeader
                              sx={{ 
                                bgcolor: hasContent ? alpha(imageColor, 0.05) : alpha('#f5f5f5', 0.5),
                                py: 2
                              }}
                              avatar={
                                <Avatar 
                                  sx={{ 
                                    bgcolor: hasContent ? alpha(imageColor, 0.1) : 'grey.300',
                                    color: hasContent ? imageColor : 'grey.600',
                                    width: 32,
                                    height: 32
                                  }}
                                >
                                  {index + 1}
                                </Avatar>
                              }
                              title={
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  Image {index + 1}
                                </Typography>
                              }
                              subheader={
                                <Chip
                                  size="small"
                                  icon={hasContent ? <ImageIcon /> : <CloudUploadIcon />}
                                  label={hasContent ? 'Has Image' : 'Empty'}
                                  color={hasContent ? 'success' : 'default'}
                                  variant="outlined"
                                />
                              }
                              action={
                                <Tooltip title="Remove Image">
                                  <IconButton
                                    onClick={() => removeImage(index)}
                                    disabled={formData.images.length <= 1}
                                    size="small"
                                    sx={{ 
                                      color: 'error.main',
                                      '&:disabled': { color: 'action.disabled' }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              }
                            />
                            <CardContent sx={{ p: 3 }}>
                              {/* Image Preview */}
                             
                                <Box sx={{ p: 1,textAlign: 'center' }}>
                                  <ImageUpload
                                    label=""
                                    value={image}
                                      onChange={(e) => updateImage(index, e)}
                                  />
                                </Box>
                              
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    })}
                  </Grid>

                  {/* Add More Images */}
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addImage}
                      sx={{ borderRadius: 2 }}
                    >
                      Add Another Image
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Ready to save?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {validImages.length > 0 
                    ? `${validImages.length} image${validImages.length !== 1 ? 's' : ''} will be saved`
                    : 'Add at least one image before saving'
                  }
                </Typography>
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading || !formData.title.trim() || !formData.description.trim() || validImages.length === 0}
                startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                sx={{ 
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  minWidth: 180,
                  bgcolor: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'secondary.dark'
                  }
                }}
              >
                {isLoading ? 'Saving...' : initialData ? 'Update Section' : 'Create Section'}
              </Button>
            </Box>
          </Paper>
        </Stack>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="secondary"
        aria-label="add image"
        onClick={addImage}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  )
}