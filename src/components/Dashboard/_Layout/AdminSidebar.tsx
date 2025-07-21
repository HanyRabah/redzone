'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  User,
  Briefcase,
  FileText,
  Mail,
  Users,
  MessageSquare,
  Settings,
  BarChart3
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Home Page', href: '/admin/dashboard/home', icon: Home },
  { name: 'About Page', href: '/admin/dashboard/about', icon: User },
  { name: 'Portfolio Page', href: '/admin/dashboard/portfolio', icon: Briefcase },
  { name: 'Blog Page', href: '/admin/dashboard/blog', icon: FileText },
  { name: 'Contact Page', href: '/admin/dashboard/contact', icon: Mail },
  { name: 'Clients Section', href: '/admin/dashboard/clients', icon: Users },
  { name: 'Testimonials Section', href: '/admin/dashboard/testimonials', icon: MessageSquare },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col h-screen">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Red Zone Admin
          </h1>
        </div>
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive
                        ? 'text-red-500'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
