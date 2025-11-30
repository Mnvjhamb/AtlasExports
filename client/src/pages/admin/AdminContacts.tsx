import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  MailOpen,
  Trash2,
  Eye,
  MessageSquare,
  Download,
  Reply,
  Check,
  Loader2,
  Inbox,
  CheckCircle,
} from 'lucide-react';
import {
  useContacts,
  useMarkContactRead,
  useMarkContactReplied,
  useDeleteContact,
  exportContactsToCSV,
  getSubjectLabel,
} from '@/hooks/useContacts';
import type { ContactSubmission } from '@/lib/firestore';

export default function AdminContacts() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState<
    (ContactSubmission & { id: string }) | null
  >(null);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [replyNote, setReplyNote] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch contacts
  const { data: contacts, isLoading, error } = useContacts();

  // Mutations
  const markRead = useMarkContactRead();
  const markReplied = useMarkContactReplied();
  const deleteContact = useDeleteContact();

  // Filter contacts
  const filteredContacts = contacts?.filter((c) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'unread') return !c.isRead;
    if (filterStatus === 'read') return c.isRead && !c.repliedAt;
    if (filterStatus === 'replied') return !!c.repliedAt;
    return true;
  });

  // Stats
  const unreadCount = contacts?.filter((c) => !c.isRead).length || 0;
  const repliedCount = contacts?.filter((c) => c.repliedAt).length || 0;

  const handleView = async (contact: ContactSubmission & { id: string }) => {
    setSelectedContact(contact);
    // Mark as read when viewing
    if (!contact.isRead) {
      try {
        await markRead.mutateAsync({ id: contact.id, isRead: true });
      } catch (error) {
        console.error('Error marking contact as read:', error);
      }
    }
  };

  const handleToggleRead = async (
    contact: ContactSubmission & { id: string }
  ) => {
    try {
      await markRead.mutateAsync({ id: contact.id, isRead: !contact.isRead });
      toast({ title: contact.isRead ? 'Marked as unread' : 'Marked as read' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleReply = (contact: ContactSubmission & { id: string }) => {
    setSelectedContact(contact);
    setReplyNote(contact.replyNote || '');
    setShowReplyDialog(true);
  };

  const handleSaveReply = async () => {
    if (!selectedContact) return;
    try {
      await markReplied.mutateAsync({
        id: selectedContact.id,
        replyNote: replyNote,
      });
      toast({ title: 'Marked as replied' });
      setShowReplyDialog(false);
      setSelectedContact(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save reply status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteContact.mutateAsync(deleteId);
      toast({ title: 'Contact deleted' });
      setDeleteId(null);
      if (selectedContact?.id === deleteId) {
        setSelectedContact(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    if (!contacts || contacts.length === 0) {
      toast({
        title: 'No data',
        description: 'No contacts to export',
        variant: 'destructive',
      });
      return;
    }
    exportContactsToCSV(contacts);
    toast({ title: 'Contacts exported to CSV' });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact Submissions</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-muted-foreground">
              View and manage contact form submissions
            </p>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} unread</Badge>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={!contacts || contacts.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{contacts?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MailOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">
                  {(contacts?.length || 0) - unreadCount - repliedCount}
                </p>
                <p className="text-sm text-muted-foreground">Read</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{repliedCount}</p>
                <p className="text-sm text-muted-foreground">Replied</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>All Submissions</CardTitle>
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger
                className="w-[150px]"
                data-testid="select-contact-filter"
              >
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-destructive/50 mb-4" />
              <p className="text-muted-foreground">Failed to load contacts</p>
            </div>
          ) : filteredContacts && filteredContacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className={!contact.isRead ? 'bg-primary/5' : ''}
                  >
                    <TableCell>
                      {contact.repliedAt ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : contact.isRead ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div
                          className={
                            !contact.isRead ? 'font-semibold' : 'font-medium'
                          }
                        >
                          {contact.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contact.company || contact.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={!contact.isRead ? 'font-medium' : ''}>
                        {getSubjectLabel(contact.subject)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {contact.repliedAt ? (
                        <Badge
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Replied
                        </Badge>
                      ) : contact.isRead ? (
                        <Badge variant="secondary">Read</Badge>
                      ) : (
                        <Badge variant="default">New</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(contact.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(contact)}
                          title="View"
                          data-testid={`button-view-${contact.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleRead(contact)}
                          title={contact.isRead ? 'Mark unread' : 'Mark read'}
                          data-testid={`button-toggle-${contact.id}`}
                        >
                          {contact.isRead ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <MailOpen className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReply(contact)}
                          title="Mark as replied"
                          data-testid={`button-reply-${contact.id}`}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(contact.id)}
                          title="Delete"
                          data-testid={`button-delete-${contact.id}`}
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
              <p className="text-muted-foreground">No submissions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Contact Dialog */}
      <Dialog
        open={!!selectedContact && !showReplyDialog}
        onOpenChange={() => setSelectedContact(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Submission</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{selectedContact.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Company</div>
                  <div className="font-medium">
                    {selectedContact.company || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">
                    {selectedContact.phone || '-'}
                  </div>
                </div>
                {selectedContact.country && (
                  <div>
                    <div className="text-sm text-muted-foreground">Country</div>
                    <div className="font-medium">{selectedContact.country}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">
                    {formatDate(selectedContact.createdAt)}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Subject
                </div>
                <div className="font-medium">
                  {getSubjectLabel(selectedContact.subject)}
                </div>
              </div>
              {selectedContact.productInterest && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Product Interest
                  </div>
                  <div className="font-medium">
                    {selectedContact.productInterest}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Message
                </div>
                <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>
              {selectedContact.repliedAt && (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Replied on {formatDate(selectedContact.repliedAt)}
                    </span>
                  </div>
                  {selectedContact.replyNote && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Note: {selectedContact.replyNote}
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-between gap-4 pt-2">
                <Button
                  variant="destructive"
                  onClick={() => setDeleteId(selectedContact.id)}
                  data-testid="button-delete-submission"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <div className="flex gap-2">
                  {!selectedContact.repliedAt && (
                    <Button
                      variant="outline"
                      onClick={() => handleReply(selectedContact)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark Replied
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedContact.email);
                      toast({ title: 'Email copied to clipboard' });
                    }}
                    data-testid="button-copy-email"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Copy Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={showReplyDialog}
        onOpenChange={setShowReplyDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Replied</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedContact && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">{selectedContact.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedContact.email}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Reply Note (optional)</Label>
              <Textarea
                value={replyNote}
                onChange={(e) => setReplyNote(e.target.value)}
                placeholder="Add a note about your reply..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This note is for your records only and won't be sent to the
                contact.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReplyDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveReply}
              disabled={markReplied.isPending}
            >
              {markReplied.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Mark as Replied
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact submission? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteContact.isPending ? (
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
