"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Paper,
  alpha,
  Chip,
  IconButton,
  Alert,
  AlertTitle,
  Switch,
  FormControlLabel,
  CardHeader,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import ClientForm from "./Forms/ClientForm";
import { Client, Sections } from "@prisma/client";
import ClientTable from "./Components/ClientsTable";
import ClientsSectionTitleForm from "../Home/Forms/ClientsSectionTitle";

interface ClientsPageProps {
  clients: Client[];
  sections?: Sections[];
}

export default function ClientsPage({ clients, sections }: ClientsPageProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingClient(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (clientId: string) => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      toast.success("Client deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };

  const activeClients = clients.filter((client) => client.isActive);
  const displayedClients = showOnlyActive ? activeClients : clients;

  return (
    <>
    {sections && sections.length > 0 && (
      <Card sx={{ mx: "auto", mb: 4 }}>
        <CardHeader
          title={
            <Box sx={{ m: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Clients Section Title
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Clients Section Title and description edits
              </Typography>
            </Box>
          }
        />

        <CardContent>
          <ClientsSectionTitleForm sections={sections} />
        </CardContent>
      </Card>
    )}
      <Card sx={{ mx: "auto" }}>
        <CardHeader
          title={
            <Box sx={{ m: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Clients Section
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showOnlyActive}
                      onChange={(e) => setShowOnlyActive(e.target.checked)}
                      color="success"
                    />
                  }
                  label="Show Only Active Clients"
                />
              </Box>

              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Manage which clients appear on the home page. Featured clients
                are showcased to visitors.
              </Typography>
            </Box>
          }
        />

        {/* Clients Stats */}
        {/* <ClientsStats clients={clients} />

      <Divider sx={{ my: 4 }} /> */}

        <CardContent>
          {/* Clients Display */}
          <Box sx={{ p: 3 }}>
            {displayedClients.length === 0 ? (
              <Paper sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 6, textAlign: "center" }}>
                  <PeopleIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {showOnlyActive
                      ? "No active clients found"
                      : "No clients added yet"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {showOnlyActive
                      ? "Start by activating some clients to showcase on your home page"
                      : "Add your first client to start building your portfolio"}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openCreateDialog}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Your First Client
                  </Button>
                </Box>
              </Paper>
            ) : (
              <ClientTable
                data={displayedClients}
                editItem={openEditDialog}
                deleteItem={handleDelete}
              />
            )}
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", my: 6, p: 3 }}
          >
            <Button
              variant="contained"
              onClick={openCreateDialog}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                mr: 1,
                minWidth: 180,
              }}
            >
              <AddIcon sx={{ mr: 1 }} />
              Add Client
            </Button>
          </Box>

          <Alert
            severity="info"
            sx={{
              mt: 4,
              borderRadius: 3,
              bgcolor: alpha("#2e7d32", 0.05),
              border: `1px solid ${alpha("#2e7d32", 0.2)}`,
            }}
          >
            <AlertTitle sx={{ fontWeight: 600 }}>
              Client Management Tips
            </AlertTitle>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Active clients will be displayed on your home page in the
              clients showcase section
              <br />
              • Client logo should be white color
              <br />
              • Client logo size should be 200x200 and in .png format
              <br />
              • Sort order determines the display sequence on your website
              <br />
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                size="small"
                onClick={() => openCreateDialog()}
                icon={<EditIcon />}
                label="Click edit to modify client details"
                variant="outlined"
              />
              <Chip
                size="small"
                onClick={() => setShowOnlyActive(!showOnlyActive)}
                icon={<VisibilityIcon />}
                label="Active clients appear on homepage"
                variant="outlined"
              />
            </Box>
          </Alert>
        </CardContent>
        {/* Add Client Drawer */}
        <Drawer
          anchor="right"
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          sx={{ width: { xs: "100%", sm: "500px", md: "600px" } }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {editingClient ? "Edit Client" : "Add New Client"}
              </Typography>
              <IconButton
                onClick={() => setIsDialogOpen(false)}
                sx={{ ml: "auto" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <ClientForm
              client={editingClient}
              onClose={() => setIsDialogOpen(false)}
            />
          </Box>
        </Drawer>
      </Card>
    </>
  );
}
