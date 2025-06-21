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
import type { Blog } from '@prisma/client';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';

export default async function PostsAdmin() {
  const posts: Blog[] = await prisma.blog.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h4" gutterBottom>
          Blog Posts
        </Typography>
        <Button
          component={Link}
          href="/admin/posts/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Post
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
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.slug}</TableCell>
                <TableCell>{post.published ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    href={`/admin/posts/${post.id}`}
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
