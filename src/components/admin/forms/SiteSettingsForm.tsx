
// components/admin/forms/SiteSettingsForm.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, FormControl, TextField, Typography } from '@mui/material'
import { SiteSettings } from '@prisma/client'

interface SiteSettingsFormProps {
  settingsData: SiteSettings[]
}

export default function SiteSettingsForm({ settingsData }: SiteSettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)


  const [formData, setFormData] = useState({
    siteName: settingsData.find((setting) => setting.key === 'siteName')?.value || '',
    siteDescription: settingsData.find((setting) => setting.key === 'siteDescription')?.value || '',
    siteUrl: settingsData.find((setting) => setting.key === 'siteUrl')?.value || '',
    // siteLogo: initialData.siteLogo || '',
    // favicon: initialData.favicon || '',
    contactEmail: settingsData.find((setting) => setting.key === 'contactEmail')?.value || '',
    contactPhone: settingsData.find((setting) => setting.key === 'contactPhone')?.value || '',

    socialFacebook: settingsData.find((setting) => setting.key === 'socialFacebook')?.value || '',
    socialTwitter: settingsData.find((setting) => setting.key === 'socialTwitter')?.value || '',
    socialInstagram: settingsData.find((setting) => setting.key === 'socialInstagram')?.value || '',
    socialLinkedin: settingsData.find((setting) => setting.key === 'socialLinkedin')?.value || '',
    socialYoutube: settingsData.find((setting) => setting.key === 'socialYoutube')?.value || '',
    socialPinterest: settingsData.find((setting) => setting.key === 'socialPinterest')?.value || '',
    socialTiktok: settingsData.find((setting) => setting.key === 'socialTiktok')?.value || '',
    socialBehance: settingsData.find((setting) => setting.key === 'socialBehance')?.value || '',
    socialVimeo: settingsData.find((setting) => setting.key === 'socialVimeo')?.value || '',
    socialSpotify: settingsData.find((setting) => setting.key === 'socialSpotify')?.value || '',
    //googleAnalytics: initialData.googleAnalytics || '',
    // maintenanceMode: initialData.maintenanceMode === 'true',
    seoDefaultTitle: settingsData.find((setting) => setting.key === 'seoDefaultTitle')?.value || '',
    seoDefaultDescription: settingsData.find((setting) => setting.key === 'seoDefaultDescription')?.value || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // maintenanceMode: formData.maintenanceMode.toString()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      toast.success('Settings saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* General Settings */}
      <Card>
      <Typography variant="h6" gutterBottom sx={{ p: 2, fontWeight: 'bold' }}>
        General Information
      </Typography>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl>
              <TextField
                id="siteName"
                label="Site Name"
                value={formData.siteName}
                onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                placeholder="Your Site Name"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="siteUrl"
                label="Site URL"
                value={formData.siteUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, siteUrl: e.target.value }))}
                placeholder="https://yoursite.com"
              />
            </FormControl>
          </div>

          <FormControl fullWidth>
            <TextField
              id="siteDescription"
              label="Site Description"
              value={formData.siteDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
              multiline
              rows={3}
              placeholder="Describe your website..."
            />
          </FormControl>
        </CardContent>
      </Card>

      {/* Contact Information */}
      
      <Card>
      <Typography variant="h6" gutterBottom sx={{ p: 2, fontWeight: 'bold' }}>
        Contact Information
      </Typography>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl>
              <TextField
                id="contactEmail"
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="contact@yoursite.com"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="contactPhone"
                label="Contact Phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </FormControl>
          </div>
        </CardContent>
      </Card>

   
      {/* Social Media */}
      <Card>
        
        <Typography variant="h6" gutterBottom sx={{ p: 2, fontWeight: 'bold' }}>
        Social Media Links
      </Typography>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl>
              <TextField
                id="socialFacebook"
                label="Facebook URL"
                value={formData.socialFacebook}
                onChange={(e) => setFormData(prev => ({ ...prev, socialFacebook: e.target.value }))}
                placeholder="https://facebook.com/yourpage"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="socialTwitter"
                label="Twitter URL"
                value={formData.socialTwitter}
                onChange={(e) => setFormData(prev => ({ ...prev, socialTwitter: e.target.value }))}
                placeholder="https://twitter.com/youraccount"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="socialInstagram"
                label="Instagram URL"
                value={formData.socialInstagram}
                onChange={(e) => setFormData(prev => ({ ...prev, socialInstagram: e.target.value }))}
                placeholder="https://instagram.com/youraccount"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="socialLinkedin"
                label="LinkedIn URL"
                value={formData.socialLinkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, socialLinkedin: e.target.value }))}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="socialYoutube"
                label="Youtube URL"
                value={formData.socialYoutube}
                onChange={(e) => setFormData(prev => ({ ...prev, socialYoutube: e.target.value }))}
                placeholder="https://youtube.com/yourchannel"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="socialPinterest"
                label="Pinterest URL"
                value={formData.socialPinterest}
                onChange={(e) => setFormData(prev => ({ ...prev, socialPinterest: e.target.value }))}
                placeholder="https://pinterest.com/yourboard"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="socialTiktok"
                label="Tiktok URL"
                value={formData.socialTiktok}
                onChange={(e) => setFormData(prev => ({ ...prev, socialTiktok: e.target.value }))}
                placeholder="https://tiktok.com/youraccount"
              />  
            </FormControl>
            <FormControl>
              <TextField
                id="socialSpotify"
                label="Spotify URL"
                value={formData.socialSpotify}
                onChange={(e) => setFormData(prev => ({ ...prev, socialSpotify: e.target.value }))}
                placeholder="https://spotify.com/youraccount"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="socialBehance"
                label="Behance URL"
                value={formData.socialBehance}
                onChange={(e) => setFormData(prev => ({ ...prev, socialBehance: e.target.value }))}
                placeholder="https://behance.net/youraccount"
              />
            </FormControl>
            <FormControl>
              <TextField
                id="socialVimeo"
                label="Vimeo URL"
                value={formData.socialVimeo}
                onChange={(e) => setFormData(prev => ({ ...prev, socialVimeo: e.target.value }))}
                placeholder="https://vimeo.com/youraccount"
              />
            </FormControl>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <Typography variant="h6" gutterBottom sx={{ p: 2, fontWeight: 'bold' }}>SEO Settings</Typography>

        <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
          <FormControl>
            <TextField
              id="seoDefaultTitle"
              label="Default SEO Title"
              value={formData.seoDefaultTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, seoDefaultTitle: e.target.value }))}
              placeholder="Your Site Name | Professional Services"
            />
          </FormControl>
          <FormControl>
            <TextField
              id="seoDefaultDescription"
              label="Default SEO Description"
              value={formData.seoDefaultDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, seoDefaultDescription: e.target.value }))}
              multiline
              rows={3}
              placeholder="Default description for your website..."
            />
          </FormControl>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
            <Input
              id="googleAnalytics"
              value={formData.googleAnalytics}
              onChange={(e) => setFormData(prev => ({ ...prev, googleAnalytics: e.target.value }))}
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="maintenanceMode"
              checked={formData.maintenanceMode}
              onCheckedChange={(maintenanceMode) => setFormData(prev => ({ ...prev, maintenanceMode }))}
            />
            <Label htmlFor="maintenanceMode">
              Maintenance Mode
              <span className="block text-sm text-gray-500">
                When enabled, visitors will see a maintenance page
              </span>
            </Label>
          </div>
        </CardContent>
      </Card> */}

      <div className="flex justify-end">
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </form>
  )
}
