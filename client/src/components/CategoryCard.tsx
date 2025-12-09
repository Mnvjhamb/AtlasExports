import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <Link to={`/products?category=${id}`}>
        <Card
          className="overflow-hidden hover-elevate group cursor-pointer border-border/50 shadow-md hover:shadow-xl transition-all duration-300"
          data-testid={`card-category-${id}`}
        >
          <motion.div
            className="relative aspect-[4/3] overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/20 to-transparent"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 0.9 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 text-white"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.05 + 0.1 }}
            >
              <h3 className="font-semibold text-lg mb-1">{name}</h3>
              {/* <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">
                  {productCount} Products
                </span>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.div>
              </div> */}
            </motion.div>
          </motion.div>
        </Card>
      </Link>
    </motion.div>
  );
}
