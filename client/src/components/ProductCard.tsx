import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  index?: number;
  onRequestQuote?: (productId: string) => void;
}

export default function ProductCard({
  id,
  title,
  category,
  description,
  imageUrl,
  index = 0,
  onRequestQuote,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover-elevate group h-full" data-testid={`card-product-${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Badge
            className="absolute top-3 right-3 text-xs"
            variant="secondary"
          >
            {category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex gap-2">
            <Link to={`/products/${id}`} className="flex-1">
              <Button variant="outline" className="w-full" data-testid={`button-view-${id}`}>
                View Details
              </Button>
            </Link>
            <Button
              className="flex-1"
              onClick={() => onRequestQuote?.(id)}
              data-testid={`button-quote-${id}`}
            >
              Request Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
