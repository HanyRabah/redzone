import { Grid } from "@mui/material";
import { Paper } from "@mui/material";
import { Typography } from "@mui/material";
import { alpha } from "@mui/material";
import { Box } from "@mui/material";
import { BlogTag } from "@prisma/client";
import {
  LocalOffer as TagIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";

export default function BlogTagsStats({ tags }: { tags: BlogTag[] }) {
  const multiUseTags = tags.filter((tag) => tag.postCount > 1).length;
  const singleUseTags = tags.filter((tag) => tag.postCount === 1).length;

  const stats = [
    {
      title: "Total Tags",
      value: tags.length,
      icon: TagIcon,
      color: "#1976d2",
    },
    {
      title: "Multi-use Tags",
      value: multiUseTags,
      icon: TrendingUpIcon,
      color: "#2e7d32",
    },
    {
      title: "Single-use Tags",
      value: singleUseTags,
      icon: BarChartIcon,
      color: "#ed6c02",
    },
  ];
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Grid key={index} sx={{ xs: 12, sm: 4 }}>
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
