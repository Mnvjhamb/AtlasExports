import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface ReviewCardProps {
  name: string;
  company: string;
  rating: number;
  comment: string;
  index?: number;
}

export default function ReviewCard({ name, company, rating, comment, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full">
          <Quote className="h-8 w-8 text-primary/20 mb-4 flex-shrink-0" />
          <p className="text-muted-foreground mb-6 italic flex-1 line-clamp-4 overflow-hidden">
            "{comment}"
          </p>
          <div className="flex items-center gap-3 flex-shrink-0 mt-auto">
            <Avatar className="flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary">
                {name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{name}</div>
              <div className="text-sm text-muted-foreground truncate">{company}</div>
            </div>
            <div className="flex gap-0.5 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
