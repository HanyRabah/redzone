"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Testimonial } from "@prisma/client";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Drawer,
  Typography,
} from "@mui/material";
import React from "react";
import { TableList } from "@/components/Dashboard/_Components/tables/TestimonialsTable";
import TestimonialForm from "@/components/Dashboard/Testimonials/Forms/TestimonialForm";

interface TestimonialsPageProps {
  testimonials: Testimonial[];
}

export default function TestimonialsPage({
  testimonials,
}: TestimonialsPageProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTestimonial(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      toast.success("Testimonial deleted successfully");

      router.refresh();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  return (
    <Card sx={{ mx: "auto" }}>
      <CardHeader
        title={
          <Box sx={{ m: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Testimonials Section
            </Typography>

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Manage which testimonials appear on the home page.
            </Typography>
          </Box>
        }
      />

      {/* <TestimonialsStats testimonials={testimonials} />

      <Divider sx={{ my: 2 }} /> */}

      <div className="flex w-full px-6">
        <TableList<Testimonial>
          data={testimonials}
          editItem={openEditDialog}
          deleteItem={handleDelete}
        />
      </div>

      <div className="flex justify-end items-center p-6">
        <React.Fragment key={"right"}>
          <Button onClick={openCreateDialog} variant="contained">
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </React.Fragment>
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No testimonials found
          </p>
        </div>
      )}
      <Drawer
        anchor="right"
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <Box
          sx={{
            width: "40vw",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "20px",
          }}
        >
          <Typography variant="h6">
            {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </Typography>
          <TestimonialForm
            testimonial={editingTestimonial}
            onClose={() => setIsDialogOpen(false)}
          />
        </Box>
      </Drawer>
    </Card>
  );
}
