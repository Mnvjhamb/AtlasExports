import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { useSiteContent, type HeroSlide } from '@/hooks/useContent';

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
    subtitle: 'Delivering quality agricultural equipment and commodities to the world',
    imageUrl: '',
    order: 1,
  },
  {
    id: '2',
    title: 'Global Logistics Excellence',
    subtitle: 'Efficient shipping and handling for all your export needs',
    imageUrl: '',
    order: 2,
  },
  {
    id: '3',
    title: 'Finest Basmati Rice',
    subtitle: 'Premium quality rice from the heartland of Punjab',
    imageUrl: '',
    order: 3,
  },
  {
    id: '4',
    title: 'Your Trusted Partner',
    subtitle: 'Building long-term relationships with businesses worldwide',
    imageUrl: '',
    order: 4,
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { data: content, isLoading } = useSiteContent();

  // Use database slides or default slides
  const slides = content?.heroSlides?.length ? content.heroSlides : defaultSlides;
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
      {slides.map((slide, index) => {
        // Use custom image if available, otherwise use default
        const imageUrl = slide.imageUrl || defaultImages[index % defaultImages.length];

        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          </div>
        );
      })}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center text-white px-4 max-w-4xl pointer-events-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            {slides[currentSlide]?.title || 'Premium Exports from Punjab'}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 drop-shadow">
            {slides[currentSlide]?.subtitle ||
              'Delivering quality agricultural equipment and commodities to the world'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="text-base px-8"
                data-testid="button-hero-products"
              >
                View Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20"
                data-testid="button-hero-contact"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slideCount > 1 && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Left Arrow */}
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-black/30 backdrop-blur text-white hover:bg-black/50 rounded-full h-12 w-12 flex items-center justify-center transition-colors"
            onClick={prevSlide}
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-black/30 backdrop-blur text-white hover:bg-black/50 rounded-full h-12 w-12 flex items-center justify-center transition-colors"
            onClick={nextSlide}
            data-testid="button-carousel-next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/70 w-3'
                }`}
                onClick={() => setCurrentSlide(index)}
                data-testid={`button-carousel-dot-${index}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
