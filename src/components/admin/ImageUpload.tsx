
// components/admin/ImageUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Typography } from '@mui/material'

interface ImageUploadProps {
  label: string
  value: string
  onChange: (value: string) => void
  accept?: string
  maxSize?: number // in MB
}

export default function ImageUpload({
  label,
  value,
  onChange,
  accept = "image/*",
  maxSize = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size should be less than ${maxSize}MB`)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      console.log("🚀 ~ handleFileSelect ~ response:", response)

      const data = await response.json()
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      setTimeout(() => {
        onChange(data.url)
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)

    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const removeImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const fallbackImage = 'https://placehold.co/600x400'

  return (
    <div className="">
      {/* <Label className="text-sm font-medium">{label}</Label> */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom mb={3}>{label}</Typography>
      
      {value ? (
        <div className="relative inline-block">
          <div className="relative w-56 h-56 border border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={value}
              onError={() => onChange(fallbackImage)}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG up to {maxSize}MB
          </p>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}