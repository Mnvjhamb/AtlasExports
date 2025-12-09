import { useState, useEffect, useCallback, useRef } from 'react';
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
import { ChevronLeft, ChevronRight, Package, AlertCircle } from 'lucide-react';
import { useProduct, useProducts, useCategories } from '@/hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';

// Video Thumbnail Component
function VideoThumbnail({ src, alt }: { src: string; alt: string }) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || thumbnailUrl) return;

    const handleLoadedMetadata = () => {
      // Seek to first frame (0.1 seconds to ensure we get a frame)
      if (video.readyState >= 1) {
        video.currentTime = 0.1;
      }
    };

    const handleSeeked = () => {
      // Capture frame as thumbnail
      try {
        const canvas = document.createElement('canvas');
        const width = video.videoWidth || 160;
        const height = video.videoHeight || 120;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx && width > 0 && height > 0) {
          ctx.drawImage(video, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setThumbnailUrl(dataUrl);
        }
      } catch (error) {
        console.warn('Failed to generate video thumbnail:', error);
        // Fallback: show video with play icon
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);

    // If metadata is already loaded
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [src, thumbnailUrl]);

  return (
    <>
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
        <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-black ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </>
  );
}

// Fallback images
import equipmentImg from '@assets/generated_images/hydraulic_disc_harrow_product.png';

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="w-20 h-20 rounded-lg"
            />
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
  const [isPaused, setIsPaused] = useState(false);

  // Fetch the product
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProduct(id);

  // Fetch categories to show category name
  const { data: categories } = useCategories(true);

  // Fetch related products (same category)
  const { data: relatedProducts } = useProducts(true, product?.categoryId);

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

  // Product media (images + videos)
  const images =
    product?.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [];
  const videos = product?.videoUrls || [];

  // Combine images and videos into a single media array
  // Format: { type: 'image' | 'video', url: string, index: number }
  const media = [
    ...images.map((url, idx) => ({
      type: 'image' as const,
      url,
      originalIndex: idx,
    })),
    ...videos.map((url, idx) => ({
      type: 'video' as const,
      url,
      originalIndex: idx,
    })),
  ];

  // If no media, use fallback image
  const displayMedia =
    media.length > 0
      ? media
      : [{ type: 'image' as const, url: equipmentImg, originalIndex: 0 }];

  const mediaCount = displayMedia.length;
  const hasMultipleMedia = mediaCount > 1;
  const [mediaLoaded, setMediaLoaded] = useState<Record<number, boolean>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Preload images (videos will be loaded on demand to avoid blocking)
  useEffect(() => {
    if (!displayMedia || displayMedia.length === 0) return;

    displayMedia.forEach((item, index) => {
      if (item.type === 'image') {
        const img = new Image();
        img.src = item.url;
        img.onload = () => {
          setMediaLoaded((prev) => ({ ...prev, [index]: true }));
        };
        img.onerror = () => {
          setMediaLoaded((prev) => ({ ...prev, [index]: true }));
        };
      }
      // Don't preload videos - they'll load when selected to avoid blocking
    });
  }, [displayMedia]);

  // Carousel navigation
  const nextImage = useCallback(() => {
    // Pause current video if playing
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current = null;
    }
    setSelectedImage((prev) => (prev + 1) % mediaCount);
  }, [mediaCount]);

  const prevImage = useCallback(() => {
    // Pause current video if playing
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current = null;
    }
    setSelectedImage((prev) => (prev - 1 + mediaCount) % mediaCount);
  }, [mediaCount]);

  // Auto-play carousel (only if multiple media)
  useEffect(() => {
    if (!hasMultipleMedia || isPaused) return;
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [hasMultipleMedia, isPaused, nextImage]);

  // Keyboard navigation
  useEffect(() => {
    if (!hasMultipleMedia) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultipleMedia, nextImage, prevImage]);

  // Cleanup video when selected image changes
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current = null;
      }
    };
  }, [selectedImage]);

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
            <Button
              variant="ghost"
              className="mb-6"
            >
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
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  {!mediaLoaded[selectedImage] && (
                    <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">
                        Loading{' '}
                        {displayMedia[selectedImage]?.type === 'video'
                          ? 'video'
                          : 'image'}
                        ...
                      </div>
                    </div>
                  )}
                  {displayMedia[selectedImage]?.type === 'video' ? (
                    <video
                      ref={(el) => {
                        videoRef.current = el;
                        if (el && mediaLoaded[selectedImage]) {
                          // Only try to play when loaded
                          el.play().catch((err) => {
                            console.warn('Video autoplay failed:', err);
                          });
                        }
                      }}
                      key={`video-${selectedImage}-${displayMedia[selectedImage].url}`}
                      src={displayMedia[selectedImage].url}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                      onLoadedMetadata={() => {
                        setMediaLoaded((prev) => ({
                          ...prev,
                          [selectedImage]: true,
                        }));
                      }}
                      onCanPlay={() => {
                        setMediaLoaded((prev) => ({
                          ...prev,
                          [selectedImage]: true,
                        }));
                        // Try to play when ready
                        if (videoRef.current) {
                          videoRef.current.play().catch((err) => {
                            console.warn('Video autoplay failed:', err);
                          });
                        }
                      }}
                      onError={(e) => {
                        console.error('Video load error:', e);
                        setMediaLoaded((prev) => ({
                          ...prev,
                          [selectedImage]: true,
                        }));
                      }}
                      style={{
                        opacity: mediaLoaded[selectedImage] ? 1 : 0,
                        transition: 'opacity 0.3s',
                      }}
                    />
                  ) : (
                    <img
                      src={displayMedia[selectedImage]?.url || equipmentImg}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading={selectedImage === 0 ? 'eager' : 'lazy'}
                      decoding={selectedImage === 0 ? 'sync' : 'async'}
                      onLoad={() =>
                        setMediaLoaded((prev) => ({
                          ...prev,
                          [selectedImage]: true,
                        }))
                      }
                      style={{
                        opacity: mediaLoaded[selectedImage] ? 1 : 0,
                        transition: 'opacity 0.3s',
                      }}
                      // @ts-ignore - fetchPriority is a valid HTML attribute
                      fetchPriority={selectedImage === 0 ? 'high' : 'auto'}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Carousel Navigation Arrows (only if multiple media) */}
              {hasMultipleMedia && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-background/90 hover:bg-background border border-border shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                    data-testid="button-prev-image"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-background/90 hover:bg-background border border-border shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                    data-testid="button-next-image"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Media Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {displayMedia.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === selectedImage
                            ? 'w-8 bg-primary'
                            : 'w-2 bg-background/60 hover:bg-background/80'
                        }`}
                        aria-label={`Go to ${item.type} ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleMedia && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayMedia.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
                      index === selectedImage
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`button-media-${index}`}
                  >
                    {item.type === 'video' ? (
                      <VideoThumbnail
                        src={item.url}
                        alt={`${product.name} video thumbnail ${index + 1}`}
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onLoad={() =>
                          setMediaLoaded((prev) => ({ ...prev, [index]: true }))
                        }
                      />
                    )}
                  </motion.button>
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
                Minimum Order: {product.minOrderQuantity}{' '}
                {product.unit || 'units'}
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
              <Link
                to="/contact"
                className="flex-1"
              >
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

      <Dialog
        open={showQuoteForm}
        onOpenChange={setShowQuoteForm}
      >
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
