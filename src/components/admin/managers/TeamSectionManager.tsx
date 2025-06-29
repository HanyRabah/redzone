"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
//import DynamicTextArray from "@/components/admin/DynamicTextArray";
import ImageUpload from "../ImageUpload";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Drawer,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  alpha,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Fab
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Groups as GroupsIcon,
  Business as BusinessIcon,
  Photo as PhotoIcon,
  Sort as SortIcon,
  Title as TitleIcon,
  Description as DescriptionIcon
} from "@mui/icons-material";
import { TeamMember, TeamSection } from "@prisma/client";

// Mock types - replace with actual Prisma types

interface TeamSectionManagerProps {
  teamSection: TeamSection | null;
  teamMembers: TeamMember[];
}

// Mock DynamicTextArray component
function DynamicTextArray({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  maxItems 
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  maxItems: number;
}) {
  const addItem = () => {
    if (value.length < maxItems) {
      onChange([...value, '']);
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, newValue: string) => {
    onChange(value.map((item, i) => i === index ? newValue : item));
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Stack spacing={2}>
        {value.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`${placeholder} ${index + 1}`}
            />
            <IconButton 
              onClick={() => removeItem(index)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        {value.length < maxItems && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addItem}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Line
          </Button>
        )}
      </Stack>
    </Box>
  );
}

// TeamMemberForm Component
function TeamMemberForm({
  member,
  onClose,
}: {
  member: TeamMember | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: member?.name || "",
    designation: member?.designation || "",
    image: member?.image || "",
    bio: member?.bio || "",
    isActive: member?.isActive ?? true,
    sortOrder: member?.sortOrder || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = member
        ? `/api/admin/team-members/${member.id}`
        : "/api/admin/team-members";

      const method = member ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save team member");
      }

      toast.success(
        `Team member ${member ? "updated" : "created"} successfully`
      );
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Failed to save team member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 0 }}>
          <Stack spacing={4}>
            {/* Header with avatar */}
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Avatar
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
                src={formData.image}
              >
                {formData.name.charAt(0) || <PersonIcon />}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {member ? 'Edit Team Member' : 'Add New Team Member'}
              </Typography>
            </Box>

            {/* Basic Information */}
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#1976d2', 0.02) }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Basic Information
              </Typography>
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                      error={!formData.name.trim()}
                      helperText={!formData.name.trim() ? 'Name is required' : ''}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Designation"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, designation: e.target.value }))
                      }
                      required
                      error={!formData.designation.trim()}
                      helperText={!formData.designation.trim() ? 'Designation is required' : ''}
                      InputProps={{
                        startAdornment: <BusinessIcon sx={{ color: 'action.active', mr: 1 }} />
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Bio (Optional)"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Brief description about the team member..."
                  helperText={`${formData.bio.length} characters`}
                  InputProps={{
                    startAdornment: <DescriptionIcon sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                  }}
                />
              </Stack>
            </Paper>

            {/* Image Upload */}
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#2e7d32', 0.02) }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Profile Photo
              </Typography>
              {/* Placeholder for ImageUpload component */}
              <Box sx={{ p: 3, border: '2px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
                <PhotoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ImageUpload Component
                </Typography>
                <ImageUpload
                  label="Profile Photo"
                  value={formData.image}
                  onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
                />
              </Box>
            </Paper>

            {/* Settings */}
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#ed6c02', 0.02) }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Settings
              </Typography>
              <Stack spacing={3}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Sort Order"
                      value={formData.sortOrder}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          sortOrder: parseInt(e.target.value) || 0,
                        }))
                      }
                      helperText="Lower numbers appear first"
                      InputProps={{
                        startAdornment: <SortIcon sx={{ color: 'action.active', mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {formData.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          <Typography>
                            {formData.isActive ? 'Active' : 'Inactive'}
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
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
            disabled={isLoading || !formData.name.trim() || !formData.designation.trim()}
            startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            {isLoading ? 'Saving...' : member ? 'Update' : 'Create'} Member
          </Button>
        </DialogActions>
      </Box>
    </Box>
  );
}

export default function TeamSectionManager({
  teamSection,
  teamMembers,
}: TeamSectionManagerProps) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; member: TeamMember | null }>({
    open: false,
    member: null
  });

  const [sectionData, setSectionData] = useState({
    smallTitle: teamSection?.smallTitle || "",
    titleLines: teamSection?.titleLines || ["Team You", "Want to", "Work with"],
    isActive: teamSection?.isActive ?? true,
  });

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setIsDrawerOpen(true);
  };

  const openCreateDialog = () => {
    setEditingMember(null);
    setIsDrawerOpen(true);
  };

  const handleDeleteMember = async (member: TeamMember) => {
    setDeleteDialog({ open: true, member });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.member) return;

    try {
      const response = await fetch(`/api/admin/team-members/${deleteDialog.member.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }

      toast.success("Team member deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    } finally {
      setDeleteDialog({ open: false, member: null });
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/team-section", {
        method: teamSection ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...sectionData,
          id: teamSection?.id || "main",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save team section");
      }

      toast.success("Team section saved successfully");
      router.refresh();
    } catch (error) {
      console.error("Error saving team section:", error);
      toast.error("Failed to save team section");
    } finally {
      setIsLoading(false);
    }
  };

  const activeMembers = teamMembers.filter(member => member.isActive).length;
  const inactiveMembers = teamMembers.length - activeMembers;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <GroupsIcon sx={{ color: 'white' }} />
          </Avatar>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
            Team Section Manager
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Manage your team section settings and team members
        </Typography>
      </Paper>

      <Stack spacing={4}>
        {/* Team Section Settings */}
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardHeader
            sx={{ 
              bgcolor: alpha('#1976d2', 0.05),
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
            avatar={
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <SettingsIcon />
              </Avatar>
            }
            title="Team Section Settings"
            subheader="Configure the main team section display"
            action={
              <Chip
                icon={sectionData.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                label={sectionData.isActive ? 'Active' : 'Inactive'}
                color={sectionData.isActive ? 'success' : 'default'}
                variant="outlined"
              />
            }
          />
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSaveSection}>
              <Stack spacing={4}>
                <TextField
                  fullWidth
                  label="Small Title"
                  value={sectionData.smallTitle}
                  onChange={(e) =>
                    setSectionData((prev) => ({
                      ...prev,
                      smallTitle: e.target.value,
                    }))
                  }
                  placeholder="Our Team"
                  InputProps={{
                    startAdornment: <TitleIcon sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />

                <DynamicTextArray
                  label="Title Lines (for animation)"
                  value={sectionData.titleLines}
                  onChange={(titleLines) =>
                    setSectionData((prev) => ({ ...prev, titleLines }))
                  }
                  placeholder="Enter title line"
                  maxItems={5}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={sectionData.isActive}
                      onChange={(e) =>
                        setSectionData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {sectionData.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      <Typography>Section Active</Typography>
                    </Box>
                  }
                />

                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                  sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
                >
                  {isLoading ? 'Saving...' : 'Save Section Settings'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardHeader
            sx={{ 
              bgcolor: alpha('#2e7d32', 0.05),
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
            avatar={
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <GroupsIcon />
              </Avatar>
            }
            title="Team Members"
            subheader={`${teamMembers.length} total members (${activeMembers} active, ${inactiveMembers} inactive)`}
            action={
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={openCreateDialog}
                sx={{ borderRadius: 2 }}
              >
                Add Member
              </Button>
            }
          />
          <CardContent sx={{ p: 4 }}>
            {teamMembers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No team members found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add team members to showcase your team
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateDialog}
                  sx={{ borderRadius: 2 }}
                >
                  Add First Team Member
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {teamMembers
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((member) => (
                  <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      {/* Member Image */}
                      <Box sx={{ position: 'relative', height: 200 }}>
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Box sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: 'grey.200'
                          }}>
                            <Avatar sx={{ width: 60, height: 60, fontSize: '1.5rem' }}>
                              {member.name.charAt(0)}
                            </Avatar>
                          </Box>
                        )}
                        
                        {/* Status Badge */}
                        <Chip
                          icon={member.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          label={member.isActive ? 'Active' : 'Inactive'}
                          color={member.isActive ? 'success' : 'default'}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8
                          }}
                        />

                        {/* Sort Order Badge */}
                        <Chip
                          label={`#${member.sortOrder}`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white'
                          }}
                        />
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {member.name}
                        </Typography>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          {member.designation}
                        </Typography>
                        {member.bio && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {member.bio}
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Tooltip title="Edit Member">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(member)}
                              sx={{ color: 'primary.main' }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Member">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteMember(member)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Team Member Form Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { 
            width: { xs: '100%', sm: 500 },
            borderRadius: '16px 0 0 16px'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
          </Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <TeamMemberForm
          member={editingMember}
          onClose={() => setIsDrawerOpen(false)}
        />
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, member: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Team Member
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog.member?.name}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, member: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add team member"
        onClick={openCreateDialog}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}