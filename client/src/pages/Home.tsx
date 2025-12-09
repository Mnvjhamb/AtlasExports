import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import TrustIndicators from '@/components/TrustIndicators';
import ClientCard from '@/components/ClientCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { useCategories, useFeaturedProducts } from '@/hooks/useProducts';
import { useClients } from '@/hooks/useClients';
import { useSiteContent } from '@/hooks/useContent';

// Fallback images for when products don't have images
import equipmentImg from '@assets/generated_images/hydraulic_disc_harrow_product.png';
import marbleImg from '@assets/generated_images/marble_granite_stone_slabs.png';

// Default clients if database is empty
const defaultClients: Array<{
  id?: string;
  name: string;
  country: string;
  logoUrl?: string;
}> = [
  { name: 'AgriTech Solutions', country: 'United Arab Emirates' },
  { name: 'Global Harvest Co.', country: 'United Kingdom' },
  { name: 'FarmPro Industries', country: 'Australia' },
  { name: 'Golden Grain Trading', country: 'Saudi Arabia' },
  { name: 'Pacific Agriculture', country: 'Singapore' },
  { name: 'Euro Agri Imports', country: 'Germany' },
  { name: 'AfriTrade LLC', country: 'South Africa' },
  { name: 'Canadian Farm Supplies', country: 'Canada' },
];

function CategorySkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

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

export default function Home() {
  const { data: content } = useSiteContent();
  const home = content?.home;

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories(true);

  const {
    data: featuredProducts,
    isLoading: productsLoading,
    error: productsError,
  } = useFeaturedProducts();

  const { data: dbClients, isLoading: clientsLoading } = useClients(true);

  // Use database clients if available, otherwise use defaults
  const clients =
    dbClients && dbClients.length > 0 ? dbClients : defaultClients;

  const handleRequestQuote = (productId: string) => {
    console.log('Quote requested for product:', productId);
  };

  return (
    <div>
      <HeroCarousel />

      {/* Categories Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {home?.categoriesTitle || 'Our Product Categories'}
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {home?.categoriesSubtitle ||
                'Explore our diverse range of quality products, from agricultural machinery to premium commodities, furniture, and building materials.'}
            </motion.p>
          </motion.div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <CategorySkeleton key={i} />
              ))}
            </div>
          ) : categoriesError ? (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load categories. Please try again later.
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category, index) => (
                <CategoryCard
                  key={category.id}
                  id={category.slug || category.id}
                  name={category.name}
                  imageUrl={category.imageUrl || equipmentImg}
                  productCount={0}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No categories available yet.
            </div>
          )}
        </div>
      </section>

      <TrustIndicators />

      {/* Featured Products Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between mb-16 flex-wrap gap-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                {home?.featuredProductsTitle || 'Featured Products'}
              </motion.h2>
              <motion.p
                className="text-lg text-muted-foreground max-w-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.15 }}
              >
                {home?.featuredProductsSubtitle ||
                  'Discover our best-selling products trusted by businesses worldwide'}
              </motion.p>
            </motion.div>
            <Link to="/products">
              <Button
                variant="outline"
                className="hidden sm:flex"
                data-testid="button-view-all-products"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load products. Please try again later.
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  category={product.categoryId}
                  description={product.description}
                  imageUrl={product.imageUrls?.[0] || equipmentImg}
                  hasVideo={
                    !!(product.videoUrls && product.videoUrls.length > 0)
                  }
                  index={index}
                  onRequestQuote={handleRequestQuote}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No featured products available yet.
            </div>
          )}

          <motion.div
            className="mt-8 text-center sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link to="/products">
              <Button data-testid="button-view-all-products-mobile">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Clients Section */}
      {/* <section className="py-20 md:py-24 bg-card border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {home?.clientsTitle || 'Our Trusted Clients'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {home?.clientsSubtitle ||
                "We're proud to partner with leading businesses across the globe. Here are some of the companies that trust The Atlas Exports."}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientsLoading
              ? [...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-20 w-full rounded-lg"
                  />
                ))
              : clients.map((client, index) => (
                  <ClientCard
                    key={client.id ?? index}
                    name={client.name}
                    country={client.country}
                    logoUrl={client.logoUrl}
                    index={index}
                  />
                ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {home?.ctaTitle ||
                  "Partner with Punjab's Trusted Export Company"}
              </motion.h2>
              <motion.p
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {home?.ctaDescription ||
                  'With over 14 years of experience in international trade, The Atlas Exports has built a reputation for quality, reliability, and exceptional customer service. We handle everything from sourcing to shipping, making your import process seamless.'}
              </motion.p>
              <ul className="space-y-3 mb-8">
                {(
                  home?.ctaFeatures || [
                    'Quality-assured products with certifications',
                    'Competitive pricing with flexible payment terms',
                    'End-to-end logistics support',
                    'Dedicated account manager for each client',
                  ]
                ).map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.08 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="h-2 w-2 rounded-full bg-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Link to="/contact">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      data-testid="button-cta-contact"
                    >
                      Get in Touch
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/reviews">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      data-testid="button-cta-reviews"
                    >
                      See Reviews
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            >
              <motion.img
                src={marbleImg}
                alt="Quality products"
                className="rounded-lg shadow-lg"
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.4 }}
              />
              {/* <motion.div
                className="absolute -bottom-6 -left-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-xl shadow-xl hidden lg:block border-2 border-primary-foreground/10 animate-float"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <motion.div
                  className="text-4xl font-bold"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: 0.3 }}
                >
                  {home?.ctaBadgeNumber || '14+'}
                </motion.div>
                <motion.div
                  className="text-sm opacity-90"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.9 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: 0.35 }}
                >
                  {home?.ctaBadgeText || 'Years of Excellence'}
                </motion.div>
              </motion.div> */}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
