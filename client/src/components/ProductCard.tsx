import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  onRequestQuote?: (productId: string) => void;
}

export default function ProductCard({
  id,
  title,
  category,
  description,
  imageUrl,
  onRequestQuote,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate group" data-testid={`card-product-${id}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
          <Link href={`/products/${id}`} className="flex-1">
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
  );
}
