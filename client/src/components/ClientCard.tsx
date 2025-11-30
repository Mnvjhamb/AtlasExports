import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClientCardProps {
  name: string;
  country: string;
  logoUrl?: string;
  index?: number;
}

export default function ClientCard({
  name,
  country,
  logoUrl,
  index = 0,
}: ClientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="hover-elevate">
        <CardContent className="p-4 flex items-center gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            {logoUrl ? (
              <AvatarImage src={logoUrl} alt={name} className="object-contain p-1" />
            ) : null}
            <AvatarFallback className="bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium truncate">{name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {country}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
