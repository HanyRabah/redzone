'use client';

import { Box, Paper, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

interface DashboardUIProps {
  pageCount: number;
  postCount: number;
  userCount: number;
}

const cardStyle: SxProps<Theme> = {
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default function DashboardUI({ pageCount, postCount, userCount }: DashboardUIProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Paper sx={cardStyle}>
          <Typography variant="h6">Total Pages</Typography>
          <Typography variant="h3">{pageCount}</Typography>
        </Paper>
        <Paper sx={cardStyle}>
          <Typography variant="h6">Total Blog Posts</Typography>
          <Typography variant="h3">{postCount}</Typography>
        </Paper>
        <Paper sx={cardStyle}>
          <Typography variant="h6">Total Users</Typography>
          <Typography variant="h3">{userCount}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
