// app/admin/page.tsx
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  Mail,
  Eye,
  TrendingUp,
  LucideIcon
} from 'lucide-react'

async function getDashboardStats() {
  const [
    totalProjects,
    totalBlogs,
    publishedBlogs,
    totalClients,
    totalTestimonials,
    totalContactSubmissions,
    unreadContacts,
    recentContactSubmissions
  ] = await Promise.all([
    prisma.project.count({ where: { isActive: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.client.count({ where: { isActive: true } }),
    prisma.testimonial.count({ where: { isActive: true } }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.contactSubmission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        message: true,
        isRead: true,
        createdAt: true
      }
    })
  ])

  return {
    totalProjects,
    totalBlogs,
    publishedBlogs,
    totalClients,
    totalTestimonials,
    totalContactSubmissions,
    unreadContacts,
    recentContactSubmissions
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Briefcase,
      description: 'Active portfolio items',
      color: 'text-blue-600'
    },
    {
      title: 'Blog Posts',
      value: `${stats.publishedBlogs}/${stats.totalBlogs}`,
      icon: FileText,
      description: 'Published/Total posts',
      color: 'text-green-600'
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: Users,
      description: 'Active client logos',
      color: 'text-purple-600'
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials,
      icon: MessageSquare,
      description: 'Customer reviews',
      color: 'text-orange-600'
    },
    {
      title: 'Contact Messages',
      value: stats.totalContactSubmissions,
      icon: Mail,
      description: `${stats.unreadContacts} unread`,
      color: 'text-red-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here&apos;s what&apos;s happening with your website.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contact Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Recent Contact Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentContactSubmissions.length > 0 ? (
                stats.recentContactSubmissions.map((contact) => (
                  <div key={contact.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {contact.firstName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {contact.firstName} {contact.lastName}
                        </p>
                        {!contact.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                        {contact.message.substring(0, 60)}...
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No contact messages yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton
                href="/admin/blog"
                icon={FileText}
                title="New Blog Post"
                description="Create content"
              />
              <QuickActionButton
                href="/admin/portfolio"
                icon={Briefcase}
                title="Add Project"
                description="Portfolio item"
              />
              <QuickActionButton
                href="/admin/clients"
                icon={Users}
                title="Add Client"
                description="Client logo"
              />
              <QuickActionButton
                href="/admin/contact"
                icon={Mail}
                title="View Messages"
                description={`${stats.unreadContacts} unread`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Database Connected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Email Service Active
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                File Storage Ready
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Quick Action Button Component
function QuickActionButton({
  href,
  icon: Icon,
  title,
  description
}: {
  href: string
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <a
      href={href}
      className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400 group-hover:text-red-500 transition-colors" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </a>
  )
}