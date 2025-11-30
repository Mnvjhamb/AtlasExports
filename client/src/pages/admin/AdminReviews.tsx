import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Pencil, Trash2, Star, MessageSquare } from "lucide-react";

// todo: remove mock functionality - replace with API data
const initialReviews = [
  { id: "1", name: "Ahmed Al-Rashid", company: "AgriTech UAE", rating: 5, comment: "Outstanding quality equipment and exceptional service. The Atlas Exports has been our trusted partner for 3 years now.", status: "approved", date: "2024-01-15" },
  { id: "2", name: "Sarah Thompson", company: "Global Harvest UK", rating: 5, comment: "The basmati rice quality is consistently excellent. They understand our requirements perfectly.", status: "approved", date: "2024-01-10" },
  { id: "3", name: "Michael Chen", company: "Pacific Agri SG", rating: 4, comment: "Great range of agricultural equipment at competitive prices. Responsive team.", status: "approved", date: "2024-01-05" },
  { id: "4", name: "Emma Wilson", company: "Farm Supplies AU", rating: 5, comment: "Excellent quality products and prompt delivery. Highly recommend!", status: "pending", date: "2024-01-20" },
  { id: "5", name: "Ali Hassan", company: "Gulf Trading", rating: 4, comment: "Good products, would appreciate faster shipping options.", status: "pending", date: "2024-01-19" },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingReview, setEditingReview] = useState<typeof initialReviews[0] | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const { toast } = useToast();

  const filteredReviews = reviews.filter((r) =>
    filterStatus === "all" ? true : r.status === filterStatus
  );

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    toast({ title: "Review approved" });
  };

  const handleReject = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Review rejected and removed" });
  };

  const handleEdit = (review: typeof initialReviews[0]) => {
    setEditingReview(review);
    setEditedComment(review.comment);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingReview) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? { ...r, comment: editedComment, status: "approved" }
            : r
        )
      );
      toast({ title: "Review updated and approved" });
    }
    setShowEditDialog(false);
  };

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer reviews and testimonials
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingCount} pending
              </Badge>
            )}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>All Reviews</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]" data-testid="select-review-filter">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReviews.length > 0 ? (
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
                  <TableRow key={review.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.company}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="truncate">{review.comment}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={review.status === "approved" ? "default" : "secondary"}
                      >
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {review.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {review.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(review.id)}
                              data-testid={`button-approve-${review.id}`}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(review.id)}
                              data-testid={`button-reject-${review.id}`}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(review)}
                          data-testid={`button-edit-review-${review.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReject(review.id)}
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editingReview && (
              <>
                <div>
                  <div className="font-medium">{editingReview.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {editingReview.company}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Comment</Label>
                  <Textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="min-h-[100px]"
                    data-testid="input-edit-comment"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} data-testid="button-save-review">
              Save & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
