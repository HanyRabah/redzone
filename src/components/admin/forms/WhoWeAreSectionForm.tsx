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
  Chip,
  Divider,
  alpha,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  List as ListIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'
import { toast } from 'sonner'
import { WhoWeAreSection } from '@prisma/client'

interface WhoWeAreSectionFormProps {
  initialData: WhoWeAreSection | null
}

export default function WhoWeAreSectionForm({ initialData }: WhoWeAreSectionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<number[]>([0])

  // Convert initial data to the correct type if it exists
  const getInitialData = (): WhoWeAreSection => {
    if (!initialData) {
      return {
        id: '',
        title: '',
        description: '',
        extras: [{ title: '', list: [''] }],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    
    return {
      ...initialData,
      extras: Array.isArray(initialData.extras) 
        ? initialData.extras.map(extra => ({
            title: typeof extra === 'object' && extra !== null && 'title' in extra 
              ? String(extra.title) 
              : '',
            list: typeof extra === 'object' && extra !== null && 'list' in extra && Array.isArray(extra.list)
              ? extra.list.map(String)
              : ['']
          }))
        : [{ title: '', list: [''] }]
    }
  }

  const [formData, setFormData] = useState<WhoWeAreSection>(getInitialData())

  const addExtra = () => {
    const newIndex = formData.extras.length
    setFormData(prev => ({
      ...prev,
      extras: [...prev.extras, { title: '', list: [''] }]
    }))
    setExpandedSections(prev => [...prev, newIndex])
  }

  // const removeExtra = (index: number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     extras: prev.extras.filter((_, i) => i !== index)
  //   }))
  //   setExpandedSections(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i))
  // }

  const updateExtra = (index: number, field: 'title' | 'list', value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.map((extra, i) => 
        i === index ? { ...JSON.parse(JSON.stringify(extra)), [field]: value } : extra
      )
    }))
  }

  const addListItem = (extraIndex: number) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.map((extra, i) => 
        i === extraIndex 
          ? { ...JSON.parse(JSON.stringify(extra)), list: [...JSON.parse(JSON.stringify(extra)).list, ''] }
          : extra
      )
    }))
  }

  const removeListItem = (extraIndex: number, listIndex: number) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.map((extra, i) => 
        i === extraIndex 
          ? { ...JSON.parse(JSON.stringify(extra)), list: [...JSON.parse(JSON.stringify(extra)).list.filter((_, j) => j !== listIndex)] }
          : extra
      )
    }))
  }

  const updateListItem = (extraIndex: number, listIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.map((extra, i) => 
        i === extraIndex 
          ? { 
              ...JSON.parse(JSON.stringify(extra)), 
              list: [...JSON.parse(JSON.stringify(extra)).list.map((item, j) => j === listIndex ? value : item)]
            }
          : extra
      )
    }))
  }

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/who-we-are-section', {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: initialData?.id || 'main'
        }),
      })

      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ path: '/about' }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to save who we are section')
      }

      toast.success('Who We Are section saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving who we are section:', error)
      toast.error('Failed to save who we are section')
    } finally {
      setIsLoading(false)
    }
  }

  const getSectionColor = (index: number) => {
    const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1']
    return colors[index % colors.length]
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <InfoIcon sx={{ color: 'white' }} />
          </Avatar>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
            {initialData ? 'Edit' : 'Create'} Who We Are Section
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Configure your organization&apos;s introduction section with detailed information
        </Typography>
      </Paper>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Basic Information */}
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardHeader
              sx={{ 
                bgcolor: alpha('#1976d2', 0.05),
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <TitleIcon />
                </Avatar>
              }
              title="Basic Information"
              subheader="Main section details"
            />
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Section Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Who We Are"
                  required
                  error={!formData.title.trim()}
                  helperText={!formData.title.trim() ? 'Section title is required' : ''}
                  InputProps={{
                    startAdornment: <TitleIcon sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe who you are and what makes you unique..."
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
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      color="primary"
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

          {/* Extra Sections */}
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardHeader
              sx={{ 
                bgcolor: alpha('#2e7d32', 0.05),
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
              avatar={
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <ListIcon />
                </Avatar>
              }
              title="Additional Sections"
              subheader={`${formData.extras.length} section${formData.extras.length !== 1 ? 's' : ''} configured`}
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addExtra}
                  sx={{ borderRadius: 2 }}
                >
                  Add Section
                </Button>
              }
            />
            <CardContent sx={{ p: 0 }}>
              {formData.extras.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <ListIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No additional sections
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add sections to provide more detailed information
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addExtra}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Your First Section
                  </Button>
                </Box>
              ) : (
                <Stack>
                  {formData.extras.map((extra, extraIndex) => {
                    const sectionColor = getSectionColor(extraIndex)
                    const isExpanded = expandedSections.includes(extraIndex)
                    
                    return (
                      <Box key={extraIndex}>
                        <Accordion 
                          expanded={isExpanded}
                          onChange={() => toggleSection(extraIndex)}
                          sx={{ 
                            boxShadow: 'none',
                            '&:before': { display: 'none' }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              bgcolor: alpha(sectionColor, 0.05),
                              borderLeft: `4px solid ${sectionColor}`,
                              '&:hover': {
                                bgcolor: alpha(sectionColor, 0.1)
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: sectionColor
                                }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {JSON.parse(JSON.stringify(extra)).title || `Section ${extraIndex + 1}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {JSON.parse(JSON.stringify(extra)).list.filter(item => item.trim()).length} items
                                </Typography>
                              </Box>
                              <Chip
                                size="small"
                                label={`Section ${extraIndex + 1}`}
                                sx={{ 
                                  bgcolor: alpha(sectionColor, 0.1),
                                  color: sectionColor
                                }}
                              />
                              {/* <Tooltip title="Delete Section">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeExtra(extraIndex)
                                  }}
                                  size="small"
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip> */}
                            </Box>
                          </AccordionSummary>
                          
                          <AccordionDetails sx={{ p: 4 }}>
                            <Stack spacing={3}>
                              <TextField
                                fullWidth
                                label="Section Title"
                                value={JSON.parse(JSON.stringify(extra)).title}
                                onChange={(e) => updateExtra(extraIndex, 'title', e.target.value)}
                                placeholder="Our Services, Our Values, etc."
                                InputProps={{
                                  startAdornment: <TitleIcon sx={{ color: 'action.active', mr: 1 }} />
                                }}
                              />

                              <Box>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                  List Items
                                </Typography>
                                <Stack spacing={2}>
                                  {JSON.parse(JSON.stringify(extra)).list.map((item, listIndex) => (
                                    <Box key={listIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Box
                                        sx={{
                                          width: 6,
                                          height: 6,
                                          borderRadius: '50%',
                                          bgcolor: sectionColor,
                                          flexShrink: 0
                                        }}
                                      />
                                      <TextField
                                        fullWidth
                                        size="small"
                                        value={item}
                                        onChange={(e) => updateListItem(extraIndex, listIndex, e.target.value)}
                                        placeholder={`Item ${listIndex + 1}`}
                                      />
                                      <Tooltip title="Remove Item">
                                        <IconButton
                                          onClick={() => removeListItem(extraIndex, listIndex)}
                                          size="small"
                                          sx={{ 
                                            color: 'error.main',
                                            '&:hover': { bgcolor: alpha('#d32f2f', 0.1) }
                                          }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  ))}
                                  <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => addListItem(extraIndex)}
                                    sx={{ 
                                      alignSelf: 'flex-start',
                                      borderRadius: 2,
                                      borderColor: sectionColor,
                                      color: sectionColor,
                                      '&:hover': {
                                        borderColor: sectionColor,
                                        bgcolor: alpha(sectionColor, 0.1)
                                      }
                                    }}
                                  >
                                    Add Item
                                  </Button>
                                </Stack>
                              </Box>
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                        {extraIndex < formData.extras.length - 1 && <Divider />}
                      </Box>
                    )
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {initialData ? 'Update your' : 'Create a new'} Who We Are section
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Changes will be visible immediately after saving
                </Typography>
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
                startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                sx={{ 
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  minWidth: 180
                }}
              >
                {isLoading ? 'Saving...' : initialData ? 'Update Section' : 'Create Section'}
              </Button>
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Box>
  )
}