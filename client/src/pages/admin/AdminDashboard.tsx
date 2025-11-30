import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  MessageSquare,
  Star,
  TrendingUp,
  Eye,
  MousePointer,
  Users,
  Clock,
} from "lucide-react";

// todo: remove mock functionality - replace with API data
const stats = [
  { title: "Total Products", value: "28", icon: Package, change: "+3 this month" },
  { title: "Contact Submissions", value: "45", icon: MessageSquare, change: "12 unread" },
  { title: "Reviews", value: "24", icon: Star, change: "5 pending" },
  { title: "Total Events", value: "1,284", icon: TrendingUp, change: "+156 this week" },
];

// todo: remove mock functionality - replace with API data
const recentEvents = [
  { type: "page_view", page: "Products", details: "Hydraulic Disc Harrow viewed", time: "2 mins ago" },
  { type: "form_submit", page: "Contact", details: "Quote request submitted", time: "15 mins ago" },
  { type: "button_click", page: "Home", details: "View Products CTA clicked", time: "32 mins ago" },
  { type: "social_click", page: "Client Portal", details: "WhatsApp link clicked", time: "1 hour ago" },
  { type: "page_view", page: "About", details: "About page viewed", time: "1 hour ago" },
  { type: "form_submit", page: "Client Portal", details: "Review submitted", time: "2 hours ago" },
  { type: "page_view", page: "Products", details: "Basmati Rice viewed", time: "3 hours ago" },
  { type: "button_click", page: "Products", details: "Request Quote clicked", time: "3 hours ago" },
];

// todo: remove mock functionality - replace with API data
const recentSubmissions = [
  { name: "John Smith", company: "AgriTech UK", subject: "Quote Request", status: "unread", time: "15 mins ago" },
  { name: "Maria Garcia", company: "FarmPro Spain", subject: "Partnership", status: "unread", time: "2 hours ago" },
  { name: "Li Wei", company: "China Imports", subject: "Product Inquiry", status: "read", time: "5 hours ago" },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "page_view": return Eye;
    case "button_click": return MousePointer;
    case "form_submit": return MessageSquare;
    case "social_click": return Users;
    default: return Eye;
  }
};

const getEventBadgeVariant = (type: string): "default" | "secondary" | "outline" => {
  switch (type) {
    case "form_submit": return "default";
    case "button_click": return "secondary";
    default: return "outline";
  }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
              <div className="text-xs text-primary mt-2">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Recent Events</CardTitle>
            <Badge variant="outline">{recentEvents.length} events</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.slice(0, 6).map((event, index) => {
                const Icon = getEventIcon(event.type);
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="p-2 rounded bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant={getEventBadgeVariant(event.type)} className="text-xs">
                          {event.type.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{event.page}</span>
                      </div>
                      <p className="text-sm truncate">{event.details}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Recent Submissions</CardTitle>
            <Badge variant="outline">{recentSubmissions.filter((s) => s.status === "unread").length} unread</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      submission.status === "unread" ? "bg-primary" : "bg-muted"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium">{submission.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {submission.company}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{submission.subject}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {submission.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
