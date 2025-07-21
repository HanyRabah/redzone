"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUpload from "@/components/Dashboard/_Components/ImageUpload";
import { Loader2 } from "lucide-react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  SelectChangeEvent
} from "@mui/material";
import { User } from "@prisma/client";

// UserForm Component
interface UserFormProps {
    user: User | null;
    onClose: () => void;
  }
  
export default function UserForm({ user, onClose }: UserFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
  
    const [formData, setFormData] = useState({
      name: user?.name || "",
      image: user?.image || "",
      role: user?.role || "",
      email: user?.email || "",
      password: user?.password || "",
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
        const url = user ? `/api/admin/users/${user.id}` : "/api/admin/users";
  
        const method = user ? "PUT" : "POST";
  
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to save user");
        }
  
        toast.success(`User ${user ? "updated" : "created"} successfully`);
        router.refresh();
        onClose();
      } catch (error) {
        console.error("Error saving user:", error);
        toast.error("Failed to save user");
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleRoleChange = (e: SelectChangeEvent) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, role: value }));
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormControl fullWidth className="mb-20">
          <TextField
            id="name"
            label="User Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            sx={{ mb: 2 }}
          />
        </FormControl>
  
        <ImageUpload
          label="User image *"
          value={formData.image}
          onChange={(logo) => setFormData((prev) => ({ ...prev, logo }))}
        />
  
        <FormControl fullWidth>
          <InputLabel id="simple-select-label">Role</InputLabel>
          <Select
            labelId="simple-select-label"
            id="role"
            value={formData.role}
            onChange={handleRoleChange}
            label="Role"
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
  
        <FormControl fullWidth>
          <TextField
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="user@example.com"
            required
            sx={{ mb: 2 }}
          />
        </FormControl>
  
        <FormControl fullWidth>
          <TextField
            id="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="password"
            required
            sx={{ mb: 2 }}
          />
        </FormControl>
  
        <div className="flex justify-end mt-4 gap-2">
          <Button type="button" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : user?.id ? (
              "Update User"
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </form>
    );
  }
  