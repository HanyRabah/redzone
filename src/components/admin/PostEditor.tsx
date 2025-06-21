"use client"
import { Box, Button, Grid, Switch, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type PostData = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  published: boolean;
};

type PostEditorProps = {
  initialData?: PostData;
  isNew?: boolean;
};

export default function PostEditor({ initialData, isNew = false }: PostEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PostData>(
    initialData || {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      published: false,
    }
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const url = isNew ? '/api/posts' : '/api/posts';
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        // Handle error
        console.error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {isNew ? 'Create New Post' : 'Edit Post'}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Slug"
            value={formData.slug}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, slug: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            label="Excerpt"
            value={formData.excerpt}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, excerpt: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={10}
            label="Content"
            value={formData.content}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, content: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Featured Image URL"
            value={formData.featuredImage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, featuredImage: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Switch
              checked={formData.published}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, published: e.target.checked })}
            />
            <Typography>Published</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {isNew ? 'Create Post' : 'Save Changes'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/posts')}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
