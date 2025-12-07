import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card
        className="overflow-hidden hover-elevate group h-full border-border/50 shadow-md hover:shadow-xl transition-all duration-300"
        data-testid={`card-product-${id}`}
      >
        <motion.div
          className="relative aspect-[4/3] overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Badge
              className="absolute top-3 right-3 text-xs"
              variant="secondary"
            >
              {category}
            </Badge>
          </motion.div>
        </motion.div>
        <CardContent className="p-4">
          <motion.h3
            className="font-semibold text-lg mb-2 line-clamp-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.1 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-sm text-muted-foreground mb-4 line-clamp-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.15 }}
          >
            {description}
          </motion.p>
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            <Link
              to={`/products/${id}`}
              className="flex-1"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full"
                  data-testid={`button-view-${id}`}
                >
                  View Details
                </Button>
              </motion.div>
            </Link>
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="w-full"
                onClick={() => onRequestQuote?.(id)}
                data-testid={`button-quote-${id}`}
              >
                Request Quote
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
