import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';

export default async function PagesAdmin() {
  const pages = await prisma.page.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h4" gutterBottom>
          Pages
        </Typography>
        <Button
          component={Link}
          href="/admin/pages/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Page
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>{page.title}</TableCell>
                <TableCell>{page.slug}</TableCell>
                <TableCell>{page.published ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {new Date(page.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    href={`/admin/pages/${page.id}`}
                    size="small"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
