"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Chip,
  Typography,
  Grid,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  Visibility as EyeIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import { BlogCategory, BlogPost, BlogTag, User } from "@prisma/client";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/RichTextEditor";

interface BlogPostType extends BlogPost {
  author: User | null;
  categories: BlogCategory[];
  tags: BlogTag[];
}

interface BlogPostFormProps {
  post: BlogPostType | null;
  categories: BlogCategory[];
  existingTags: BlogTag[];
  authors: User[];
  setIsDialogOpen: (open: boolean) => void;
}

function TabPanel(props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`blog-tabpanel-${index}`}
      aria-labelledby={`blog-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BlogPostForm({
  post,
  categories,
  existingTags,
  authors,
  setIsDialogOpen,
}: BlogPostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    image: post?.image || "",
    authorId: post?.authorId || "",
    selectedCategories: post?.categories || [],
    selectedTags: post?.tags || [],
    isPublished: post?.publishedAt ? true : false,
    isFeatured: post?.isFeatured ?? false,
    publishedAt: post?.publishedAt || null,
    seoTitle: post?.seoTitle || "",
    seoDescription: post?.seoDescription || "",
    seoKeywords: post?.seoKeywords || [],
  });

  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newSeoKeyword, setNewSeoKeyword] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters but keep spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug:
        !prev.slug || prev.slug === generateSlug(prev.title)
          ? generateSlug(title)
          : prev.slug,
      seoTitle: prev.seoTitle || title,
    }));
  };

  // Fix: Handle adding existing tags from the existingTags list
  const addExistingTag = (tag: BlogTag) => {
    if (
      !formData.selectedTags.some((selectedTag) => selectedTag.id === tag.id)
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedTags: [...prev.selectedTags, tag],
      }));
    }
  };

  // Fix: Handle adding new tags (create temporary tag objects)
  const addNewTag = (tagName: string) => {
    const trimmedTag = tagName.trim().toLowerCase();
    if (
      trimmedTag &&
      !formData.selectedTags.some((tag) => tag.name === trimmedTag)
    ) {
      const tempTag: BlogTag = {
        id: `temp-${Date.now()}`, // Temporary ID for new tags
        name: trimmedTag,
        slug: generateSlug(trimmedTag),
        createdAt: new Date(),
        updatedAt: new Date(),
        postCount: 0,
      };
      setFormData((prev) => ({
        ...prev,
        selectedTags: [...prev.selectedTags, tempTag],
      }));
    }
    setNewTag("");
  };

  const removeTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.filter((tag) => tag.id !== tagId),
    }));
  };

  // Fix: Handle adding existing categories from the categories list
  const addExistingCategory = (category: BlogCategory) => {
    if (
      !formData.selectedCategories.some(
        (selectedCat) => selectedCat.id === category.id
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedCategories: [...prev.selectedCategories, category],
      }));
    }
  };

  // Fix: Handle adding new categories (create temporary category objects)
  const addNewCategory = (categoryName: string) => {
    const trimmedCategory = categoryName.trim();
    if (
      trimmedCategory &&
      !formData.selectedCategories.some((cat) => cat.name === trimmedCategory)
    ) {
      const tempCategory: BlogCategory = {
        id: `temp-${Date.now()}`, // Temporary ID for new categories
        name: trimmedCategory,
        slug: generateSlug(trimmedCategory),
        createdAt: new Date(),
        updatedAt: new Date(),
        postCount: 0,
      };
      setFormData((prev) => ({
        ...prev,
        selectedCategories: [...prev.selectedCategories, tempCategory],
      }));
    }
  };

  const removeCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.filter(
        (cat) => cat.id !== categoryId
      ),
    }));
  };

  const handleNewCategoryAdd = () => {
    if (newCategory.trim()) {
      addNewCategory(newCategory.trim());
      setNewCategory("");
      setShowNewCategory(false);
    }
  };

  const addSeoKeyword = (keyword: string) => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    if (trimmedKeyword && !formData.seoKeywords.includes(trimmedKeyword)) {
      setFormData((prev) => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, trimmedKeyword],
      }));
    }
    setNewSeoKeyword("");
  };

  const removeSeoKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter(
        (keyword) => keyword !== keywordToRemove
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      setIsLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Content is required");
      setIsLoading(false);
      return;
    }

    if (!formData.authorId) {
      toast.error("Author is required");
      setIsLoading(false);
      return;
    }

    try {
      const url = post
        ? `/api/admin/blog/posts/${post.id}`
        : "/api/admin/blog/posts";

      const method = post ? "PUT" : "POST";

      const submitData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        authorId: formData.authorId,
        categoryIds: formData.selectedCategories
          .filter((cat) => !cat.id.startsWith("temp-"))
          .map((cat) => cat.id),
        newCategories: formData.selectedCategories
          .filter((cat) => cat.id.startsWith("temp-"))
          .map((cat) => ({ name: cat.name, slug: cat.slug })),
        tagIds: formData.selectedTags
          .filter((tag) => !tag.id.startsWith("temp-"))
          .map((tag) => tag.id),
        newTags: formData.selectedTags
          .filter((tag) => tag.id.startsWith("temp-"))
          .map((tag) => ({ name: tag.name, slug: tag.slug })),
        isPublished: saveAsDraft ? false : formData.isPublished,
        isFeatured: formData.isFeatured,
        publishedAt:
          formData.isPublished && !post?.publishedAt
            ? new Date()
            : formData.publishedAt,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ path: '/blog' }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save blog post");
      }

      toast.success(`Blog post ${post ? "updated" : "created"} successfully`);
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save blog post"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSave = async () => {
    setIsSaving(true);
    try {
      const url = post
        ? `/api/admin/blog/posts/${post.id}`
        : "/api/admin/blog/posts";

      const method = post ? "PUT" : "POST";

      const submitData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        authorId: formData.authorId,
        categoryIds: formData.selectedCategories
          .filter((cat) => !cat.id.startsWith("temp-"))
          .map((cat) => cat.id),
        newCategories: formData.selectedCategories
          .filter((cat) => cat.id.startsWith("temp-"))
          .map((cat) => ({ name: cat.name, slug: cat.slug })),
        tagIds: formData.selectedTags
          .filter((tag) => !tag.id.startsWith("temp-"))
          .map((tag) => tag.id),
        newTags: formData.selectedTags
          .filter((tag) => tag.id.startsWith("temp-"))
          .map((tag) => ({ name: tag.name, slug: tag.slug })),
        isPublished: false,
        isFeatured: formData.isFeatured,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to save blog post");
      }

      toast.success("Draft saved successfully");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  // const publishPost = async (postId: string) => {
  //   const response = await fetch(`/api/admin/blog/posts/${postId}/quick-action`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ action: 'publish' })
  //   })
  //   const result = await response.json()
  //   return result
  // }

  // // Toggle feature status
  // const toggleFeature = async (postId: string) => {
  //   const response = await fetch(`/api/admin/blog/posts/${postId}/quick-action`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ action: 'toggle-feature' })
  //   })
  //   const result = await response.json()
  //   return result
  // }

  // // Get current status
  // const getPostStatus = async (postId: string) => {
  //   const response = await fetch(`/api/admin/blog/posts/${postId}/quick-action`)
  //   const result = await response.json()
  //   return result
  // }

  const wordCount = formData.content
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  const tabIcons = [ArticleIcon, SettingsIcon, SearchIcon];
  const tabLabels = ["Content", "Settings", "SEO"];

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      {/* Header Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {post ? "Edit Blog Post" : "Create New Blog Post"}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={handleQuickSave}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
        </Stack>
      </Box>

      <form onSubmit={(e) => handleSubmit(e)}>
        {/* Tabs */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              bgcolor: alpha("#1976d2", 0.05),
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            {tabLabels.map((label, index) => {
              const IconComponent = tabIcons[index];
              return (
                <Tab
                  key={label}
                  label={label}
                  icon={<IconComponent />}
                  iconPosition="start"
                  sx={{
                    minHeight: 60,
                    fontWeight: 600,
                    "&.Mui-selected": {
                      color: "primary.main",
                    },
                  }}
                />
              );
            })}
          </Tabs>

          {/* Content Tab */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={4}>
              {/* Basic Information */}
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <ArticleIcon />
                    </Avatar>
                  }
                  title="Basic Information"
                  subheader="Essential details for your blog post"
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter blog post title"
                        required
                        error={!formData.title.trim()}
                        helperText={
                          !formData.title.trim() ? "Title is required" : ""
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="URL Slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value,
                          }))
                        }
                        placeholder="url-friendly-slug"
                        required
                        error={!formData.slug.trim()}
                        helperText={
                          !formData.slug.trim() ? "Slug is required" : ""
                        }
                      />
                    </Grid>
                       <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                          <InputLabel id="author-label">Author</InputLabel>
                          <Select
                            labelId="author-label"
                            value={formData.authorId}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                authorId: e.target.value,
                              }))
                            }
                            required
                            error={!formData.authorId}
                            label="Author"
                          >
                            <MenuItem value="">Select Author</MenuItem>
                            {authors.map((author) => (
                              <MenuItem key={author.id} value={author.id}>
                                {author.name || author.email}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            excerpt: e.target.value,
                          }))
                        }
                        placeholder="Brief description of the blog post..."
                        required
                        error={!formData.excerpt.trim()}
                        helperText={
                          !formData.excerpt.trim()
                            ? "Excerpt is required"
                            : `${formData.excerpt.length}/160 characters (recommended for SEO)`
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      <ArticleIcon />
                    </Avatar>
                  }
                  title="Content"
                  subheader={`${wordCount} words • ~${readingTime} min read`}
                />
                <CardContent>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, content }))
                    }
                  />
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "warning.main" }}>
                      <ImageIcon />
                    </Avatar>
                  }
                  title="Featured Image"
                  subheader="Upload an image for your blog post"
                />
                <CardContent>
                  <ImageUpload
                    value={formData.image}
                    onChange={(image) =>
                      setFormData((prev) => ({ ...prev, image }))
                    }
                    label="Featured Image"
                  />
                </CardContent>
              </Card>
            </Stack>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={1}>
            <Stack spacing={4}>
              {/* Categories */}
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "info.main" }}>
                      <CategoryIcon />
                    </Avatar>
                  }
                  title="Categories"
                  subheader="Organize your content with categories"
                />
                <CardContent>
                  <Stack spacing={3}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {formData.selectedCategories.map((category) => {
                        console.log(
                          "🚀 ~ {formData.selectedCategories.map ~ category:",
                          category
                        );
                        if (!category.id) return null;
                        return (
                          <Chip
                            key={category.id}
                            label={category.name}
                            onDelete={() => removeCategory(category.id)}
                            color="primary"
                            variant="filled"
                          />
                        );
                      })}
                    </Box>

                    {showNewCategory ? (
                      <Stack direction="row" spacing={1}>
                        <TextField
                          fullWidth
                          size="small"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="New category name"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleNewCategoryAdd()
                          }
                        />
                        <Button
                          variant="contained"
                          onClick={handleNewCategoryAdd}
                        >
                          Add
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setShowNewCategory(false)}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    ) : (
                      <Stack spacing={2}>
                        <FormControl fullWidth>
                          <InputLabel>Select Category</InputLabel>
                          <Select
                            value=""
                            label="Select Category"
                            onChange={(e) => {
                              const selectedCategory = categories.find(
                                (cat) => cat.id === e.target.value
                              );
                              if (selectedCategory) {
                                addExistingCategory(selectedCategory);
                              }
                            }}
                          >
                            {categories
                              .filter(
                                (cat) =>
                                  !formData.selectedCategories.some(
                                    (selected) => selected.id === cat.id
                                  )
                              )
                              .map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                  {category.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>

                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => setShowNewCategory(true)}
                          sx={{ alignSelf: "flex-start" }}
                        >
                          New Category
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "success.main" }}>
                      <TagIcon />
                    </Avatar>
                  }
                  title="Tags"
                  subheader="Add relevant tags to improve discoverability"
                />
                <CardContent>
                  <Stack spacing={3}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {formData.selectedTags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={`#${tag.name}`}
                          onDelete={() => removeTag(tag.id)}
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    {/* Suggested Tags */}
                    {existingTags.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Suggested Tags:
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {existingTags
                            .filter(
                              (tag) =>
                                !formData.selectedTags.some(
                                  (selected) => selected.id === tag.id
                                )
                            )
                            .slice(0, 10)
                            .map((tag) => (
                              <Chip
                                key={tag.id}
                                label={`#${tag.name}`}
                                size="small"
                                variant="outlined"
                                onClick={() => addExistingTag(tag)}
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": { bgcolor: "action.hover" },
                                }}
                              />
                            ))}
                        </Box>
                      </Box>
                    )}
                    <Stack direction="row" spacing={1}>
                      <TextField
                        fullWidth
                        size="small"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addNewTag(newTag);
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => addNewTag(newTag)}
                        disabled={!newTag.trim()}
                      >
                        Add
                      </Button>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      Press Enter or comma to add tags
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              {/* Publishing Settings */}
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "warning.main" }}>
                      <SettingsIcon />
                    </Avatar>
                  }
                  title="Publishing Settings"
                  subheader="Control when and how your post is published"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isPublished}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              isPublished: e.target.checked,
                            }))
                          }
                          color="primary"
                        />
                      }
                      label="Publish immediately"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isFeatured}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              isFeatured: e.target.checked,
                            }))
                          }
                          color="secondary"
                        />
                      }
                      label="Featured post"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </TabPanel>

          {/* SEO Tab */}
          <TabPanel value={tabValue} index={2}>
            <Stack spacing={4}>
              {/* SEO Settings */}
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "error.main" }}>
                      <SearchIcon />
                    </Avatar>
                  }
                  title="SEO Optimization"
                  subheader="Optimize your post for search engines"
                />
                <CardContent>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="SEO Title"
                      value={formData.seoTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seoTitle: e.target.value,
                        }))
                      }
                      placeholder="SEO optimized title"
                      helperText={`${formData.seoTitle.length}/60 characters (recommended)`}
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="SEO Description"
                      value={formData.seoDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seoDescription: e.target.value,
                        }))
                      }
                      placeholder="SEO meta description"
                      helperText={`${formData.seoDescription.length}/160 characters (recommended)`}
                    />

                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        SEO Keywords
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        {formData.seoKeywords.map((keyword) => (
                          <Chip
                            key={keyword}
                            label={keyword}
                            onDelete={() => removeSeoKeyword(keyword)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <TextField
                          fullWidth
                          size="small"
                          value={newSeoKeyword}
                          onChange={(e) => setNewSeoKeyword(e.target.value)}
                          placeholder="Add SEO keyword"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSeoKeyword(newSeoKeyword);
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => addSeoKeyword(newSeoKeyword)}
                          disabled={!newSeoKeyword.trim()}
                        >
                          Add
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* SEO Preview */}
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Search Engine Preview"
                  subheader="How your post will appear in search results"
                />
                <CardContent>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      bgcolor: alpha("#f5f5f5", 0.5),
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1976d2",
                        fontWeight: 500,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formData.seoTitle || formData.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2e7d32", mb: 1 }}
                    >
                      yourwebsite.com/blog/{formData.slug}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {formData.seoDescription || formData.excerpt}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Stack>
          </TabPanel>
        </Paper>

        {/* Form Actions */}
        <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {post ? "Last updated" : "Creating new post"}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isLoading}
                sx={{ borderRadius: 2 }}
              >
                Save as Draft
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={16} />
                  ) : formData.isPublished ? (
                    <EyeIcon />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{ borderRadius: 2, minWidth: 140 }}
              >
                {isLoading
                  ? formData.isPublished
                    ? "Publishing..."
                    : "Saving..."
                  : formData.isPublished
                    ? "Publish Post"
                    : "Save Post"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </form>
    </Box>
  );
}
