import { Box, Typography, Grid, Paper, alpha } from "@mui/material";
import {
  Star as StarIcon,
  Work as WorkIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

export default function PortfolioStats({ projects }) {
  const featuredProjects = projects.filter((project) => project.isFeatured);
  const activeProjects = projects.filter((project) => project.isActive);

  return (
    <Grid container spacing={3} sx={{ mb: 4, p: 3 }}>
      {[
        {
          title: "Total Projects",
          value: projects.length,
          icon: WorkIcon,
          color: "#1976d2",
        },
        {
          title: "Featured Projects",
          value: featuredProjects.length,
          icon: StarIcon,
          color: "#ed6c02",
        },
        {
          title: "Active Projects",
          value: activeProjects.length,
          icon: VisibilityIcon,
          color: "#2e7d32",
        },
      ].map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Grid key={index} size={{ xs: 12, sm: 4 }}>
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
  );
}
