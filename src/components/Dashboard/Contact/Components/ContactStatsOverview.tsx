
// components/admin/components/ContactStatsOverview.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, MessageSquare, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ContactSubmission {
  id: string
  firstName: string
  lastName: string
  email: string
  message: string
  isRead: boolean
  isReplied: boolean
  createdAt: Date
  updatedAt: Date
}

interface ContactStats {
  total: number
  unread: number
  replied: number
  recent: ContactSubmission[]
}

interface ContactStatsOverviewProps {
  submissions: ContactSubmission[]
  stats: ContactStats
}

export default function ContactStatsOverview({ submissions, stats }: ContactStatsOverviewProps) {
  const todaySubmissions = submissions.filter(
    s => new Date(s.createdAt).toDateString() === new Date().toDateString()
  ).length

  const thisWeekSubmissions = submissions.filter(
    s => {
      const submissionDate = new Date(s.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return submissionDate >= weekAgo
    }
  ).length

  const responseRate = stats.total > 0 ? Math.round((stats.replied / stats.total) * 100) : 0

  const statCards = [
    {
      title: 'Total Messages',
      value: stats.total,
      icon: MessageSquare,
      description: 'All time submissions',
      color: 'text-blue-600'
    },
    {
      title: 'Unread',
      value: stats.unread,
      icon: AlertCircle,
      description: 'Need attention',
      color: 'text-red-600'
    },
    {
      title: 'Replied',
      value: stats.replied,
      icon: CheckCircle,
      description: `${responseRate}% response rate`,
      color: 'text-green-600'
    },
    {
      title: 'This Week',
      value: thisWeekSubmissions,
      icon: TrendingUp,
      description: `${todaySubmissions} today`,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Submissions & Contact Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent.map((submission) => (
                <div key={submission.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {submission.firstName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {submission.firstName} {submission.lastName}
                      </p>
                      <div className="flex space-x-1">
                        {!submission.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                        {submission.isReplied && (
                          <Badge variant="secondary" className="text-xs">
                            Replied
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {submission.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                      {submission.message.substring(0, 60)}...
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recent.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No submissions yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Rate</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${responseRate}%` }}
                    ></div>
                  </div>
                  <Badge variant="secondary">{responseRate}%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">This Week</span>
                <Badge variant="outline">{thisWeekSubmissions} submissions</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Today</span>
                <Badge variant="outline">{todaySubmissions} submissions</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Replies</span>
                <Badge variant={stats.total - stats.replied > 0 ? "destructive" : "secondary"}>
                  {stats.total - stats.replied}
                </Badge>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Contact Channels</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Form: {stats.total} submissions
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Email Replies: {stats.replied} sent
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}