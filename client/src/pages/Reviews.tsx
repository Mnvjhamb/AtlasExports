import { motion } from "framer-motion";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import { Star } from "lucide-react";

import heroImg from "@assets/generated_images/business_partnership_handshake.png";

// todo: remove mock functionality - replace with API data
const reviews = [
  {
    name: "Ahmed Al-Rashid",
    company: "AgriTech Solutions, UAE",
    rating: 5,
    comment: "Outstanding quality equipment and exceptional service. The Atlas Exports has been our trusted partner for 3 years now. Their team is professional and delivery is always on time.",
  },
  {
    name: "Sarah Thompson",
    company: "Global Harvest Co., UK",
    rating: 5,
    comment: "The basmati rice quality is consistently excellent. They understand our requirements perfectly and the packaging meets all UK import standards.",
  },
  {
    name: "Michael Chen",
    company: "Pacific Agriculture, Singapore",
    rating: 4,
    comment: "Great range of agricultural equipment at competitive prices. Their team is responsive and handles documentation efficiently.",
  },
  {
    name: "Emma Wilson",
    company: "Farm Supplies Australia",
    rating: 5,
    comment: "We've been importing agricultural equipment from The Atlas Exports for over 2 years. Quality is consistent and their after-sales support is excellent.",
  },
  {
    name: "Hans Mueller",
    company: "Euro Agri Imports, Germany",
    rating: 5,
    comment: "Professional team, quality products, and reliable delivery. They understand European quality standards and always meet our expectations.",
  },
  {
    name: "Fatima Al-Hassan",
    company: "Gulf Trading, Saudi Arabia",
    rating: 4,
    comment: "Good quality marble and granite products. Packaging is excellent and products arrive in perfect condition. Would recommend.",
  },
  {
    name: "James Wilson",
    company: "Canadian Farm Supplies",
    rating: 5,
    comment: "Excellent experience working with The Atlas Exports. Their cultivators and harrows are of superior quality. Very happy with our partnership.",
  },
  {
    name: "Priya Sharma",
    company: "Indo-Gulf Traders, Oman",
    rating: 5,
    comment: "The best basmati rice we've sourced from India. Consistent quality, fair pricing, and excellent customer service. Highly recommended!",
  },
];

export default function Reviews() {
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Client Reviews</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Hear what our clients have to say about working with The Atlas Exports
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(Number(averageRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white/50"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-semibold">{averageRating}</span>
              <span className="text-white/80">({reviews.length} reviews)</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.h2 
                className="text-2xl font-bold mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                What Our Clients Say
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review, index) => (
                  <ReviewCard key={index} {...review} index={index} />
                ))}
              </div>
            </div>
            
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
