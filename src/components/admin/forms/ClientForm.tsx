"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2 } from "lucide-react";
import {
  Button,
  FormControl,
  TextField,
  Switch,
  Typography
} from "@mui/material";
import { Client } from "@prisma/client";

// ClientForm Component
interface ClientFormProps {
  client: Client | null
  onClose: () => void
}

export default function ClientForm({ client, onClose }: ClientFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: client?.name || '',
    logo: client?.logo || '',
    website: client?.website || '',
    isActive: client?.isActive ?? true,
    sortOrder: client?.sortOrder || 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = client 
        ? `/api/admin/clients/${client.id}`
        : '/api/admin/clients'
      
      const method = client ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save client')
      }

      toast.success(`Client ${client ? 'updated' : 'created'} successfully`)
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error saving client:', error)
      toast.error('Failed to save client')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormControl fullWidth>
        <TextField
          id="name"
          label="Client Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Client Company Name"
          required
          sx={{ mb: 2 }}
        />
      </FormControl>

      <ImageUpload
        label="Client Logo *"
        value={formData.logo}
        onChange={(logo) => setFormData(prev => ({ ...prev, logo }))}
      />

      <FormControl fullWidth>
        <TextField
          id="website"
          label="Website (optional)"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          placeholder="https://client-website.com"
          sx={{ mb: 2 }}
        />
      </FormControl>

      <FormControl fullWidth>
        <TextField
          id="sortOrder"
          label="Display Order"
          type="number"
          value={formData.sortOrder}
          onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
          placeholder="0"
          sx={{ mb: 2 }}
        />
      </FormControl>

      <FormControl className="flex items-center space-x-2">
        <Typography variant="body2" sx={{ fontWeight: "normal", fontSize: "14px" }} className="lowercase">Active (show on website)</Typography>
        <Switch
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
        />
      </FormControl>

      <div className="flex justify-end space-x-2 gap-2">
        <Button type="button" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} variant="contained">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            client ? 'Update Client' : 'Create Client'
          )}
        </Button>
      </div>
    </form>
  )
}
