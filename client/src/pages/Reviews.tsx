import { motion } from 'framer-motion';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, AlertCircle } from 'lucide-react';
import { useApprovedReviews, calculateAverageRating } from '@/hooks/useReviews';

import heroImg from '@assets/generated_images/business_partnership_handshake.png';

function ReviewSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-20 w-full" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default function Reviews() {
  const { data: reviews, isLoading, error } = useApprovedReviews();

  const averageRating = reviews ? calculateAverageRating(reviews) : 0;
  const reviewCount = reviews?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img
          src={heroImg}
          alt="Client Reviews"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Client Reviews
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Hear what our clients have to say about working with The Atlas
              Exports
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/50'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-semibold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-white/80">({reviewCount} reviews)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews Grid */}
            <div className="lg:col-span-2">
              <motion.h2
                className="text-2xl font-bold mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                What Our Clients Say
              </motion.h2>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <ReviewSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto text-destructive/50 mb-4" />
                  <p className="text-muted-foreground">
                    Failed to load reviews. Please try again later.
                  </p>
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review, index) => (
                    <ReviewCard
                      key={review.id}
                      name={review.clientName}
                      company={
                        review.country
                          ? `${review.company}, ${review.country}`
                          : review.company
                      }
                      rating={review.rating}
                      comment={review.content}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-lg border">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-2">No reviews yet</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to share your experience!
                  </p>
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <ReviewForm />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
