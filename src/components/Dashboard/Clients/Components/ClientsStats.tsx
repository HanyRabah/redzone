'use client'

import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  alpha,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  People as PeopleIcon,
} from '@mui/icons-material'
import { Client } from '@prisma/client'

export default function ClientsStats({ clients }: { clients: Client[] }) {
    const activeClients = clients.filter(client => client.isActive)
    const disabledClients = clients.filter(client => !client.isActive)
    
    return <Grid container spacing={3} sx={{ my: 4 }}>
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
          title: 'Disabled Clients',
          value: disabledClients.length,
          icon: VisibilityOffIcon,
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
                  <IconComponent sx={{ fontSize: 24 }}/>
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
}
