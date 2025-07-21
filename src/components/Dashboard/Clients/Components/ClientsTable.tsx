'use client'

import { useState } from 'react'
import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  alpha,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Business as BusinessIcon,
  Language as LanguageIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import Image from 'next/image'
import { Client } from '@prisma/client'


export default function ClientTable<T extends Client>({ 
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
      <Grid container spacing={2}>
        {data.map((client) => (
          <Grid key={client.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                border: client.isActive ? `2px solid ${alpha('#2e7d32', 0.3)}` : '1px solid',
                borderColor: client.isActive ? alpha('#2e7d32', 0.3) : 'divider',
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