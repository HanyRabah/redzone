'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Avatar,
  IconButton,
  Tooltip,
  InputAdornment,
  Divider,
  Stack,
  Alert,
  styled,
} from '@mui/material'
import {
  Search,
  ExpandMore,
  Email,
  EmailOutlined,
  Reply,
  Delete,
  Download,
  Message,
  OpenInNew
} from '@mui/icons-material'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { toast } from 'sonner'
import theme from '@/style/theme'

interface ContactSubmission {
  id: string
  firstName: string
  lastName: string
  email: string
  message: string
  isRead: boolean
  isReplied: boolean
  createdAt: Date
  updatedAt: Date
}

interface ContactSubmissionsManagerProps {
  submissions: ContactSubmission[]
}


const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


export default function ContactSubmissionsManager({ submissions }: ContactSubmissionsManagerProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyingTo, setReplyingTo] = useState<ContactSubmission | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [expanded, setExpanded] = useState<string | false>(false)

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      const matchesSearch = 
        submission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.message.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'unread' && !submission.isRead) ||
        (statusFilter === 'read' && submission.isRead) ||
        (statusFilter === 'replied' && submission.isReplied) ||
        (statusFilter === 'pending' && !submission.isReplied)

      return matchesSearch && matchesStatus
    })
  }, [submissions, searchTerm, statusFilter])

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleMarkAsRead = async (submissionId: string, isRead: boolean) => {
    try {
      const response = await fetch(`/api/admin/contact-submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead }),
      })

      if (!response.ok) {
        throw new Error('Failed to update submission')
      }

      toast.success(isRead ? 'Marked as read' : 'Marked as unread')
      router.refresh()
    } catch (error) {
      console.error('Error updating submission:', error)
      toast.error('Failed to update submission')
    }
  }

  const handleDelete = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return

    try {
      const response = await fetch(`/api/admin/contact-submissions/${submissionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete submission')
      }

      toast.success('Submission deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting submission:', error)
      toast.error('Failed to delete submission')
    }
  }

  const handleReply = (submission: ContactSubmission) => {
    setReplyingTo(submission)
    setReplyMessage(`Hi ${submission.firstName},\n\nThank you for contacting us. We received your message and will get back to you soon.\n\nBest regards,\nThe Team`)
    setReplyDialogOpen(true)
  }

  const handleSendReply = async () => {
    if (!replyingTo || !replyMessage.trim()) return

    try {
      const response = await fetch('/api/admin/contact-submissions/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: replyingTo.id,
          replyMessage
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send reply')
      }

      toast.success('Reply sent successfully')
      setReplyDialogOpen(false)
      setReplyingTo(null)
      setReplyMessage('')
      router.refresh()
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Failed to send reply')
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Message', 'Date', 'Status'].join(','),
      ...filteredSubmissions.map(sub => [
        `"${sub.firstName} ${sub.lastName}"`,
        sub.email,
        `"${sub.message.replace(/"/g, '""')}"`,
        sub.createdAt.toLocaleDateString(),
        sub.isReplied ? 'Replied' : sub.isRead ? 'Read' : 'Unread'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const toggleSubmissionSelection = (submissionId: string) => {
    setSelectedSubmissions(prev => 
      prev.includes(submissionId) 
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    )
  }

  const getStatusColor = (submission: ContactSubmission) => {
    if (submission.isReplied) return 'success'
    if (submission.isRead) return 'default'
    return 'error'
  }

  const getStatusLabel = (submission: ContactSubmission) => {
    if (submission.isReplied) return 'Replied'
    if (submission.isRead) return 'Read'
    return 'New'
  }


  return (
    <Box sx={{ p: 0, mx: 'auto' }}>
      {/* Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="replied">Replied</MenuItem>
              <MenuItem value="pending">Pending Reply</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Download />}
            onClick={exportToCSV}
            sx={{ py: 1.5 }}
          >
            Export CSV
          </Button>
        </Stack>
      </Paper>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Message sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm || statusFilter !== 'all'
              ? 'No submissions match your filters'
              : 'No contact submissions found'
            }
          </Typography>
        </Paper>
      ) : (
        <>
          {filteredSubmissions.map((submission) => (
            <Accordion
              key={submission.id}
              expanded={expanded === submission.id}
              onChange={handleAccordionChange(submission.id)}
              sx={{ 
                '&:before': { display: 'none' },
                borderLeft: !submission.isRead ? '4px solid #1976d2' : `1px solid ${theme.palette.divider}`
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ 
                  '& .MuiAccordionSummary-content': { 
                    alignItems: 'center',
                    gap: 2
                  }
                }}
              >
                <Checkbox
                  checked={selectedSubmissions.includes(submission.id)}
                  onChange={(e) => {
                    e.stopPropagation()
                    toggleSubmissionSelection(submission.id)
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <Avatar sx={{ bgcolor: 'primary.main', fontSize: '.9rem' }}>
                  {submission.firstName.charAt(0)}{submission.lastName.charAt(0)}
                </Avatar>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" component="div">
                    {submission.firstName} {submission.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {submission.email} • {submission.createdAt.toLocaleDateString()}
                  </Typography>
                </Box>
                
                <Chip
                  label={getStatusLabel(submission)}
                  color={getStatusColor(submission)}
                  size="small"
                />
              </AccordionSummary>
              
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Message:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {submission.message}
                    </Typography>
                  </Paper>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack direction="row" spacing={1}>
                  <Tooltip title={submission.isRead ? 'Mark as unread' : 'Mark as read'}>
                    <IconButton
                      onClick={() => handleMarkAsRead(submission.id, !submission.isRead)}
                      color="primary"
                    >
                      {submission.isRead ? <Email /> : <EmailOutlined />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Reply via email">
                    <IconButton
                      onClick={() => handleReply(submission)}
                      color="primary"
                    >
                      <Reply />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Send email directly">
                    <IconButton
                      component="a"
                      href={`mailto:${submission.email}?subject=Re: Contact Form Submission`}
                      color="primary"
                    >
                      <OpenInNew />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete submission">
                    <IconButton
                      onClick={() => handleDelete(submission.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
          
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            Showing {filteredSubmissions.length} of {submissions.length} submissions
          </Typography>
        </>
      )}

      {/* Reply Dialog */}
      <Dialog 
        open={replyDialogOpen} 
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Reply to {replyingTo?.firstName} {replyingTo?.lastName}
        </DialogTitle>
        <DialogContent>
          {replyingTo && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Original Message:</strong><br />
                  {replyingTo.message}
                </Typography>
              </Alert>
              
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Your Reply"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendReply}
            variant="contained"
            disabled={!replyMessage.trim()}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}