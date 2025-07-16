'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
  IconButton,
  Grid,
  Chip,
  Stack,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  alpha,
  InputAdornment
} from '@mui/material'
import {
  Add as AddIcon,
  // Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  DragIndicator as DragIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material'
import { toast } from 'sonner'

interface ContactItem {
  title: string
  items: string[]
}

interface ContactDetailsData {
  id?: string
  title: string
  description: string
  contacts: ContactItem[]
  isActive: boolean
}

interface ContactDetailsFormProps {
  initialData?: ContactDetailsData | null
}

const contactTypeConfig = {
  email: { 
    icon: EmailIcon, 
    placeholder: 'hello@example.com',
    label: 'Email',
    color: '#1976d2'
  },
  phone: { 
    icon: PhoneIcon, 
    placeholder: '+1 (555) 123-4567',
    label: 'Phone',
    color: '#2e7d32'
  },
  address: { 
    icon: LocationIcon, 
    placeholder: '123 Main Street, City, State 12345',
    label: 'Address',
    color: '#ed6c02'
  },
  other: { 
    icon: InfoIcon, 
    placeholder: 'Contact information',
    label: 'Other',
    color: '#9c27b0'
  }
}

const createEmptyContact = (): ContactItem => ({
  title: '',
  items: ['']
})

export default function ContactDetailsForm({ initialData }: ContactDetailsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<ContactDetailsData>({
    title: initialData?.title || 'Contact Us',
    description: initialData?.description || '',
    contacts: (initialData?.contacts as ContactItem[]) || [
      { 
        title: 'Email Us', 
        items: ['hello@redzone.com', 'info@redzone.com']
      },
      { 
        title: 'Call Us', 
        items: ['+1 (555) 123-4567', '+1 (555) 987-6543']
      },
      { 
        title: 'Visit Us', 
        items: ['123 Creative Street', 'Design City, DC 12345']
      }
    ],
    isActive: initialData?.isActive ?? true
  })

  const addContactSection = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, createEmptyContact()]
    }))
  }

  // const removeContactSection = (contactIndex: number) => {
  //   if (formData.contacts.length <= 1) {
  //     toast.error('At least one contact section is required')
  //     return
  //   }
    
  //   setFormData(prev => ({
  //     ...prev,
  //     contacts: prev.contacts.filter((_, index) => index !== contactIndex)
  //   }))
  // }

  const updateContactSection = (contactIndex: number, updates: Partial<ContactItem>) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, index) => 
        index === contactIndex 
          ? { ...contact, ...updates }
          : contact
      )
    }))
  }

  const addContactItem = (contactIndex: number) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, index) => 
        index === contactIndex 
          ? { ...contact, items: [...contact.items, ''] }
          : contact
      )
    }))
  }

  // const removeContactItem = (contactIndex: number, itemIndex: number) => {
  //   const contact = formData.contacts[contactIndex]
  //   if (!contact || contact.items.length <= 1) {
  //     toast.error('At least one contact item is required per section')
  //     return
  //   }

  //   setFormData(prev => ({
  //     ...prev,
  //     contacts: prev.contacts.map((contact, index) => 
  //       index === contactIndex 
  //         ? { ...contact, items: contact.items.filter((_, j) => j !== itemIndex) }
  //         : contact
  //     )
  //   }))
  // }

  const updateContactItem = (contactIndex: number, itemIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, index) => 
        index === contactIndex 
          ? { 
              ...contact, 
              items: contact.items.map((item, j) => j === itemIndex ? value : item)
            }
          : contact
      )
    }))
  }

  const moveContactSection = (contactIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? contactIndex - 1 : contactIndex + 1
    if (newIndex < 0 || newIndex >= formData.contacts.length) return

    const newContacts = [...formData.contacts]
    const [movedContact] = newContacts.splice(contactIndex, 1)
    newContacts.splice(newIndex, 0, movedContact)

    setFormData(prev => ({ ...prev, contacts: newContacts }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required')
      setIsLoading(false)
      return
    }

    if (formData.contacts.length === 0) {
      toast.error('At least one contact section is required')
      setIsLoading(false)
      return
    }

    // Check if all contacts have required fields
    const invalidContacts = formData.contacts.filter(contact => 
      !contact.title.trim() || !contact.items.some(item => item.trim())
    )
    
    if (invalidContacts.length > 0) {
      toast.error('All contact sections must have a title and at least one contact item')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/contact-details', {
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
        body: JSON.stringify({ path: '/contact' }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to save contact details')
      }

      toast.success('Contact details saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving contact details:', error)
      toast.error('Failed to save contact details')
    } finally {
      setIsLoading(false)
    }
  }

  const getContactTypeByTitle = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('email') || lowerTitle.includes('mail')) return 'email'
    if (lowerTitle.includes('phone') || lowerTitle.includes('call') || lowerTitle.includes('tel')) return 'phone'
    if (lowerTitle.includes('address') || lowerTitle.includes('visit') || lowerTitle.includes('location')) return 'address'
    return 'other'
  }

  const getContactPlaceholder = (title: string) => {
    const type = getContactTypeByTitle(title)
    return contactTypeConfig[type].placeholder
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Contact Details Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure how visitors can contact you on your website
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Basic Information */}
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Section Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Contact Us"
                  required
                  error={!formData.title.trim()}
                  helperText={!formData.title.trim() ? 'Title is required' : ''}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Get in touch with us through any of the following methods..."
                  multiline
                  rows={3}
                  required
                  error={!formData.description.trim()}
                  helperText={!formData.description.trim() ? 'Description is required' : ''}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      isActive: e.target.checked 
                    }))}
                    color="primary"
                  />
                }
                label="Enable Contact Details Section"
              />
            </Box>
          </Paper>

          {/* Contact Sections */}
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Contact Sections
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={`${formData.contacts.length} Section${formData.contacts.length !== 1 ? 's' : ''}`} 
                    color="primary" 
                    variant="outlined" 
                    size="small" 
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addContactSection}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Add Section
              </Button>
            </Box>

            <Stack spacing={3}>
              {formData.contacts.map((contact, index) => {
                const contactType = getContactTypeByTitle(contact.title)
                const config = contactTypeConfig[contactType]
                const IconComponent = config.icon
                
                return (
                  <Card 
                    key={index}
                    sx={{
                      border: '2px solid',
                      borderColor: alpha(config.color, 0.3),
                      borderRadius: 3,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: 4,
                        borderColor: alpha(config.color, 0.5)
                      }
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small" sx={{ cursor: 'grab' }}>
                            <DragIcon />
                          </IconButton>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: alpha(config.color, 0.1),
                              color: config.color,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <IconComponent />
                          </Box>
                        </Box>
                      }
                      title={
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {contact.title || `Contact Section ${index + 1}`}
                        </Typography>
                      }
                      subheader={
                        <Typography variant="body2" color="text.secondary">
                          {contact.items.filter(item => item.trim()).length} item{contact.items.filter(item => item.trim()).length !== 1 ? 's' : ''}
                        </Typography>
                      }
                      action={
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Move Up">
                            <IconButton
                              size="small"
                              onClick={() => moveContactSection(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUpIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Move Down">
                            <IconButton
                              size="small"
                              onClick={() => moveContactSection(index, 'down')}
                              disabled={index === formData.contacts.length - 1}
                            >
                              <ArrowDownIcon />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title="Delete Section">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeContactSection(index)}
                              disabled={formData.contacts.length <= 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip> */}
                        </Box>
                      }
                    />
                    
                    <CardContent sx={{ pt: 0 }}>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Section Title
                          </Typography>
                          <TextField
                            fullWidth
                            value={contact.title}
                            onChange={(e) => updateContactSection(index, { title: e.target.value })}
                            placeholder="Contact Section Title"
                            required
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6}}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Contact Items
                          </Typography>
                          
                          <Stack spacing={2}>
                            {contact.items.map((item, itemIndex) => (
                              <Box key={itemIndex} sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={item}
                                  onChange={(e) => updateContactItem(index, itemIndex, e.target.value)}
                                  placeholder={getContactPlaceholder(contact.title)}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <IconComponent sx={{ color: config.color }} />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                                {/* <Tooltip title="Remove Item">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => removeContactItem(index, itemIndex)}
                                    disabled={contact.items.length <= 1}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip> */}
                              </Box>
                            ))}
                            
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() => addContactItem(index)}
                              sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
                            >
                              Add Item
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          </Paper>

          {/* Submit Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={isLoading}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={<SaveIcon />}
              sx={{ borderRadius: 2, px: 4, minWidth: 150 }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}