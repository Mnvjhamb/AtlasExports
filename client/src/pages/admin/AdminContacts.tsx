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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailOpen, Trash2, Eye, MessageSquare } from "lucide-react";

// todo: remove mock functionality - replace with API data
const initialSubmissions = [
  { id: "1", name: "John Smith", email: "john@agritechuk.com", company: "AgriTech UK", subject: "Quote Request", message: "I am interested in your hydraulic disc harrow. Please send me pricing for 10 units with shipping to London.", source: "public", read: false, date: "2024-01-20 14:30" },
  { id: "2", name: "Maria Garcia", email: "maria@farmprospain.com", company: "FarmPro Spain", subject: "Partnership", message: "We are looking for a reliable supplier of agricultural equipment for the Spanish market. Would love to discuss partnership opportunities.", source: "portal", read: false, date: "2024-01-20 11:15" },
  { id: "3", name: "Li Wei", email: "liwei@chinaimports.cn", company: "China Imports", subject: "Product Inquiry", message: "Can you provide information about your basmati rice export capabilities? We need 500 tons monthly.", source: "public", read: true, date: "2024-01-19 16:45" },
  { id: "4", name: "James Wilson", email: "james@ausagri.com.au", company: "Australian Agriculture", subject: "General Inquiry", message: "What certifications do your products have? We need HACCP certified products.", source: "public", read: true, date: "2024-01-18 09:20" },
  { id: "5", name: "Fatima Al-Hassan", email: "fatima@gulftrading.ae", company: "Gulf Trading", subject: "Quote Request", message: "Looking for pricing on marble slabs. Need 1000 sq meters of Italian marble.", source: "portal", read: true, date: "2024-01-17 13:00" },
];

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<typeof initialSubmissions[0] | null>(null);
  const { toast } = useToast();

  const filteredSubmissions = submissions.filter((s) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "unread") return !s.read;
    if (filterStatus === "read") return s.read;
    return true;
  });

  const handleToggleRead = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read: !s.read } : s))
    );
  };

  const handleDelete = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Submission deleted" });
    setSelectedSubmission(null);
  };

  const handleView = (submission: typeof initialSubmissions[0]) => {
    setSelectedSubmission(submission);
    if (!submission.read) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submission.id ? { ...s, read: true } : s))
      );
    }
  };

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact Submissions</h1>
          <p className="text-muted-foreground">
            View and manage contact form submissions
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>All Submissions</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]" data-testid="select-contact-filter">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className={!submission.read ? "bg-primary/5" : ""}
                  >
                    <TableCell>
                      {submission.read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className={!submission.read ? "font-semibold" : "font-medium"}>
                          {submission.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {submission.company}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={!submission.read ? "font-medium" : ""}>
                        {submission.subject}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {submission.source === "public" ? "Website" : "Portal"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {submission.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(submission)}
                          data-testid={`button-view-${submission.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleRead(submission.id)}
                          data-testid={`button-toggle-${submission.id}`}
                        >
                          {submission.read ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <MailOpen className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(submission.id)}
                          data-testid={`button-delete-${submission.id}`}
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

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{selectedSubmission.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Company</div>
                  <div className="font-medium">{selectedSubmission.company}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{selectedSubmission.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{selectedSubmission.date}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Subject</div>
                <div className="font-medium">{selectedSubmission.subject}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Message</div>
                <div className="p-4 bg-muted rounded-lg">{selectedSubmission.message}</div>
              </div>
              <div className="flex justify-between gap-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedSubmission.id)}
                  data-testid="button-delete-submission"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <a href={`mailto:${selectedSubmission.email}`}>
                  <Button data-testid="button-reply-email">
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
