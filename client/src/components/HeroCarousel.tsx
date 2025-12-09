import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { useSiteContent, type HeroSlide } from '@/hooks/useContent';
import { motion, AnimatePresence } from 'framer-motion';

// Default images for slides without custom images
import heroImage1 from '@assets/generated_images/punjab_agricultural_fields_landscape.png';
import heroImage2 from '@assets/generated_images/export_warehouse_shipping_containers.png';
import heroImage3 from '@assets/generated_images/premium_basmati_rice_grains.png';
import heroImage4 from '@assets/generated_images/business_partnership_handshake.png';

const defaultImages = [heroImage1, heroImage2, heroImage3, heroImage4];

// Default slides when no content in database
const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Premium Exports from Punjab',
    subtitle:
      'Delivering quality agricultural equipment and commodities to the world',
    imageUrl: '',
    videoUrl: '',
    mediaType: 'image',
    order: 1,
  },
  {
    id: '2',
    title: 'Global Logistics Excellence',
    subtitle: 'Efficient shipping and handling for all your export needs',
    imageUrl: '',
    videoUrl: '',
    mediaType: 'image',
    order: 2,
  },
  {
    id: '3',
    title: 'Finest Basmati Rice',
    subtitle: 'Premium quality rice from the heartland of Punjab',
    imageUrl: '',
    videoUrl: '',
    mediaType: 'image',
    order: 3,
  },
  {
    id: '4',
    title: 'Your Trusted Partner',
    subtitle: 'Building long-term relationships with businesses worldwide',
    imageUrl: '',
    videoUrl: '',
    mediaType: 'image',
    order: 4,
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState<Record<number, boolean>>({});
  const { data: content, isLoading } = useSiteContent();

  // Use database slides or default slides
  const slides = content?.heroSlides?.length
    ? content.heroSlides
    : defaultSlides;
  const slideCount = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slideCount]);

  // Reset slide index if slides change
  useEffect(() => {
    if (currentSlide >= slideCount) {
      setCurrentSlide(0);
    }
  }, [slideCount, currentSlide]);

  // Preload all images and videos
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const preloadMedia = async () => {
      const preloadPromises: Promise<void>[] = [];

      slides.forEach((slide, index) => {
        const isVideo = slide.mediaType === 'video' && slide.videoUrl;
        const imageUrl =
          slide.imageUrl || defaultImages[index % defaultImages.length];

        if (isVideo && slide.videoUrl) {
          // Preload video
          const video = document.createElement('video');
          video.preload = 'auto';
          video.src = slide.videoUrl;
          video.muted = true;
          preloadPromises.push(
            new Promise((resolve) => {
              video.onloadeddata = () => {
                setMediaLoaded((prev) => ({ ...prev, [index]: true }));
                resolve();
              };
              video.onerror = () => resolve(); // Continue even if preload fails
            })
          );
        } else if (imageUrl) {
          // Preload image
          const img = new Image();
          img.src = imageUrl;
          preloadPromises.push(
            new Promise((resolve) => {
              img.onload = () => {
                setMediaLoaded((prev) => ({ ...prev, [index]: true }));
                resolve();
              };
              img.onerror = () => resolve(); // Continue even if preload fails
            })
          );
        }
      });

      // Start preloading but don't wait for all
      Promise.all(preloadPromises).catch(() => {
        // Silently handle errors
      });
    };

    preloadMedia();
  }, [slides]);

  if (isLoading) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-muted">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto mb-8" />
            <div className="flex gap-4 justify-center">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-[70vh] md:h-[80vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => {
          if (index !== currentSlide) return null;

          const isVideo = slide.mediaType === 'video' && slide.videoUrl;
          // Use custom image if available, otherwise use default
          const imageUrl =
            slide.imageUrl || defaultImages[index % defaultImages.length];

          return (
            <motion.div
              key={slide.id || index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {isVideo ? (
                <>
                  {!mediaLoaded[index] && (
                    <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                      <div className="text-muted-foreground">
                        Loading video...
                      </div>
                    </div>
                  )}
                  <video
                    src={slide.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    onLoadedData={() =>
                      setMediaLoaded((prev) => ({ ...prev, [index]: true }))
                    }
                    onCanPlay={() =>
                      setMediaLoaded((prev) => ({ ...prev, [index]: true }))
                    }
                    onLoadedMetadata={() =>
                      setMediaLoaded((prev) => ({ ...prev, [index]: true }))
                    }
                    style={{
                      opacity: mediaLoaded[index] ? 1 : 0,
                      transition: 'opacity 0.3s',
                    }}
                    // @ts-ignore - fetchPriority is a valid HTML attribute
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />
                </>
              ) : (
              <motion.img
                src={imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding={index === 0 ? 'sync' : 'async'}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'linear' }}
                  onLoad={() =>
                    setMediaLoaded((prev) => ({ ...prev, [index]: true }))
                  }
                  style={{ opacity: mediaLoaded[index] !== false ? 1 : 0 }}
                  // @ts-ignore - fetchPriority is a valid HTML attribute
                  fetchPriority={index === 0 ? 'high' : 'auto'}
              />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/20 to-primary/5" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="text-center text-white px-4 max-w-4xl pointer-events-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {slides[currentSlide]?.title || 'Premium Exports from Punjab'}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl mb-10 text-white/95 drop-shadow font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              {slides[currentSlide]?.subtitle ||
                'Delivering quality agricultural equipment and commodities to the world'}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Link to="/products">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="text-base px-8"
                    data-testid="button-hero-products"
                  >
                    View Products
                  </Button>
                </motion.div>
              </Link>
              <Link to="/contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20"
                    data-testid="button-hero-contact"
                  >
                    Contact Us
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {slideCount > 1 && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Left Arrow */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto">
          <motion.button
            type="button"
              className="bg-black/30 backdrop-blur text-white hover:bg-black/50 rounded-full h-12 w-12 flex items-center justify-center"
            onClick={prevSlide}
            data-testid="button-carousel-prev"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            whileTap={{ scale: 0.95 }}
            style={{ transformOrigin: 'center' }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <ChevronLeft className="h-8 w-8" />
          </motion.button>
          </div>

          {/* Right Arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
          <motion.button
            type="button"
              className="bg-black/30 backdrop-blur text-white hover:bg-black/50 rounded-full h-12 w-12 flex items-center justify-center"
            onClick={nextSlide}
            data-testid="button-carousel-next"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            whileTap={{ scale: 0.95 }}
            style={{ transformOrigin: 'center' }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <ChevronRight className="h-8 w-8" />
          </motion.button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                type="button"
                className={`h-3 rounded-full ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/70 w-3'
                }`}
                onClick={() => setCurrentSlide(index)}
                data-testid={`button-carousel-dot-${index}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  width: index === currentSlide ? 32 : 12,
                  opacity: index === currentSlide ? 1 : 0.5,
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
