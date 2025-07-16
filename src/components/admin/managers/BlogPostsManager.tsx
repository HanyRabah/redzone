"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  Stack,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Article as ArticleIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import Image from "next/image";
import BlogPostForm from "@/components/admin/forms/BlogPostForm";
import { BlogCategory, BlogPost, BlogTag, User } from "@prisma/client";

interface BlogPostType extends BlogPost {
  author: User | null;
}

interface BlogPostType extends BlogPost {
  categories: BlogCategory[];
  tags: BlogTag[];
  author: User | null;
}

interface BlogPostsManagerProps {
  posts: BlogPostType[] | null;
  categories: BlogCategory[];
  tags: BlogTag[];
  authors: User[];
}

export default function BlogPostsManager({
  posts,
  categories,
  tags,
  authors,
}: BlogPostsManagerProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts?.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && post.isPublished) ||
        (statusFilter === "draft" && !post.isPublished) ||
        (statusFilter === "featured" && post.isFeatured);

      const matchesCategory =
        categoryFilter === "all" || post.categoryId === categoryFilter;

      const matchesAuthor =
        authorFilter === "all" || post.author?.id === authorFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesAuthor;
    });
  }, [posts, searchTerm, statusFilter, categoryFilter, authorFilter]);

  const openEditDialog = (post: BlogPostType) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }

      toast.success("Blog post deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Failed to delete blog post");
    }
  };

  const handleQuickAction = async (postId: string, action: string) => {
    try {
      const response = await fetch(
        `/api/admin/blog/posts/${postId}/quick-action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} blog post`);
      }

      toast.success(`Blog post ${action}d successfully`);
      router.refresh();
    } catch (error) {
      console.error(`Error ${action}ing blog post:`, error);
      toast.error(`Failed to ${action} blog post`);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const stats = [
    {
      title: "Total Posts",
      value: posts?.length || 0,
      icon: ArticleIcon,
      color: "#1976d2",
    },
    {
      title: "Published",
      value: posts?.filter((p) => p.isPublished).length || 0,
      icon: EyeIcon,
      color: "#2e7d32",
    },
    {
      title: "Drafts",
      value: posts?.filter((p) => !p.isPublished).length || 0,
      icon: EditIcon,
      color: "#ed6c02",
    },
    {
      title: "Featured",
      value: posts?.filter((p) => p.isFeatured).length || 0,
      icon: StarIcon,
      color: "#9c27b0",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Blog Posts Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create, edit, and manage your blog content
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                    }}
                  >
                    <IconComponent />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: stat.color }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            fullWidth
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Drafts</MenuItem>
              <MenuItem value="featured">Featured</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Author</InputLabel>
              <Select
                value={authorFilter}
                label="Author"
                onChange={(e) => setAuthorFilter(e.target.value)}
              >
                <MenuItem value="all">All Authors</MenuItem>
                {authors?.map((author) => (
                  <MenuItem key={author.id} value={author.name || ""}>
                    {author.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{ borderRadius: 2, px: 3, py: 1.5 }}
          >
            New Post
          </Button>
        </Stack>
      </Paper>

      {/* Posts List */}
      {filteredPosts?.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <ArticleIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ||
            statusFilter !== "all" ||
            categoryFilter !== "all" ||
            authorFilter !== "all"
              ? "No posts match your filters"
              : "No blog posts found"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {!searchTerm &&
              statusFilter === "all" &&
              categoryFilter === "all" &&
              authorFilter === "all" &&
              "Get started by creating your first blog post"}
          </Typography>
        </Paper>
      ) : (
        <>
          <Stack spacing={3}>
            {filteredPosts?.map((post) => (
              <Card
                key={post.id}
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 6,
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", gap: 3 }}>
                    {/* Featured Image */}
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        overflow: "hidden",
                        flexShrink: 0,
                        position: "relative",
                        bgcolor: "grey.100",
                      }}
                    >
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.200",
                            color: "grey.500",
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 32 }} />
                        </Box>
                      )}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {post.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              mb: 2,
                            }}
                          >
                            {post.excerpt}
                          </Typography>
                        </Box>

                        {/* Quick Actions */}
                        <Box sx={{ display: "flex", gap: 0.5, ml: 2 }}>
                          <Tooltip title="Edit Post">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(post)}
                              sx={{ color: "primary.main" }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={post.isPublished ? "Unpublish" : "Publish"}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuickAction(
                                  post.id,
                                  post.isPublished ? "unpublish" : "publish"
                                )
                              }
                              sx={{
                                color: post.isPublished
                                  ? "success.main"
                                  : "warning.main",
                              }}
                            >
                              {post.isPublished ? <EyeIcon /> : <EyeOffIcon />}
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={post.isFeatured ? "Unfeature" : "Feature"}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuickAction(
                                  post.id,
                                  post.isFeatured ? "unfeature" : "feature"
                                )
                              }
                              sx={{
                                color: post.isFeatured
                                  ? "#f57c00"
                                  : "action.active",
                              }}
                            >
                              {post.isFeatured ? (
                                <StarIcon />
                              ) : (
                                <StarBorderIcon />
                              )}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete Post">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(post.id)}
                              sx={{ color: "error.main" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Meta Information */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <PersonIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {post.author?.name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <CalendarIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {post.publishedAt
                              ? formatDate(post.publishedAt)
                              : formatDate(post.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Status and Category Badges */}
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={post.isPublished ? "Published" : "Draft"}
                          size="small"
                          color={post.isPublished ? "success" : "warning"}
                          variant="filled"
                        />

                        {post.isFeatured && (
                          <Chip
                            label="Featured"
                            size="small"
                            color="primary"
                            icon={<StarIcon />}
                            variant="filled"
                          />
                        )}

                        {post.categories.slice(0, 3).map((category) => (
                          <Chip
                            key={category.id}
                            label={category.name}
                            size="small"
                            variant="outlined"
                            icon={<CategoryIcon />}
                          />
                        ))}

                        {post.categories.length > 3 && (
                          <Chip
                            label={`+${post.categories.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {/* Tags */}
                      {tags.length > 0 && (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {tags.slice(0, 5).map((tag) => (
                            <Chip
                              key={tag.id}
                              label={`#${tag.name}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: "0.75rem",
                                height: 24,
                                bgcolor: alpha("#1976d2", 0.05),
                                borderColor: alpha("#1976d2", 0.2),
                                color: "#1976d2",
                              }}
                            />
                          ))}
                          {tags.length > 5 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ alignSelf: "center" }}
                            >
                              +{tags.length - 5} more
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* Results Summary */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredPosts?.length || 0} of {posts?.length || 0} posts
            </Typography>
          </Box>
        </>
      )}

      {/* Blog Post Form Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{ borderRadius: 3 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            pb: 1,
          }}
        >
          <DialogTitle sx={{ p: 0, fontSize: "1.5rem", fontWeight: 600 }}>
            {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
          </DialogTitle>
          <IconButton onClick={() => setIsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3, pt: 1 }}>
          <BlogPostForm
            post={editingPost}
            categories={categories}
            existingTags={tags}
            authors={authors}
            setIsDialogOpen={setIsDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
