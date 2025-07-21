"use client"
import { Box, Button, Grid, Switch, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

type PageData = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDesc: string;
  published: boolean;
};

type PageEditorProps = {
  initialData?: PageData;
  isNew?: boolean;
};

export default function PageEditor({ initialData, isNew = false }: PageEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PageData>(
    initialData || {
      title: '',
      slug: '',
      content: '',
      metaTitle: '',
      metaDesc: '',
      published: false,
    }
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const url = isNew ? '/api/pages' : '/api/pages';
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
        router.push('/admin/pages');
        router.refresh();
      } else {
        // Handle error
        console.error('Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            {isNew ? 'Create New Page' : 'Edit Page'}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}> 
          <TextField
            required
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            fullWidth
            label="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            multiline
            rows={10}
            label="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Meta Title"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Meta Description"
            value={formData.metaDesc}
            onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box display="flex" alignItems="center">
            <Switch
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
            <Typography>Published</Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" color="primary">
            {isNew ? 'Create Page' : 'Save Changes'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/pages')}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
