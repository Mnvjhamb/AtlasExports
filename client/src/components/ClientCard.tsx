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
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 200,
      }}
      whileHover={{ y: -8, scale: 1.03 }}
    >
      <Card className="hover-elevate border-border/50 shadow-md hover:shadow-xl transition-all duration-300">
        <CardContent className="p-5 flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="h-12 w-12 flex-shrink-0">
              {logoUrl ? (
                <AvatarImage
                  src={logoUrl}
                  alt={name}
                  className="object-contain p-1"
                />
              ) : null}
              <AvatarFallback className="bg-muted">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <motion.div
            className="min-w-0"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: index * 0.05 + 0.1 }}
          >
            <motion.div
              className="font-medium truncate"
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {name}
            </motion.div>
            <motion.div
              className="text-sm text-muted-foreground truncate"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.05 + 0.15 }}
            >
              {country}
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
