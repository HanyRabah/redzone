import { BlogCategory } from "@prisma/client";
import { alpha } from "@mui/material";
import { BarChart as BarChartIcon } from "@mui/icons-material";
import {
  Box,
  Chip,
  Typography,
  Paper,
  Stack,
  Avatar,
  LinearProgress,
} from "@mui/material";
export default function BlogStatistics({
  categories,
}: {
  categories: BlogCategory[];
}) {
  const totalPosts = categories.reduce((sum, cat) => sum + cat.postCount, 0);

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
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
          <BarChartIcon />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Category Statistics
        </Typography>
      </Box>

      <Stack spacing={3}>
        {categories
          .sort((a, b) => b.postCount - a.postCount)
          .map((category, index) => {
            const categoryColor = getCategoryColor(index);
            const percentage = (category.postCount / totalPosts) * 100;

            return (
              <Box key={category.id}>
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
                  value={Math.max(2, percentage)}
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
