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
  alpha,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  LinearProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Info as InfoIcon,
  Title as TitleIcon,
  Article as ArticleIcon,
  FormatQuote as FormatQuoteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  TextFields as TextFieldsIcon
} from '@mui/icons-material'
import { toast } from 'sonner'
import { AboutUsSection } from '@prisma/client'



interface AboutUsSectionFormProps {
  initialData?: AboutUsSection | null
}

// Enhanced DynamicTextArray component
function DynamicTextArray({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  maxItems,
  icon: Icon,
  color = '#1976d2',
  helperText
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  maxItems: number;
  icon?: React.ElementType;
  color?: string;
  helperText?: string;
}) {
  const addItem = () => {
    if (value.length < maxItems) {
      onChange([...value, '']);
    }
  };

  const removeItem = (index: number) => {
    if (value.length > 1) {
      onChange(value.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, newValue: string) => {
    onChange(value.map((item, i) => i === index ? newValue : item));
  };

  const filledItems = value.filter(item => item.trim()).length;
  const progressPercentage = (filledItems / maxItems) * 100;

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', border: `2px solid ${alpha(color, 0.2)}` }}>
      <CardHeader
        sx={{ 
          bgcolor: alpha(color, 0.05),
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
        avatar={
          <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color }}>
            {Icon ? <Icon /> : <TextFieldsIcon />}
          </Avatar>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {label}
            </Typography>
            <Chip
              label={`${filledItems}/${maxItems}`}
              size="small"
              sx={{ 
                bgcolor: alpha(color, 0.1),
                color: color
              }}
            />
          </Box>
        }
        subheader={helperText}
        action={
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addItem}
            disabled={value.length >= maxItems}
            sx={{ 
              borderColor: color,
              color: color,
              '&:hover': {
                borderColor: color,
                bgcolor: alpha(color, 0.1)
              }
            }}
          >
            Add Line
          </Button>
        }
      />
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Progress Bar */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Completion Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progressPercentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 4
                }
              }}
            />
          </Box>

          {/* Text Fields */}
          {value.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: color,
                  mt: 2.5,
                  flexShrink: 0
                }}
              />
              <TextField
                fullWidth
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`${placeholder} ${index + 1}`}
                multiline={label.toLowerCase().includes('content')}
                rows={label.toLowerCase().includes('content') ? 2 : 1}
                error={index === 0 && !item.trim()}
                helperText={index === 0 && !item.trim() ? 'First line is required' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: color
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: color
                    }
                  }
                }}
              />
              <Tooltip title="Remove Line">
                <IconButton
                  onClick={() => removeItem(index)}
                  disabled={value.length <= 1}
                  size="small"
                  sx={{ 
                    color: 'error.main',
                    mt: 1,
                    '&:disabled': { color: 'action.disabled' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))}

          {/* Add More Button (if not at max) */}
          {value.length < maxItems && (
            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={addItem}
              sx={{ 
                alignSelf: 'flex-start',
                color: color,
                '&:hover': {
                  bgcolor: alpha(color, 0.1)
                }
              }}
            >
              Add {label.toLowerCase().includes('title') ? 'Title' : 'Content'} Line
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AboutUsSectionForm({ initialData }: AboutUsSectionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    titleLines: initialData?.titleLines || [''],
    contentLines: initialData?.contentLines || [''],
    closeLine: initialData?.closeLine || '',
    isActive: initialData?.isActive ?? true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/about-us-section', {
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
        throw new Error('Failed to save about us section')
      }

      toast.success('About Us section saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving about us section:', error)
      toast.error('Failed to save about us section')
    } finally {
      setIsLoading(false)
    }
  }

  const filledTitleLines = formData.titleLines.filter(line => line.trim()).length;
  const filledContentLines = formData.contentLines.filter(line => line.trim()).length;
  const hasCloseLine = formData.closeLine?.trim();
  
  const totalCompletion = Math.round(
    ((filledTitleLines > 0 ? 25 : 0) +
     (filledContentLines > 0 ? 25 : 0) +
     (hasCloseLine ? 25 : 0) +
     (formData.isActive ? 25 : 0)) / 1
  );

  const isFormValid = filledTitleLines > 0 && filledContentLines > 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <InfoIcon sx={{ color: 'white' }} />
          </Avatar>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
            {initialData ? 'Edit' : 'Create'} About Us Section
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Configure your organization&apos;s about us content with compelling titles and descriptions
        </Typography>
      </Paper>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Overall Progress */}
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Section Completion
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {totalCompletion}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={totalCompletion}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: alpha('#2e7d32', 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#2e7d32',
                    borderRadius: 6
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                <Chip
                  size="small"
                  label="Title Lines"
                  color={filledTitleLines > 0 ? 'success' : 'default'}
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label="Content Lines"
                  color={filledContentLines > 0 ? 'success' : 'default'}
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label="Closing Line"
                  color={hasCloseLine ? 'success' : 'default'}
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label="Status"
                  color={formData.isActive ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Title Lines */}
          <DynamicTextArray
            label="Title Lines"
            value={formData.titleLines}
            onChange={(titleLines) => setFormData(prev => ({ ...prev, titleLines }))}
            placeholder="Enter title line"
            maxItems={3}
            icon={TitleIcon}
            color="#1976d2"
            helperText="Create compelling title lines that grab attention (max 3 lines)"
          />

          {/* Content Lines */}
          <DynamicTextArray
            label="Content Lines"
            value={formData.contentLines}
            onChange={(contentLines) => setFormData(prev => ({ ...prev, contentLines }))}
            placeholder="Enter content line"
            maxItems={5}
            icon={ArticleIcon}
            color="#2e7d32"
            helperText="Describe your organization with detailed content lines (max 5 lines)"
          />

          {/* Closing Line */}
          <Card sx={{ borderRadius: 3, overflow: 'hidden', border: `2px solid ${alpha('#ed6c02', 0.2)}` }}>
            <CardHeader
              sx={{ 
                bgcolor: alpha('#ed6c02', 0.05),
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
              avatar={
                <Avatar sx={{ bgcolor: alpha('#ed6c02', 0.1), color: '#ed6c02' }}>
                  <FormatQuoteIcon />
                </Avatar>
              }
              title="Closing Line"
              subheader="A memorable tagline or motto to conclude your about section"
            />
            <CardContent sx={{ p: 4 }}>
              <TextField
                fullWidth
                value={formData.closeLine}
                onChange={(e) => setFormData(prev => ({ ...prev, closeLine: e.target.value }))}
                placeholder="GODARD SLOW-CARB"
                helperText={`${formData.closeLine?.length || 0} characters`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#ed6c02'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ed6c02'
                    }
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Section Settings */}
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardHeader
              sx={{ 
                bgcolor: alpha('#9c27b0', 0.05),
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
              avatar={
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {formData.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </Avatar>
              }
              title="Section Settings"
              subheader="Control the visibility and status of this section"
            />
            <CardContent sx={{ p: 4 }}>
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 4 }}>
                {formData.isActive 
                  ? 'This section will be visible on your website'
                  : 'This section will be hidden from your website'
                }
              </Typography>
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
                  {isFormValid 
                    ? `Section is ${totalCompletion}% complete and ready to save`
                    : 'Complete at least one title line and one content line to save'
                  }
                </Typography>
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading || !isFormValid}
                startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                sx={{ 
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  minWidth: 180,
                  bgcolor: '#2e7d32',
                  '&:hover': {
                    bgcolor: '#1b5e20'
                  }
                }}
              >
                {isLoading ? 'Saving...' : initialData ? 'Update Section' : 'Create Section'}
              </Button>
            </Box>
          </Paper>

          {/* Preview Section */}
          {(filledTitleLines > 0 || filledContentLines > 0) && (
            <Card sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: alpha('#f5f5f5', 0.5) }}>
              <CardHeader
                title="Preview"
                subheader="How your section will appear"
                sx={{ bgcolor: alpha('#757575', 0.05) }}
              />
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2}>
                  {formData.titleLines.filter(line => line.trim()).map((line, index) => (
                    <Typography 
                      key={index} 
                      variant={index === 0 ? "h4" : index === 1 ? "h5" : "h6"} 
                      sx={{ 
                        fontWeight: 600,
                        color: index === 0 ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {line}
                    </Typography>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  {formData.contentLines.filter(line => line.trim()).map((line, index) => (
                    <Typography key={index} variant="body1" color="text.secondary">
                      {line}
                    </Typography>
                  ))}
                  {formData.closeLine?.trim() && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          textAlign: 'center',
                          color: '#ed6c02',
                          letterSpacing: 1
                        }}
                      >
                        {formData.closeLine}
                      </Typography>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
    </Box>
  )
}