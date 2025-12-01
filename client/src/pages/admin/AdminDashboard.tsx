import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  MessageSquare,
  Star,
  FolderOpen,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  useDashboardStats,
  useRecentContacts,
  useRecentReviews,
  formatRelativeTime,
  getSubjectLabel,
} from '@/hooks/useDashboard';

function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  subtitleVariant = 'default',
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
  subtitleVariant?: 'default' | 'warning' | 'success';
  isLoading?: boolean;
}) {
  const subtitleColor = {
    default: 'text-muted-foreground',
    warning: 'text-orange-500',
    success: 'text-green-500',
  }[subtitleVariant];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-sm text-muted-foreground">{title}</div>
            {subtitle && (
              <div className={`text-xs mt-2 ${subtitleColor}`}>{subtitle}</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentContacts, isLoading: contactsLoading } =
    useRecentContacts(5);
  const { data: recentReviews, isLoading: reviewsLoading } =
    useRecentReviews(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats?.products.total || 0}
          icon={Package}
          subtitle={
            stats?.products.featured
              ? `${stats.products.featured} featured`
              : undefined
          }
          subtitleVariant="success"
          isLoading={statsLoading}
        />
        <StatCard
          title="Categories"
          value={stats?.categories.total || 0}
          icon={FolderOpen}
          subtitle={
            stats?.categories.active
              ? `${stats.categories.active} active`
              : undefined
          }
          isLoading={statsLoading}
        />
        <StatCard
          title="Contact Submissions"
          value={stats?.contacts.total || 0}
          icon={MessageSquare}
          subtitle={
            stats?.contacts.unread
              ? `${stats.contacts.unread} unread`
              : 'All read'
          }
          subtitleVariant={stats?.contacts.unread ? 'warning' : 'success'}
          isLoading={statsLoading}
        />
        <StatCard
          title="Reviews"
          value={stats?.reviews.total || 0}
          icon={Star}
          subtitle={
            stats?.reviews.pending
              ? `${stats.reviews.pending} pending`
              : 'All reviewed'
          }
          subtitleVariant={stats?.reviews.pending ? 'warning' : 'success'}
          isLoading={statsLoading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Clients Showcased"
          value={stats?.clients.active || 0}
          icon={Users}
          subtitle={
            stats?.clients.total
              ? `${stats.clients.total} total`
              : undefined
          }
          isLoading={statsLoading}
        />
        <StatCard
          title="Approved Reviews"
          value={stats?.reviews.approved || 0}
          icon={Star}
          subtitle={
            stats?.reviews.averageRating
              ? `${stats.reviews.averageRating.toFixed(1)} avg rating`
              : undefined
          }
          subtitleVariant="success"
          isLoading={statsLoading}
        />
        <StatCard
          title="Active Products"
          value={stats?.products.active || 0}
          icon={Package}
          subtitle={
            stats?.products.total !== stats?.products.active
              ? `${(stats?.products.total || 0) - (stats?.products.active || 0)} inactive`
              : 'All active'
          }
          isLoading={statsLoading}
        />
        <StatCard
          title="Contacts Replied"
          value={stats?.contacts.replied || 0}
          icon={MessageSquare}
          subtitle={
            stats?.contacts.total
              ? `${Math.round(((stats.contacts.replied || 0) / stats.contacts.total) * 100)}% response rate`
              : undefined
          }
          subtitleVariant="success"
          isLoading={statsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contact Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Recent Submissions</CardTitle>
            {stats?.contacts.unread ? (
              <Badge variant="default">{stats.contacts.unread} unread</Badge>
            ) : (
              <Badge variant="outline">All read</Badge>
            )}
          </CardHeader>
          <CardContent>
            {contactsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentContacts && recentContacts.length > 0 ? (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        contact.isRead ? 'bg-muted' : 'bg-primary'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={
                            contact.isRead ? 'font-medium' : 'font-semibold'
                          }
                        >
                          {contact.name}
                        </span>
                        {contact.company && (
                          <span className="text-xs text-muted-foreground">
                            {contact.company}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getSubjectLabel(contact.subject)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(contact.createdAt)}
                    </div>
                  </div>
                ))}
                <Link to="/admin/contacts">
                  <Button variant="outline" className="w-full mt-2">
                    View All Contacts
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No contact submissions yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Recent Reviews</CardTitle>
            {stats?.reviews.pending ? (
              <Badge variant="secondary">{stats.reviews.pending} pending</Badge>
            ) : (
              <Badge variant="outline">All reviewed</Badge>
            )}
          </CardHeader>
          <CardContent>
            {reviewsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentReviews && recentReviews.length > 0 ? (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium">{review.clientName}</span>
                        <Badge
                          variant={
                            review.status === 'approved'
                              ? 'default'
                              : review.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                          }
                          className="text-xs"
                        >
                          {review.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        {review.company && (
                          <span className="text-xs text-muted-foreground">
                            {review.company}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(review.createdAt)}
                    </div>
                  </div>
                ))}
                <Link to="/admin/reviews">
                  <Button variant="outline" className="w-full mt-2">
                    View All Reviews
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/admin/products">
              <Button variant="outline" className="w-full h-auto py-4 flex-col">
                <Package className="h-6 w-6 mb-2" />
                <span>Add Product</span>
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="outline" className="w-full h-auto py-4 flex-col">
                <FolderOpen className="h-6 w-6 mb-2" />
                <span>Add Category</span>
              </Button>
            </Link>
            <Link to="/admin/clients">
              <Button variant="outline" className="w-full h-auto py-4 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>Add Client</span>
              </Button>
            </Link>
            <Link to="/admin/content">
              <Button variant="outline" className="w-full h-auto py-4 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Edit Content</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Alerts/Notifications */}
      {(stats?.contacts.unread || stats?.reviews.pending) && (
        <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-700 dark:text-orange-400">
                  Items need attention
                </h4>
                <ul className="text-sm text-orange-600 dark:text-orange-400/80 mt-1 space-y-1">
                  {stats?.contacts.unread > 0 && (
                    <li>
                      • {stats.contacts.unread} unread contact submission
                      {stats.contacts.unread > 1 ? 's' : ''}
                    </li>
                  )}
                  {stats?.reviews.pending > 0 && (
                    <li>
                      • {stats.reviews.pending} review
                      {stats.reviews.pending > 1 ? 's' : ''} pending approval
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
