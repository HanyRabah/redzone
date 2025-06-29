// components/admin/managers/ClientsManager.tsx
"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Drawer,
  Typography,
} from "@mui/material";
import { UsersTable } from "../tables/UsersTable";
import UserForm from "../forms/UsersForm";
import { User } from "@prisma/client";

interface UsersManagerProps {
  users: User[];
}

export default function UsersManager({ users }: UsersManagerProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // const handleToggleActive = async (userId: string, role: string) => {
  //   try {
  //     const response = await fetch(`/api/admin/users/${userId}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ role: !role }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update user");
  //     }

  //     toast.success(role ? "User Role Updated" : "User Role not Updated");
  //     router.refresh();
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     toast.error("Failed to update user");
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div></div>

        <Fragment key={"right"}>
          <Button onClick={openCreateDialog} variant="contained">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>

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
                {editingUser ? "Edit User" : "Add New User"}
              </Typography>
              <UserForm
                user={editingUser}
                onClose={() => setIsDialogOpen(false)}
              />
            </Box>
          </Drawer>
        </Fragment>
      </div>

      <UsersTable
        data={users}
        editUser={openEditDialog}
        deleteUser={handleDelete}
      />

      {users.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              No users added yet
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First User
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
