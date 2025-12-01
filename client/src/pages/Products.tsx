import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ContactForm from '@/components/ContactForm';
import { Package, Filter, AlertCircle } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';

// Fallback image
import equipmentImg from '@assets/generated_images/hydraulic_disc_harrow_product.png';

function ProductSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function Products() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [quoteProduct, setQuoteProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch categories for filter dropdown
  const { data: categories, isLoading: categoriesLoading } =
    useCategories(true);

  // Fetch products (filter by category if selected)
  const categoryId = selectedCategory !== 'all' ? selectedCategory : undefined;
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(true, categoryId);

  // Find category name for display
  const getCategoryName = (categoryId: string) => {
    if (!categories) return categoryId;
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const handleRequestQuote = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    if (product) {
      setQuoteProduct({ id: productId, name: product.name });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            Browse our complete catalog of quality products for export
          </p>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={categoriesLoading}
              >
                <SelectTrigger
                  className="w-[200px]"
                  data-testid="select-category-filter"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>
                {productsLoading ? '...' : `${products?.length || 0} products`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : productsError ? (
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load products
            </h3>
            <p className="text-muted-foreground mb-4">
              Please check your connection and try again
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.name}
                category={getCategoryName(product.categoryId)}
                description={product.description}
                imageUrl={product.imageUrls?.[0] || equipmentImg}
                onRequestQuote={handleRequestQuote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory !== 'all'
                ? 'Try selecting a different category'
                : 'No products have been added yet'}
            </p>
            {selectedCategory !== 'all' && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory('all')}
                data-testid="button-reset-filter"
              >
                View All Products
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={!!quoteProduct}
        onOpenChange={() => setQuoteProduct(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Quote</DialogTitle>
          </DialogHeader>
          <ContactForm productName={quoteProduct?.name} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
