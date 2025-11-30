import { Link } from 'wouter';
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

// Fallback images for when products don't have images
import equipmentImg from '@assets/generated_images/hydraulic_disc_harrow_product.png';
import marbleImg from '@assets/generated_images/marble_granite_stone_slabs.png';

// Default clients if database is empty
const defaultClients = [
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
  const clients = dbClients && dbClients.length > 0 ? dbClients : defaultClients;

  const handleRequestQuote = (productId: string) => {
    console.log('Quote requested for product:', productId);
  };

  return (
    <div>
      <HeroCarousel />

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Product Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of quality products, from agricultural
              machinery to premium commodities, furniture, and building
              materials.
            </p>
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
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between mb-12 flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Discover our best-selling products trusted by businesses
                worldwide
              </p>
            </div>
            <Link href="/products">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load products. Please try again later.
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  category={product.categoryId}
                  description={product.description}
                  imageUrl={product.imageUrls?.[0] || equipmentImg}
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
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/products">
              <Button data-testid="button-view-all-products-mobile">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-card border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Trusted Clients</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're proud to partner with leading businesses across the globe.
              Here are some of the companies that trust The Atlas Exports.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {clientsLoading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))
            ) : (
              clients.map((client, index) => (
                <ClientCard
                  key={'id' in client ? client.id : index}
                  name={client.name}
                  country={client.country}
                  logoUrl={'logoUrl' in client ? client.logoUrl : undefined}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Partner with Punjab's Trusted Export Company
              </h2>
              <p className="text-muted-foreground mb-6">
                With over 14 years of experience in international trade, The
                Atlas Exports has built a reputation for quality, reliability,
                and exceptional customer service. We handle everything from
                sourcing to shipping, making your import process seamless.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Quality-assured products with certifications',
                  'Competitive pricing with flexible payment terms',
                  'End-to-end logistics support',
                  'Dedicated account manager for each client',
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" data-testid="button-cta-contact">
                    Get in Touch
                  </Button>
                </Link>
                <Link href="/reviews">
                  <Button
                    size="lg"
                    variant="outline"
                    data-testid="button-cta-reviews"
                  >
                    See Reviews
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={marbleImg}
                alt="Quality products"
                className="rounded-lg shadow-lg"
              />
              <motion.div
                className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-4xl font-bold">14+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
