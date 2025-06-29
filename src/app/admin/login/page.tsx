// app/admin/login/page.tsx (Test version)
'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@test.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { status } = useSession()

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      console.log('User already authenticated, redirecting to dashboard')
      router.push('/admin/dashboard')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    console.log('=== LOGIN ATTEMPT ===')
    console.log('Email:', email)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('=== SIGNIN RESULT ===', result)

      if (result?.error) {
        setError('Invalid email or password')
        console.error('Login error:', result.error)
      } else if (result?.ok) {
        console.log('Login successful!')
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('=== LOGIN EXCEPTION ===', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div>Checking authentication...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div>Already logged in. Redirecting...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-lg">

          <div className="flex items-center justify-center space-x-2">
            <div className="w-36 h-36  flex items-center justify-center">
              <Image src="/images/logo/logo-black.png" alt="Logo" width={180} height={180} />
            </div>
          </div>

                
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Red Zone Admin
          </CardTitle>
          <p className="text-center text-gray-600">
            Sign in to your admin account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="text-center text-sm text-gray-600">
            Demo: admin@test.com / admin123
          </div>
        </CardContent>
      </Card>
    </div>
  )
}