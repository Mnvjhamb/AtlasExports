import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
}

export default function CategoryCard({
  id,
  name,
  imageUrl,
  productCount,
}: CategoryCardProps) {
  return (
    <Link href={`/products?category=${id}`}>
      <Card
        className="overflow-hidden hover-elevate group cursor-pointer"
        data-testid={`card-category-${id}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">{productCount} Products</span>
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
