// components/admin/DynamicTextArray.tsx
'use client'

import { X, Plus } from 'lucide-react'
import { Button, TextField, Typography } from '@mui/material'

interface DynamicTextArrayProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxItems?: number
}

export default function DynamicTextArray({
  label,
  value,
  onChange,
  placeholder = "Enter text...",
  maxItems = 10
}: DynamicTextArrayProps) {
  const addItem = () => {
    if (value.length < maxItems) {
      onChange([...value, ''])
    }
  }

  const removeItem = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const updateItem = (index: number, newText: string) => {
    const newValue = value.map((item, i) => i === index ? newText : item)
    onChange(newValue)
  }

  return (
    <div className="mt-4">
      <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px", mb: 2 }}>
        {label}
      </Typography>
      <div className="space-y-4">
        {value.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <TextField
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`${placeholder} ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="text"
              size="small"
              onClick={() => removeItem(index)}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {value.length < maxItems && (
          <Button
            type="button"
            variant="outlined"
            onClick={addItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {label.toLowerCase()}
          </Button>
        )}
      </div>
    </div>
  )
}