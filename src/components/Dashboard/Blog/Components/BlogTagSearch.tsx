"use client";
import {
  alpha,
  Avatar,
  Box,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Clear } from "@mui/icons-material";
import {
  LocalOffer as TagIcon,
  CloudQueue as CloudIcon,
} from "@mui/icons-material";
import { useState } from "react";

type TagColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

export default function BlogTagSearch({ tags }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maxCount = Math.max(...tags.map((t) => t.postCount), 1);

  const toggleTagSelection = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const selectAllTags = () => {
    if (selectedTags.length === filteredTags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(filteredTags.map((tag) => tag.name));
    }
  };

  const getTagSize = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "large";
    if (ratio > 0.4) return "medium";
    return "small";
  };

  const getTagColor = (index: number) => {
    const colors = [
      "primary",
      "secondary",
      "success",
      "warning",
      "error",
      "info",
    ];
    return colors[index % colors.length] as TagColor;
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      <Paper sx={{ borderRadius: 3, overflow: "hidden", mb: 4 }}>
        <Box
          sx={{
            p: 3,
            bgcolor: alpha("#1976d2", 0.05),
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <CloudIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tags Cloud
            </Typography>
          </Box>

          {filteredTags.length > 0 && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedTags.length === filteredTags.length}
                  indeterminate={
                    selectedTags.length > 0 &&
                    selectedTags.length < filteredTags.length
                  }
                  onChange={selectAllTags}
                />
              }
              label="Select All"
            />
          )}
        </Box>

        <CardContent sx={{ p: 4 }}>
          {filteredTags.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {filteredTags
                .sort((a, b) => b.postCount - a.postCount)
                .map((tag, index) => {
                  const isSelected = selectedTags.includes(tag.name);
                  const size = getTagSize(tag.postCount, maxCount);
                  const color = getTagColor(index);

                  return (
                    <Box
                      key={tag.name}
                      sx={{
                        position: "relative",
                        "&:hover .delete-btn": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Chip
                        label={`#${tag.name} (${tag.postCount})`}
                        variant={isSelected ? "filled" : "outlined"}
                        color={isSelected ? "primary" : color}
                        size={size === "large" ? "medium" : "small"}
                        onClick={() => toggleTagSelection(tag.name)}
                        sx={{
                          fontSize:
                            size === "large"
                              ? "1rem"
                              : size === "medium"
                                ? "0.875rem"
                                : "0.75rem",
                          height:
                            size === "large" ? 36 : size === "medium" ? 32 : 28,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          border: isSelected ? "2px solid" : "1px solid",
                          borderColor: isSelected ? "primary.main" : "divider",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: 2,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <TagIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? "No tags match your search" : "No tags found"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {!searchTerm && "Create your first tag to get started"}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Paper>
    </>
  );
}
