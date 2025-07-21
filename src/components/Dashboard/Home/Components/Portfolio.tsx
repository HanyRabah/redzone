"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  alpha,
  CardHeader,
  CardMedia,
  Stack,
  CardActions,
} from "@mui/material";
import {
  Work as WorkIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import {
  ExternalLinkIcon,
  BriefcaseBusiness as PortfolioIcon,
} from "lucide-react";
import { Project, ProjectCategory } from "@prisma/client";
import PortfolioSectionTitleForm from "../Forms/PortfolioSectionTitle";
import { Sections } from "@prisma/client";

interface PortfolioProps {
  projects: Project[];
  categories: ProjectCategory[];
  sections: Sections[];
}

export default function Portfolio({ projects, categories, sections }: PortfolioProps) {
  const featuredProjects = projects
    .filter((project) => project.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
    <Card sx={{ mx: "auto", mb: 4 }}>
        <CardHeader
          title={
            <Box sx={{ m: 1 }}>
                 <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Portfolio Section Title
                </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
               Portfolio Section Title and description edits
              </Typography>
            </Box>
          }
        />

        <CardContent>
         <PortfolioSectionTitleForm sections={sections} />
        </CardContent>
      </Card>

      <Card sx={{ mx: "auto" }}>
        <CardHeader
          title={
            <Box sx={{ m: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Portfolio
                </Typography>
                {featuredProjects.length > 0 && (
                  <Button
                    variant="contained"
                    href="/admin/dashboard/portfolio?tab=1"
                    sx={{ borderRadius: 2, ml: 2 }}
                  >
                    Edit in Portfolio Manager
                  </Button>
                )}
              </Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Manage which projects appear on the home page. Featured projects
                are showcased to visitors.
              </Typography>
            </Box>
          }
        />

        <CardContent>
          {/* Projects Grid */}
          {featuredProjects.length === 0 ? (
            <Paper sx={{ borderRadius: 3, p: 3 }}>
              <Box sx={{ p: 6, textAlign: "center" }}>
                <WorkIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No featured projects found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Start by featuring some projects to showcase on your home page
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PortfolioIcon />}
                  href="/admin/dashboard/portfolio?tab=1"
                  sx={{ borderRadius: 2 }}
                >
                  Go to Portfolio Manager
                </Button>
              </Box>
            </Paper>
          ) : (
            <Grid container spacing={3} sx={{ mb: 4, p: 3 }}>
              <Grid container spacing={3}>
                {featuredProjects.map((project) => (
                  <Grid key={project.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 6,
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      {/* Project Image */}
                      <Box sx={{ position: "relative", height: 200 }}>
                        <CardMedia
                          component="div"
                          sx={{
                            height: "100%",
                            backgroundImage: `url(${project.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "relative",
                          }}
                        />

                        {/* Status Badges */}
                        <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                          <Stack spacing={1}>
                            {!project.isActive && (
                              <Chip
                                label="Inactive"
                                size="small"
                                icon={<VisibilityOffIcon />}
                                sx={{
                                  bgcolor: alpha("#d32f2f", 0.9),
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              />
                            )}
                            <Chip
                              label={
                                categories.find(
                                  (cat) => cat.id === project.categoryId
                                )?.name
                              }
                              size="small"
                              sx={{
                                bgcolor: alpha("#1976d2", 0.9),
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                          </Stack>
                        </Box>

                        {/* Sort Order Badge */}
                        <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                          <Chip
                            label={`#${project.sortOrder}`}
                            size="small"
                            sx={{
                              bgcolor: alpha("#000", 0.7),
                              color: "white",
                              fontWeight: 600,
                              minWidth: 40,
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Project Content */}
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {project.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {project.description}
                        </Typography>
                      </CardContent>

                      {/* Actions */}
                      <CardActions
                        sx={{ p: 2, pt: 0, justifyContent: "space-between" }}
                      >
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {project.link && (
                            <Tooltip title="View Project">
                              <IconButton
                                size="small"
                                component="a"
                                href={"/portfolio/" + project.slug}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: "success.main" }}
                              >
                                <ExternalLinkIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                          {project.createdAt.toLocaleDateString()}
                        </Typography>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </>
  );
}
