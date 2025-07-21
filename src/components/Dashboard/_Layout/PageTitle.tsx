import { Box, Typography } from "@mui/material";

const PageTitle = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    return (
      <Box>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      </Box>
    );
  };
  
export default PageTitle