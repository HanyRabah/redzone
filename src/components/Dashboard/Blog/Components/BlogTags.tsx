"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography, 
  Paper,
  IconButton,
  Stack,
  LinearProgress,
  alpha,
  Avatar,
  InputAdornment,
  CircularProgress,
  Card,
  CardHeader,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocalOffer as TagIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import { BlogTag } from "@prisma/client";
//import BlogTagSearch from "./BlogTagSearch";
//import BlogTagsStats from "./BlogTagsStats";

interface BlogTagsManagerProps {
  tags: BlogTag[];
}

// TagForm Component
function TagForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tagName, setTagName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/blog/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tagName.trim().toLowerCase(),
          slug: tagName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create tag");
      }

      toast.success("Tag created successfully");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create tag"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Tag Name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter tag name"
            required
            error={!tagName.trim()}
            helperText={
              !tagName.trim()
                ? "Tag name is required"
                : "Tag will be automatically converted to lowercase"
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TagIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isLoading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !tagName.trim()}
          startIcon={isLoading ? <CircularProgress size={16} /> : <AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          {isLoading ? "Creating..." : "Create Tag"}
        </Button>
      </DialogActions>
    </Box>
  );
}

export default function BlogTagsManager({ tags }: BlogTagsManagerProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteTag = async (tagName: string) => {
    const tagToDelete = tags.find((tag) => tag.name === tagName);

    if (!tagToDelete) {
      toast.error("Tag not found");
      return;
    }

    if (tagToDelete) {
      if (
        !confirm(
          `the tag ${tagToDelete.name} is used in ${tagToDelete.postCount} post(s). Are you sure you want to remove it from all posts?`
        )
      ) {
        return;
      }
    }

    try {
      const response = await fetch(
        `/api/admin/blog/tags/${encodeURIComponent(tagToDelete.id)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }

      toast.success("Tag deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to delete tag");
    }
  };

  const maxCount = Math.max(...tags.map((t) => t.postCount), 1);


  return (
    <Card sx={{ mx: "auto" }}>
      <CardHeader
        title={
          <Box sx={{ m: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Blog Tags
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setIsDialogOpen(true);
                }}
                sx={{ borderRadius: 2 }}
              >
                Create Tag
              </Button>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Manage your blog tags
            </Typography>
          </Box>
        }
      />
      <CardContent>
        {/*<BlogTagsStats tags={tags} />*/}
        {/* Tags Cloud */}
        {/*<BlogTagSearch tags={tags} />*/}
        {/* Stats Cards */}

        {/* Popular Tags */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
              <TrendingUpIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
             Tags
            </Typography>
          </Box>

          <Stack spacing={3}>
            {tags
              .sort((a, b) => b.postCount - a.postCount)
              .slice(0, 10)
              .map((tag, index) => {
                const percentage = (tag.postCount / maxCount) * 100;
                //const color = getTagColor(index)

                return (
                  <Box key={tag.name}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha("#1976d2", 0.1),
                            color: "primary.main",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          #{tag.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {percentage.toFixed(1)}%
                        </Typography>
                        <Chip
                          label={tag.postCount}
                          size="small"
                          sx={{
                            bgcolor: alpha("#1976d2", 0.1),
                            color: "primary.main",
                            fontWeight: 600,
                            minWidth: 40,
                          }}
                        />
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleDeleteTag(tag.name)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.max(5, percentage)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha("#1976d2", 0.1),
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#1976d2",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
          </Stack>
        </Paper>
      </CardContent>
      {/* Tag Form Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
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
          <DialogTitle sx={{ p: 0, fontSize: "1.25rem", fontWeight: 600 }}>
            Add New Tag
          </DialogTitle>
          <IconButton onClick={() => setIsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TagForm onClose={() => setIsDialogOpen(false)} />
      </Dialog>
    </Card>
  );
}
