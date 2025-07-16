'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Drawer,
  Typography,
  Grid,
  Avatar,
  Paper,
  alpha,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Language as LanguageIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import Image from 'next/image'
import ClientForm from '../forms/ClientForm'
import { Client } from '@prisma/client'

interface ClientsManagerProps {
  clients: Client[]
}

function ClientTable<T extends Client>({ 
  data, 
  editItem, 
  deleteItem 
}: {
  data: T[];
  editItem: (item: T) => void;
  deleteItem: (id: string) => void;
}) {
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; client: T | null }>({
    open: false,
    client: null
  });


  const handleDeleteClick = (client: T) => {
    setDeleteDialog({ open: true, client });
  };

  const confirmDelete = () => {
    if (deleteDialog.client) {
      deleteItem(deleteDialog.client.id);
      setDeleteDialog({ open: false, client: null });
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {data.map((client) => (
          <Grid key={client.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                border: client.isActive ? `2px solid ${alpha('#2e7d32', 0.3)}` : '1px solid',
                borderColor: client.isActive ? alpha('#2e7d32', 0.3) : 'divider',
                // '&:hover': {
                //   transform: 'translateY(-4px)',
                //   boxShadow: 6
                // }
              }}
            >
              <CardHeader
                sx={{ pb: 1 }}
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {client.name}
                  </Typography>
                }
                action={
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit Client">
                      <IconButton size="small" onClick={() => editItem(client)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Client">
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(client)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
              
              <CardContent sx={{ pt: 0 }}>
                <Box 
                  sx={{ 
                    bgcolor: alpha('#f5f5f5', 0.8),
                    borderRadius: 2,
                    p: 3,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 120,
                    border: '2px dashed',
                    borderColor: 'divider',
                    width: '100%',
                    height: '100px',
                    position: 'relative'
                  }}
                >
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      style={{
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                      <BusinessIcon sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="body2">No logo</Typography>
                    </Box>
                  )}
                </Box>

                {client.website && (
                  <Tooltip title="Visit Website">
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<LanguageIcon />}
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        mb: 2,
                        textTransform: 'none',
                        maxWidth: '100%',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {client.website.replace('https://', '').replace('http://', '')}
                      </Typography>
                    </Button>
                  </Tooltip>
                )}

                {/* Status and Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip
                    icon={client.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    label={client.isActive ? 'Active' : 'Inactive'}
                    color={client.isActive ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Order: {client.sortOrder}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, client: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog.client?.name}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, client: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function ClientsManager({ clients }: ClientsManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  const openEditDialog = (client: Client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingClient(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (clientId: string) => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'DELETE',
      })

      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ path: '/' }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete client')
      }

      toast.success('Client deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting client:', error)
      toast.error('Failed to delete client')
    }
  }

  // const handleToggleActive = async (clientId: string, isActive: boolean) => {
  //   try {
  //     const response = await fetch(`/api/admin/clients/${clientId}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ isActive: !isActive }),
  //     })

  //     if (!response.ok) {
  //       throw new Error('Failed to update client')
  //     }

  //     toast.success(isActive ? 'Client hidden' : 'Client activated')
  //     router.refresh()
  //   } catch (error) {
  //     console.error('Error updating client:', error)
  //     toast.error('Failed to update client')
  //   }
  // }

  const activeClients = clients.filter(client => client.isActive)
  const clientsWithWebsite = clients.filter(client => client.website)
  const displayedClients = showOnlyActive ? activeClients : clients

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <PeopleIcon sx={{ color: 'white' }} />
          </Avatar>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
            Clients Manager
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
          Showcase your trusted clients and partners on the home page
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
          }}
        >
          Add Client
        </Button>
      </Paper>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: 'Total Clients',
            value: clients.length,
            icon: PeopleIcon,
            color: '#2e7d32'
          },
          {
            title: 'Active Clients',
            value: activeClients.length,
            icon: VisibilityIcon,
            color: '#1976d2'
          },
          {
            title: 'With Website',
            value: clientsWithWebsite.length,
            icon: PublicIcon,
            color: '#ed6c02'
          }
        ].map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Grid key={index} size={{xs: 12, sm: 4}}>
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
            Clients Display
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyActive}
                onChange={(e) => setShowOnlyActive(e.target.checked)}
                color="success"
              />
            }
            label="Show Only Active"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {showOnlyActive 
            ? `Showing ${activeClients.length} active clients`
            : `Showing all ${clients.length} clients`
          }
        </Typography>
      </Paper>

      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" onClick={openCreateDialog}>
          Add Client
          <AddIcon />
        </Button>
      </Box>
  
      {/* Clients Display */}
      {displayedClients.length === 0 ? (
        <Paper sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {showOnlyActive ? 'No active clients found' : 'No clients added yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {showOnlyActive 
                ? 'Start by activating some clients to showcase on your home page'
                : 'Add your first client to start building your portfolio'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
              sx={{ borderRadius: 2 }}
            >
              Add Your First Client
            </Button>
          </Box>
        </Paper>
      ) : (
        <ClientTable
          data={displayedClients}
          editItem={openEditDialog}
          deleteItem={handleDelete}
        />
      )}

      {/* Information Panel */}
      <Alert 
        severity="info" 
        sx={{ 
          mt: 4,
          borderRadius: 3,
          bgcolor: alpha('#2e7d32', 0.05),
          border: `1px solid ${alpha('#2e7d32', 0.2)}`
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>Client Management Tips</AlertTitle>
        <Typography variant="body2" sx={{ mb: 2 }}>
          • Active clients will be displayed on your home page in the clients showcase section<br/>
          • Upload client logos for better visual impact<br/>
          • Sort order determines the display sequence on your website<br/>
          • Website links help visitors discover your clients&apos; work
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip size="small" onClick={() => openCreateDialog()} icon={<EditIcon />} label="Click edit to modify client details" variant="outlined" />
          <Chip size="small" onClick={() => setShowOnlyActive(!showOnlyActive)} icon={<VisibilityIcon />} label="Active clients appear on homepage" variant="outlined" />
        </Box>
      </Alert>

      {/* Add Client Drawer */}
      <Drawer
        anchor="right"
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        sx={{ width: { xs: '100%', sm: '500px', md: '600px' } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {editingClient ? "Edit Client" : "Add New Client"}
            </Typography>
            <IconButton onClick={() => setIsDialogOpen(false)} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ClientForm 
            client={editingClient} 
            onClose={() => setIsDialogOpen(false)} 
          />
        </Box>
      </Drawer>

      
    </Box>
  )
}