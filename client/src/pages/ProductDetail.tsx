import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ContactForm from '@/components/ContactForm';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, Package, AlertCircle } from 'lucide-react';
import { useProduct, useProducts, useCategories } from '@/hooks/useProducts';

// Fallback images
import equipmentImg from '@assets/generated_images/hydraulic_disc_harrow_product.png';

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-20 h-20 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  // Fetch the product
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProduct(id);

  // Fetch categories to show category name
  const { data: categories } = useCategories(true);

  // Fetch related products (same category)
  const { data: relatedProducts } = useProducts(
    true,
    product?.categoryId
  );

  // Get category name
  const getCategoryName = (categoryId: string) => {
    if (!categories) return categoryId;
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  // Filter out current product from related
  const filteredRelatedProducts = relatedProducts
    ?.filter((p) => p.id !== id)
    .slice(0, 3);

  // Product images
  const images =
    product?.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : [equipmentImg];

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-40 mb-6" />
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/products">
            <Button variant="ghost" className="mb-6">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product not found</h3>
            <p className="text-muted-foreground mb-4">
              This product may have been removed or doesn't exist.
            </p>
            <Link to="/products">
              <Button>View All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/products">
          <Button
            variant="ghost"
            className="mb-6"
            data-testid="button-back-products"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImage
                        ? 'border-primary'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    data-testid={`button-image-${index}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Badge className="mb-3">
              {getCategoryName(product.categoryId)}
            </Badge>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Min Order Quantity */}
            {product.minOrderQuantity && (
              <p className="text-sm text-muted-foreground mb-4">
                Minimum Order: {product.minOrderQuantity} {product.unit || 'units'}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => setShowQuoteForm(true)}
                data-testid="button-request-quote"
              >
                Request Quote
              </Button>
              <Link to="/contact" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  data-testid="button-contact-us"
                >
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Specifications */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(product.specifications).map(
                        ([key, value], index, arr) => (
                          <div
                            key={key}
                            className={`flex justify-between py-2 ${
                              index !== arr.length - 1
                                ? 'border-b border-border'
                                : ''
                            }`}
                          >
                            <span className="text-muted-foreground">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts && filteredRelatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRelatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  title={prod.name}
                  category={getCategoryName(prod.categoryId)}
                  description={prod.description}
                  imageUrl={prod.imageUrls?.[0] || equipmentImg}
                  onRequestQuote={() => setShowQuoteForm(true)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <Dialog open={showQuoteForm} onOpenChange={setShowQuoteForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Quote for {product.name}</DialogTitle>
          </DialogHeader>
          <ContactForm productName={product.name} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
