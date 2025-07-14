// components/admin/forms/ProjectForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2 } from "lucide-react";
import { Project, ProjectCategory } from "@prisma/client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { Label } from "@radix-ui/react-dropdown-menu";
import RichTextEditor from "@/components/RichTextEditor";

interface ProjectFormProps {
  project?: Project | null;
  categories: ProjectCategory[];
  onClose: () => void;
}

export default function ProjectForm({
  project,
  categories,
  onClose,
}: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
 
  const [formData, setFormData] = useState({
    title: project?.title || "",
    categoryId: project?.categoryId || "",
    description: project?.description || "",
    content: project?.content || "",
    image: project?.image || "",
    link: project?.link || "",
    slug: project?.slug || "",
    client: project?.client || "",
    role: project?.role || "",
    year: project?.year || "",
    isActive: project?.isActive ?? true,
    isFeatured: project?.isFeatured ?? false,
    sortOrder: project?.sortOrder || 0,
  });


  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    console.log("Selected category:", value); 
    setFormData((prev) => ({ 
      ...prev, 
      categoryId: value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      setIsLoading(false);
      return;
    }

    if (!formData.categoryId || formData.categoryId === "") {
      toast.error("Category is required");
      setIsLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      setIsLoading(false);
      return;
    }

    if (!formData.image.trim()) {
      toast.error("Project image is required");
      setIsLoading(false);
      return;
    }
    if (!formData.year) {
      toast.error("Year is required");
      setIsLoading(false);
      return;
    }
    if (!formData.client.trim()) {
      toast.error("Client is required");
      setIsLoading(false);
      return;
    }
    if (!formData.role.trim()) {
      toast.error("Role is required");
      setIsLoading(false);
      return;
    }

    try {
      const url = project
        ? `/api/admin/projects/${project.id}`
        : "/api/admin/projects";

      const method = project ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || generateSlug(formData.title),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save project");
      }

      toast.success(`Project ${project ? "updated" : "created"} successfully`);
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save project"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader sx={{ p: 2 }} title="Basic Information" />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl>
              <TextField
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Amazing Project Name"
                label="Project Title"
                required
              />
            </FormControl>

            <FormControl>
                <FormControl fullWidth>
            
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={formData.categoryId || ""}
                    onChange={(e) => handleCategorySelect(e)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      <em>Select a category</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </FormControl>
          </div>

          <FormControl fullWidth>
            <TextField
              id="description"
              value={formData.description}
              label="Short Description"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              multiline
              placeholder="Brief description of the project..."
              required
            />
          </FormControl>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <FormControl fullWidth>
              <TextField
                id="client"
                value={formData.client}
                label="Client Name"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    client: e.target.value,
                  }))
                }
                placeholder="Client name..."
                required
              />
            </FormControl>

            {/* <FormControl fullWidth>
              <TextField
                id="role"
                value={formData.role}
                label="Role"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                placeholder="Role of the client..."
                required
              />
            </FormControl> */}

            <FormControl fullWidth>
              <TextField
                id="year"
                value={formData.year}
                label="Project Year"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    year: e.target.value,
                  }))
                }
                placeholder="Year of the project..."
                required
              />
            </FormControl>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader sx={{ p: 2 }} title="Project Content" />
        <CardContent>
          <RichTextEditor
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader sx={{ p: 2 }} title="Project Video" />
        <CardContent>
          <FormControl fullWidth>
            <Label>Youtube id (optional)</Label>
            <Tooltip title="Add youtube id Example: dQw4w9WgXcQ">
              <TextField
              id="link"
              value={formData.link?.split('/').pop()}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
              placeholder="Add youtube id Example: dQw4w9WgXcQ"
              type="url"
            />
            </Tooltip>
          </FormControl>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader sx={{ p: 2 }} title="Project Media" />
        <CardContent>
          <ImageUpload
            label="Project Image *"
            value={formData.image}
            onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
          />
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader sx={{ p: 2 }} title="Project Settings" />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl>
              <Label>URL Slug *</Label>
              <TextField
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="project-url-slug"
                required
              />
            </FormControl>
            <FormControl>
              <Label>Sort Order</Label>
              <TextField
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sortOrder: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="0"
              />
            </FormControl>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormControl className="flex items-center space-x-2 pt-6 align-middle justify-center">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
              <Label>Active</Label>
            </FormControl>

            <FormControl className="flex items-center space-x-2 pt-6 align-middle justify-center">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
              />
              <Label>Featured</Label>
            </FormControl>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 gap-2">
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : project ? (
            "Update Project"
          ) : (
            "Create Project"
          )}
        </Button>
      </div>
    </form>
  );
}
