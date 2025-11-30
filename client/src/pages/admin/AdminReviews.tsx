import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Check,
  X,
  Pencil,
  Trash2,
  Star,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import {
  useAllReviews,
  useUpdateReview,
  useDeleteReview,
  calculateAverageRating,
  getReviewStatusColor,
} from '@/hooks/useReviews';
import type { Review } from '@/lib/firestore';

export default function AdminReviews() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingReview, setEditingReview] = useState<
    (Review & { id: string }) | null
  >(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedRating, setEditedRating] = useState(5);
  const [editedStatus, setEditedStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all reviews
  const { data: reviews, isLoading, error } = useAllReviews();

  // Mutations
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  // Filter reviews
  const filteredReviews = reviews?.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  // Stats
  const pendingCount = reviews?.filter((r) => r.status === 'pending').length || 0;
  const approvedCount = reviews?.filter((r) => r.status === 'approved').length || 0;
  const rejectedCount = reviews?.filter((r) => r.status === 'rejected').length || 0;
  const avgRating = reviews ? calculateAverageRating(reviews) : 0;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReview.mutateAsync(deleteId);
      toast({ title: 'Review deleted permanently' });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (review: Review & { id: string }) => {
    setEditingReview(review);
    setEditedContent(review.content || '');
    setEditedRating(review.rating || 5);
    setEditedStatus(review.status || 'pending');
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    try {
      await updateReview.mutateAsync({
        id: editingReview.id,
        data: {
          status: editedStatus,
          isApproved: editedStatus === 'approved',
        },
      });
      toast({ title: 'Review status updated' });
      setShowEditDialog(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isSaving = updateReview.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reviews</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-muted-foreground">
              Manage customer reviews and testimonials
            </p>
            {pendingCount > 0 && (
              <Badge variant="secondary">{pendingCount} pending</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{reviews?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>All Reviews</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger
                className="w-[150px]"
                data-testid="select-review-filter"
              >
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-destructive/50 mb-4" />
              <p className="text-muted-foreground">Failed to load reviews</p>
            </div>
          ) : filteredReviews && filteredReviews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="max-w-[300px]">Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow
                    key={review.id}
                    className={
                      review.status === 'rejected' ? 'opacity-60' : ''
                    }
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {review.clientName || 'Anonymous'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.company}
                          {review.country && `, ${review.country}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (review.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="truncate">{review.content}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getReviewStatusColor(review.status)}>
                        {review.status.charAt(0).toUpperCase() +
                          review.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit status */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(review)}
                          title="Change Status"
                          data-testid={`button-edit-review-${review.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(review.id)}
                          title="Delete permanently"
                          data-testid={`button-delete-review-${review.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No reviews found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Status Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Review Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingReview && (
              <>
                {/* Review Info (read-only) */}
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div>
                    <div className="font-medium">
                      {editingReview.clientName || 'Anonymous'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {editingReview.company}
                      {editingReview.country && `, ${editingReview.country}`}
                    </div>
                  </div>

                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < editedRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({editedRating} stars)
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground italic">
                    "{editedContent}"
                  </p>
                </div>

                {/* Status Selection */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editedStatus}
                    onValueChange={(value: 'pending' | 'approved' | 'rejected') =>
                      setEditedStatus(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="approved">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Approved
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          Rejected
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Only approved reviews are visible on the public Reviews page.
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              data-testid="button-save-review"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this review? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteReview.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
