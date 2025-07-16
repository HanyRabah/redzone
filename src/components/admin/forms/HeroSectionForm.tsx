"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Badge,
  Stack,
  Tooltip,
  LinearProgress,
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIcon,
  Link as LinkIcon,
  Anchor as AnchorIcon,
  Save as SaveIcon,
  Slideshow as SlideshowIcon,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  // PlayArrow as PlayArrowIcon,
  // FiberManualRecord as DotIcon,
  // ArrowBack as ArrowBackIcon,
  Speed as SpeedIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  TouchApp as TouchAppIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import { toast } from "sonner";
import { HeroSlide } from "@prisma/client";
import ImageUpload from "../ImageUpload";
// import ImageUpload from "@/components/admin/ImageUpload";


interface HeroSlider {
  id?: string;
  page: string;
  autoplay: boolean;
  autoplaySpeed: number;
  showDots: boolean;
  showArrows: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HeroSliderWithSlides extends HeroSlider {
  slides: HeroSlide[];
}

interface HeroSliderFormProps {
  page: string;
  initialData?: HeroSliderWithSlides | null;
}

// Helper function to create empty slide
const createEmptySlide = (
  sortOrder: number
): Omit<HeroSlide, "id" | "createdAt" | "updatedAt" | "heroSliderId"> => ({
  backgroundImage: null,
  welcomeText: null,
  titleLines: ["", "", ""],
  description: "",
  buttonText: null,
  buttonLink: null,
  buttonType: "internal",
  isActive: true,
  sortOrder,
});

export default function HeroSliderForm({
  page,
  initialData,
}: HeroSliderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; slideIndex: number | null }>({
    open: false,
    slideIndex: null
  });

  // Initialize slider settings
  const [sliderSettings, setSliderSettings] = useState<
    Omit<HeroSlider, "id" | "createdAt" | "updatedAt">
  >({
    page,
    autoplay: initialData?.autoplay ?? true,
    autoplaySpeed: initialData?.autoplaySpeed ?? 5,
    showDots: initialData?.showDots ?? true,
    showArrows: initialData?.showArrows ?? true,
    isActive: initialData?.isActive ?? true,
  });

  // Initialize slides
  const [slides, setSlides] = useState<
    (
      | HeroSlide
      | Omit<HeroSlide, "id" | "createdAt" | "updatedAt" | "heroSliderId">
    )[]
  >(initialData?.slides || [createEmptySlide(0)]);

  const addSlide = () => {
    setSlides((prev) => [...prev, createEmptySlide(prev.length)]);
  };

  const removeSlide = (slideIndex: number) => {
    if (slides.length <= 1) {
      toast.error("At least one slide is required");
      return;
    }

    setSlides((prev) => {
      const newSlides = prev.filter((_, index) => index !== slideIndex);
      // Update sort orders
      return newSlides.map((slide, index) => ({
        ...slide,
        sortOrder: index,
      }));
    });
    setDeleteDialog({ open: false, slideIndex: null });
  };

  const confirmDelete = (slideIndex: number) => {
    setDeleteDialog({ open: true, slideIndex });
  };

  const updateSlide = (slideIndex: number, updates: Partial<HeroSlide>) => {
    setSlides((prev) =>
      prev.map((slide, index) =>
        index === slideIndex ? { ...slide, ...updates } : slide
      )
    );
  };

  const updateTitleLine = (
    slideIndex: number,
    lineIndex: number,
    value: string
  ) => {
    const slide = slides[slideIndex];
    if (!slide) return;

    const newTitleLines = [...slide.titleLines];
    newTitleLines[lineIndex] = value;

    updateSlide(slideIndex, { titleLines: newTitleLines });
  };

  const moveSlide = (slideIndex: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? slideIndex - 1 : slideIndex + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(slideIndex, 1);
    newSlides.splice(newIndex, 0, movedSlide);

    // Update sort orders
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      sortOrder: index,
    }));

    setSlides(updatedSlides);
  };

  // Drag and Drop functions
  const handleDragStart = (e: React.DragEvent, slideIndex: number) => {
    setDraggedSlideId(slideIndex.toString());
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", slideIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    const draggedIndex = parseInt(draggedSlideId || "-1");
    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      setDraggedSlideId(null);
      return;
    }

    const newSlides = [...slides];
    const [draggedSlide] = newSlides.splice(draggedIndex, 1);
    newSlides.splice(targetIndex, 0, draggedSlide);

    // Update sort orders
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      sortOrder: index,
    }));

    setSlides(updatedSlides);
    setDraggedSlideId(null);
  };

  const handleDragEnd = () => {
    setDraggedSlideId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    const activeSlides = slides.filter((slide) => slide.isActive);
    if (activeSlides.length === 0) {
      toast.error("At least one slide must be active");
      setIsLoading(false);
      return;
    }

    // Check if all active slides have required fields
    const invalidSlides = activeSlides.filter(
      (slide) =>
        !slide.titleLines.some((line) => line.trim()) ||
        !slide.description.trim()
    );

    if (invalidSlides.length > 0) {
      toast.error(
        "All active slides must have at least one title line and a description"
      );
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const apiData = {
        ...sliderSettings,
        id: initialData?.id,
        slides: slides.map((slide, index) => ({
          ...slide,
          sortOrder: index,
          titleLines: slide.titleLines.filter((line) => line.trim()), // Remove empty lines
        })),
      };
      const response = await fetch("/api/admin/hero-slider", {
        method: initialData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ path: '/(public)/home' }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save hero slider");
      }

      const result = await response.json();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        initialData
          ? "Hero slider updated successfully"
          : "Hero slider created successfully"
      );
      router.refresh();
    } catch (error) {
      console.error("Error saving hero slider:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save hero slider"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getSlideColor = (index: number) => {
    const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1'];
    return colors[index % colors.length];
  };

  const activeSlides = slides.filter(slide => slide.isActive).length;
  const completedSlides = slides.filter(slide => 
    slide.titleLines.some(line => line.trim()) && slide.description.trim()
  ).length;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <SlideshowIcon sx={{ color: 'white' }} />
          </Avatar>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
            {initialData ? 'Edit' : 'Create'} Hero Slider
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Configure hero slider for <strong>{page}</strong> page with multiple slides and animations
        </Typography>
      </Paper>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Slider Settings */}
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
              title="Slider Configuration"
              subheader="Global settings for the hero slider"
              action={
                <Chip
                  icon={sliderSettings.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  label={sliderSettings.isActive ? 'Active' : 'Inactive'}
                  color={sliderSettings.isActive ? 'success' : 'default'}
                  variant="outlined"
                />
              }
            />
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid sx={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Autoplay Speed"
                    value={sliderSettings.autoplaySpeed}
                    onChange={(e) =>
                      setSliderSettings((prev) => ({
                        ...prev,
                        autoplaySpeed: parseInt(e.target.value) || 5,
                      }))
                    }
                    inputProps={{ min: 1, max: 30 }}
                    helperText="Seconds between slides"
                    InputProps={{
                      startAdornment: <SpeedIcon sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>

                {/* <Grid sx={{ xs: 12, md: 8 }}>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', height: '100%', flexWrap: 'wrap' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={sliderSettings.autoplay}
                          onChange={(e) => setSliderSettings(prev => ({ 
                            ...prev, 
                            autoplay: e.target.checked 
                          }))}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PlayArrowIcon fontSize="small" />
                          <Typography>Autoplay</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={sliderSettings.showDots}
                          onChange={(e) => setSliderSettings(prev => ({ 
                            ...prev, 
                            showDots: e.target.checked 
                          }))}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DotIcon fontSize="small" />
                          <Typography>Show Dots</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={sliderSettings.showArrows}
                          onChange={(e) => setSliderSettings(prev => ({ 
                            ...prev, 
                            showArrows: e.target.checked 
                          }))}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ArrowBackIcon fontSize="small" />
                          <Typography>Show Arrows</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={sliderSettings.isActive}
                          onChange={(e) =>
                            setSliderSettings((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {sliderSettings.isActive ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                          <Typography>Enable Slider</Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>

          {/* Slides Overview */}
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardHeader
              sx={{ 
                bgcolor: alpha('#2e7d32', 0.05),
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
              avatar={
                <Badge badgeContent={slides.length} color="primary">
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <SlideshowIcon />
                  </Avatar>
                </Badge>
              }
              title="Slides Management"
              subheader={`${slides.length} slides total • ${activeSlides} active • ${completedSlides} completed`}
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addSlide}
                  sx={{ borderRadius: 2 }}
                >
                  Add Slide
                </Button>
              }
            />
            <CardContent sx={{ p: 0 }}>
              {slides.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <SlideshowIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No slides added yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your first slide to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addSlide}
                    sx={{ borderRadius: 2 }}
                  >
                    Add First Slide
                  </Button>
                </Box>
              ) : (
                <Box sx={{ p: 2 }}>
                  {slides.map((slide, index) => {
                    const slideColor = getSlideColor(index);
                    const isCompleted = slide.titleLines.some(line => line.trim()) && slide.description.trim();
                    const hasImage = slide.backgroundImage?.trim();
                    const hasButton = slide.buttonText?.trim() && slide.buttonLink?.trim();
                    
                    return (
                      <Accordion
                        key={`slide-${index}`}
                        defaultExpanded={index === 0}
                        sx={{
                          opacity: draggedSlideId === index.toString() ? 0.5 : 1,
                          transition: "opacity 0.2s ease",
                          mb: 1,
                          borderRadius: 2,
                          border: `2px solid ${alpha(slideColor, 0.2)}`,
                          '&:before': { display: 'none' },
                          '&.Mui-expanded': {
                            borderColor: slideColor
                          }
                        }}
                      >
                        <AccordionSummary
                          component={Box}
                          expandIcon={<ExpandMoreIcon />}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          sx={{
                            bgcolor: alpha(slideColor, 0.05),
                            borderRadius: '8px 8px 0 0',
                            '&.Mui-expanded': {
                              bgcolor: alpha(slideColor, 0.1)
                            }
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              width: "100%",
                            }}
                          >
                            <Box
                              draggable
                              onDragStart={(e) => handleDragStart(e, index)}
                              onDragEnd={handleDragEnd}
                              sx={{
                                cursor: "grab",
                                display: "flex",
                                alignItems: "center",
                                "&:active": { cursor: "grabbing" },
                              }}
                            >
                              <DragIcon sx={{ color: slideColor }} />
                            </Box>
                            
                            <Avatar
                              sx={{ 
                                bgcolor: alpha(slideColor, 0.2), 
                                color: slideColor, 
                                width: 32, 
                                height: 32,
                                fontSize: '0.875rem',
                                fontWeight: 600
                              }}
                            >
                              {index + 1}
                            </Avatar>
                            
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ color: slideColor, fontWeight: 600 }}>
                                Slide {index + 1}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip
                                  size="small"
                                  icon={slide.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                  label={slide.isActive ? 'Active' : 'Inactive'}
                                  color={slide.isActive ? 'success' : 'default'}
                                  variant="outlined"
                                />
                                {isCompleted && (
                                  <Chip
                                    size="small"
                                    label="Completed"
                                    color="success"
                                    variant="filled"
                                  />
                                )}
                                {hasImage && (
                                  <Chip
                                    size="small"
                                    icon={<ImageIcon />}
                                    label="Image"
                                    color="info"
                                    variant="outlined"
                                  />
                                )}
                                {hasButton && (
                                  <Chip
                                    size="small"
                                    icon={<TouchAppIcon />}
                                    label="CTA"
                                    color="warning"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Move up">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveSlide(index, "up");
                                  }}
                                  disabled={index === 0}
                                  sx={{ color: slideColor }}
                                >
                                  ↑
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Move down">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveSlide(index, "down");
                                  }}
                                  disabled={index === slides.length - 1}
                                  sx={{ color: slideColor }}
                                >
                                  ↓
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete slide">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(index);
                                  }}
                                  disabled={slides.length <= 1}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 4 }}>
                          <Grid container spacing={4}>
                            {/* Left Column - Content */}
                            <Grid sx={{ xs: 12, lg: 6 }}>
                              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#f5f5f5', 0.5) }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                  Content
                                </Typography>
                                <Stack spacing={3}>
                                  <TextField
                                    fullWidth
                                    label="Welcome Text"
                                    value={slide.welcomeText || ""}
                                    onChange={(e) =>
                                      updateSlide(index, { welcomeText: e.target.value })
                                    }
                                    placeholder="Welcome to our website"
                                    InputProps={{
                                      startAdornment: <TitleIcon sx={{ color: 'action.active', mr: 1 }} />
                                    }}
                                  />

                                  <Box>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                      Title Lines (Max 3)
                                    </Typography>
                                    {[0, 1, 2].map((lineIndex) => (
                                      <TextField
                                        key={lineIndex}
                                        fullWidth
                                        label={`Title Line ${lineIndex + 1}`}
                                        value={slide.titleLines[lineIndex] || ""}
                                        onChange={(e) =>
                                          updateTitleLine(index, lineIndex, e.target.value)
                                        }
                                        placeholder={`Enter title line ${lineIndex + 1}`}
                                        sx={{ mb: 2 }}
                                        error={lineIndex === 0 && !slide.titleLines[lineIndex]?.trim()}
                                        helperText={lineIndex === 0 && !slide.titleLines[lineIndex]?.trim() ? 'At least one title line is required' : ''}
                                      />
                                    ))}
                                  </Box>

                                  <TextField
                                    fullWidth
                                    label="Description"
                                    value={slide.description}
                                    onChange={(e) =>
                                      updateSlide(index, { description: e.target.value })
                                    }
                                    placeholder="Enter slide description"
                                    multiline
                                    rows={3}
                                    required
                                    error={!slide.description.trim()}
                                    helperText={!slide.description.trim() ? 'Description is required' : `${slide.description.length} characters`}
                                    InputProps={{
                                      startAdornment: <DescriptionIcon sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                                    }}
                                  />
                                </Stack>
                              </Paper>
                            </Grid>

                            {/* Right Column - Media & Actions */}
                            <Grid sx={{ xs: 12, lg: 6 }}>
                              <Stack spacing={3}>
                                {/* Background Image */}
                                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#e3f2fd', 0.5) }}>
                                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                    Background
                                  </Typography>
                                  <ImageUpload
                                    label="Background Image"
                                    value={slide.backgroundImage || ""}
                                    onChange={(backgroundImage) => {
                                      updateSlide(index, { backgroundImage })
                                    }}
                                  />
                                </Paper>

                                {/* Call to Action */}
                                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#fff3e0', 0.5) }}>
                                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                    Call to Action Button
                                  </Typography>
                                  <Stack spacing={2}>
                                    <TextField
                                      fullWidth
                                      label="Button Text"
                                      value={slide.buttonText || ""}
                                      onChange={(e) =>
                                        updateSlide(index, { buttonText: e.target.value })
                                      }
                                      placeholder="Learn More"
                                      InputProps={{
                                        startAdornment: <TouchAppIcon sx={{ color: 'action.active', mr: 1 }} />
                                      }}
                                    />

                                    <FormControl fullWidth>
                                      <InputLabel>Button Type</InputLabel>
                                      <Select
                                        value={slide.buttonType}
                                        label="Button Type"
                                        onChange={(e) =>
                                          updateSlide(index, {
                                            buttonType: e.target.value as "internal" | "anchor",
                                          })
                                        }
                                      >
                                        <MenuItem value="internal">
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <LinkIcon fontSize="small" />
                                            Internal Page
                                          </Box>
                                        </MenuItem>
                                        <MenuItem value="anchor">
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <AnchorIcon fontSize="small" />
                                            Anchor Link
                                          </Box>
                                        </MenuItem>
                                      </Select>
                                    </FormControl>

                                    <TextField
                                      fullWidth
                                      label={slide.buttonType === "anchor" ? "Anchor Link" : "Page Link"}
                                      value={slide.buttonLink || ""}
                                      onChange={(e) =>
                                        updateSlide(index, { buttonLink: e.target.value })
                                      }
                                      placeholder={slide.buttonType === "anchor" ? "#about" : "/about"}
                                      helperText={
                                        slide.buttonType === "anchor"
                                          ? "Link to section on same page (e.g., #about)"
                                          : "Link to another page (e.g., /about, /contact)"
                                      }
                                    />
                                  </Stack>
                                </Paper>

                                {/* Slide Settings */}
                                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#f3e5f5', 0.5) }}>
                                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                    Slide Settings
                                  </Typography>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={slide.isActive}
                                        onChange={(e) =>
                                          updateSlide(index, {
                                            isActive: e.target.checked,
                                          })
                                        }
                                        color="primary"
                                      />
                                    }
                                    label={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {slide.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        <Typography>
                                          {slide.isActive ? 'Active Slide' : 'Inactive Slide'}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                </Paper>
                              </Stack>
                            </Grid>
                          </Grid>

                          {/* Slide Progress */}
                          <Box sx={{ mt: 3, p: 2, bgcolor: alpha(slideColor, 0.05), borderRadius: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                              Slide Completion
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  ((slide.titleLines.some(line => line.trim()) ? 25 : 0) +
                                   (slide.description.trim() ? 25 : 0) +
                                   (slide.backgroundImage?.trim() ? 25 : 0) +
                                   (slide.buttonText?.trim() && slide.buttonLink?.trim() ? 25 : 0))
                                }
                                sx={{ 
                                  flex: 1, 
                                  height: 8, 
                                  borderRadius: 4,
                                  bgcolor: alpha(slideColor, 0.1),
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: slideColor
                                  }
                                }}
                              />
                              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                                {Math.round(
                                  ((slide.titleLines.some(line => line.trim()) ? 25 : 0) +
                                   (slide.description.trim() ? 25 : 0) +
                                   (slide.backgroundImage?.trim() ? 25 : 0) +
                                   (slide.buttonText?.trim() && slide.buttonLink?.trim() ? 25 : 0))
                                )}%
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip
                                size="small"
                                label="Title"
                                color={slide.titleLines.some(line => line.trim()) ? 'success' : 'default'}
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                label="Description"
                                color={slide.description.trim() ? 'success' : 'default'}
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                label="Image"
                                color={slide.backgroundImage?.trim() ? 'success' : 'default'}
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                label="Button"
                                color={slide.buttonText?.trim() && slide.buttonLink?.trim() ? 'success' : 'default'}
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Validation Summary */}
          {slides.length > 0 && (
            <Alert 
              severity={activeSlides === 0 ? "error" : completedSlides === 0 ? "warning" : "info"}
              sx={{ borderRadius: 2 }}
            >
              {activeSlides === 0 && "⚠️ At least one slide must be active"}
              {activeSlides > 0 && completedSlides === 0 && "⚠️ Complete at least one slide with title and description"}
              {activeSlides > 0 && completedSlides > 0 && `✅ Ready to save: ${completedSlides} completed slide${completedSlides !== 1 ? 's' : ''} out of ${slides.length}`}
            </Alert>
          )}

          {/* Submit Section */}
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {initialData ? 'Update Hero Slider' : 'Create Hero Slider'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {slides.length} slide{slides.length !== 1 ? 's' : ''} • {activeSlides} active • {completedSlides} completed
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  startIcon={<CancelIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading || activeSlides === 0 || completedSlides === 0}
                  startIcon={isLoading ? <CircularProgress size={16} /> : <SaveIcon />}
                  sx={{ 
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    minWidth: 180
                  }}
                >
                  {isLoading
                    ? "Saving..."
                    : initialData
                      ? "Update Hero Slider"
                      : "Create Hero Slider"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, slideIndex: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Slide
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>Slide {(deleteDialog.slideIndex ?? -1) + 1}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, slideIndex: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => deleteDialog.slideIndex !== null && removeSlide(deleteDialog.slideIndex)} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add slide"
        onClick={addSlide}
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