import {
  Box,
  Chip,
  Typography,
  Paper,
  LinearProgress,
  Stack,
  alpha,
} from "@mui/material";
import { ProjectCategory } from "@prisma/client";
import { Project } from "@prisma/client";

export default function PortfolioCategoriesStatistics({
  categories,
  projects,
}: {
  categories: ProjectCategory[];
  projects: Project[];
}) {

  const getCategoryColor = (index: number) => {
    const colors = [
      "#1976d2",
      "#2e7d32",
      "#ed6c02",
      "#9c27b0",
      "#d32f2f",
      "#0288d1",
      "#7b1fa2",
      "#5d4037",
    ];
    return colors[index % colors.length];
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Category Statistics
      </Typography>

      <Stack spacing={3}>
        {categories
          .sort((a, b) => b.postCount - a.postCount)
          .map((category, index) => {
            const categoryColor = getCategoryColor(index);
            const totalProjects =
              projects.filter((p) => p.categoryId === category.id).length || 0;
            const percentage = Math.round(
              (totalProjects / projects.length) * 100
            );

            return (
              <Box key={category.name}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: categoryColor,
                      }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {category.name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {percentage.toFixed(1)}%
                    </Typography>
                    <Chip
                      label={category.postCount}
                      size="small"
                      sx={{
                        bgcolor: alpha(categoryColor, 0.1),
                        color: categoryColor,
                        fontWeight: 600,
                        minWidth: 40,
                      }}
                    />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(2, percentage)} // Minimum 2% for visibility
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(categoryColor, 0.1),
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: categoryColor,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            );
          })}
      </Stack>
    </Paper>
  );
}
