import { useState, useEffect, useCallback, useRef } from 'react';
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
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const preloadTimeouts = useRef<Record<number, NodeJS.Timeout>>({});
  const preloadVideoElements = useRef<Record<number, HTMLVideoElement>>({});

  // Use database slides or default slides, sorted by order
  const slides = content?.heroSlides?.length
    ? [...content.heroSlides].sort((a, b) => a.order - b.order)
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
    const interval = setInterval(nextSlide, 8000); // 8 seconds for better viewing time
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slideCount]);

  // Reset slide index if slides change
  useEffect(() => {
    if (currentSlide >= slideCount) {
      setCurrentSlide(0);
    }
  }, [slideCount, currentSlide]);

  // Cleanup videos when switching slides
  useEffect(() => {
    // Calculate which slides should keep their videos (current and adjacent)
    const keepIndices = new Set<number>([currentSlide]);
    if (slideCount > 1) {
      keepIndices.add((currentSlide + 1) % slideCount);
      keepIndices.add((currentSlide - 1 + slideCount) % slideCount);
    }

    // Only pause video elements that are not current - don't destroy DOM elements
    Object.entries(videoRefs.current).forEach(([indexStr, video]) => {
      const index = parseInt(indexStr, 10);
      if (video && index !== currentSlide) {
        // Pause but don't destroy - let React handle DOM cleanup
        video.pause();
        video.currentTime = 0;
      }
    });

    // Clean up preload video elements (not DOM elements) that are no longer needed
    Object.entries(preloadVideoElements.current).forEach(
      ([indexStr, video]) => {
        const index = parseInt(indexStr, 10);
        if (!keepIndices.has(index)) {
          video.src = '';
          video.load();
          delete preloadVideoElements.current[index];
        }
      }
    );
  }, [currentSlide, slideCount]);

  // Cleanup all videos on unmount
  useEffect(() => {
    return () => {
      // Clean up all video refs
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
          video.src = '';
          video.load(); // Reset video element
        }
      });
      videoRefs.current = {};

      // Clean up all preload video elements
      Object.values(preloadVideoElements.current).forEach((video) => {
        if (video) {
          video.src = '';
          video.load();
        }
      });
      preloadVideoElements.current = {};

      // Clear all timeouts
      Object.values(preloadTimeouts.current).forEach(clearTimeout);
      preloadTimeouts.current = {};
    };
  }, []);

  // Optimized media preloading - only preload current, next, and previous slides
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const preloadMedia = async () => {
      // Clear any pending preload timeouts
      Object.values(preloadTimeouts.current).forEach(clearTimeout);
      preloadTimeouts.current = {};

      // Calculate which slides to preload (current, next, previous)
      const indicesToPreload = new Set<number>([currentSlide]);
      if (slideCount > 1) {
        indicesToPreload.add((currentSlide + 1) % slideCount);
        indicesToPreload.add((currentSlide - 1 + slideCount) % slideCount);
      }

      indicesToPreload.forEach((index) => {
        const slide = slides[index];
        if (!slide) return;

        const isVideo = slide.mediaType === 'video' && slide.videoUrl;
        const imageUrl =
          slide.imageUrl || defaultImages[index % defaultImages.length];

        // Don't preload videos - let them load when rendered in DOM to avoid WebMediaPlayer issues
        // Only preload images
        if (!isVideo && imageUrl) {
          // Preload image immediately
          const img = new Image();
          img.src = imageUrl;
          img.onload = () => {
            setMediaLoaded((prev) => ({ ...prev, [index]: true }));
          };
          img.onerror = () => {
            setMediaLoaded((prev) => ({ ...prev, [index]: true }));
          };
        }
      });
    };

    preloadMedia();

    // Cleanup function
    return () => {
      Object.values(preloadTimeouts.current).forEach(clearTimeout);
      preloadTimeouts.current = {};
    };
  }, [slides, currentSlide, slideCount]);

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
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[index] = el;
                      } else {
                        // Just remove from refs when element is removed from DOM
                        // Don't destroy it here - React will handle cleanup
                        delete videoRefs.current[index];
                      }
                    }}
                    src={slide.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
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
                    onPlay={() => {
                      // Ensure video plays smoothly
                      const video = videoRefs.current[index];
                      if (video) {
                        video.play().catch(() => {
                          // Autoplay failed, but that's okay
                        });
                      }
                    }}
                    style={{
                      opacity: mediaLoaded[index] ? 1 : 0,
                      transition: 'opacity 0.3s',
                    }}
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
                  {...({ fetchpriority: index === 0 ? 'high' : 'auto' } as any)}
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
