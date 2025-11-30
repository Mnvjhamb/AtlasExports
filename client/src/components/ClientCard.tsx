import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2 } from "lucide-react";

interface ClientCardProps {
  name: string;
  country: string;
}

export default function ClientCard({ name, country }: ClientCardProps) {
  return (
    <Card className="hover-elevate">
      <CardContent className="p-4 flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{country}</div>
        </div>
      </CardContent>
    </Card>
  );
}
