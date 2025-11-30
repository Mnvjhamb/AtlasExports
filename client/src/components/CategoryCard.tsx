import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
  index?: number;
}

export default function CategoryCard({
  id,
  name,
  imageUrl,
  productCount,
  index = 0,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/products?category=${id}`}>
        <Card
          className="overflow-hidden hover-elevate group cursor-pointer"
          data-testid={`card-category-${id}`}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-semibold text-lg mb-1">{name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">{productCount} Products</span>
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
