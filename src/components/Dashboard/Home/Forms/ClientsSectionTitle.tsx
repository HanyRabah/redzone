"use client";

import { useState } from "react";
import { Box, FormControl, Button, TextField } from "@mui/material";
import { Sections } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ClientsSectionTitleForm({ sections }: { sections: Sections[] }) {
  const router = useRouter();
  const section = sections.find((section) => section.section === "clients");
  const [title, setTitle] = useState(section?.title || "");
  //const [description, setDescription] = useState(section?.description || "");

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // update sections
    try {
      await fetch(`/api/admin/sections/${section?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          //description,
        }),
    });

    toast.success("Clients Section Title updated");
    router.refresh();
    
  } catch (error) {
    console.error("Error updating sections:", error);
    toast.error("Failed to update sections");
  }
}


  return (
    <Box
      component="form"
      sx={{ spacing: 3, display: "flex", flexDirection: "column", gap: 2 }}
      onSubmit={handleSubmit}
    >
      <FormControl>
        <TextField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Clients Section Title"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#ed6c02",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ed6c02",
              },
            },
          }}
        />
      </FormControl>
      {/* <FormControl>
        <TextField
          placeholder="Clients Section Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#ed6c02",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ed6c02",
              },
            },
          }}
        />
      </FormControl> */}

      <Button variant="contained" type="submit">
        Update
      </Button>
    </Box>
  );
}