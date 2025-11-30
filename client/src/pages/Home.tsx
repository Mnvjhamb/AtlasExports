import { Link } from "wouter";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import TrustIndicators from "@/components/TrustIndicators";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import equipmentImg from "@assets/generated_images/hydraulic_disc_harrow_product.png";
import riceImg from "@assets/generated_images/premium_basmati_rice_grains.png";
import furnitureImg from "@assets/generated_images/modern_wooden_furniture.png";
import marbleImg from "@assets/generated_images/marble_granite_stone_slabs.png";
import cultivatorImg from "@assets/generated_images/farm_cultivator_equipment.png";
import discPloughImg from "@assets/generated_images/disc_plough_equipment.png";
import kinnowImg from "@assets/generated_images/fresh_kinnow_citrus_fruits.png";

// todo: remove mock functionality - replace with API data
const categories = [
  { id: "agri-equipment", name: "Agriculture Equipment", imageUrl: equipmentImg, productCount: 12 },
  { id: "agri-commodities", name: "Agriculture Commodities", imageUrl: riceImg, productCount: 8 },
  { id: "furniture", name: "All Kinds of Furniture", imageUrl: furnitureImg, productCount: 15 },
  { id: "marble-granite", name: "Marble & Granite", imageUrl: marbleImg, productCount: 10 },
];

// todo: remove mock functionality - replace with API data
const featuredProducts = [
  {
    id: "1",
    title: "Hydraulic Disc Harrow",
    category: "Agriculture Equipment",
    description: "Heavy-duty disc harrow for efficient soil preparation. Suitable for 45-75 HP tractors.",
    imageUrl: equipmentImg,
  },
  {
    id: "2",
    title: "Premium Basmati Rice",
    category: "Agriculture Commodities",
    description: "Extra-long grain premium basmati rice. Aged for 2 years for perfect aroma and taste.",
    imageUrl: riceImg,
  },
  {
    id: "3",
    title: "Farm Cultivator",
    category: "Agriculture Equipment",
    description: "9-tyne spring loaded cultivator for deep tillage. Robust construction for heavy use.",
    imageUrl: cultivatorImg,
  },
  {
    id: "4",
    title: "Disc Plough",
    category: "Agriculture Equipment",
    description: "3-disc heavy-duty plough for primary tillage. Ideal for tough and hard soils.",
    imageUrl: discPloughImg,
  },
  {
    id: "5",
    title: "Fresh Kinnow",
    category: "Agriculture Commodities",
    description: "Premium quality Punjab Kinnow mandarins. Sweet, juicy, and perfect for export.",
    imageUrl: kinnowImg,
  },
  {
    id: "6",
    title: "Modern Furniture Collection",
    category: "Furniture",
    description: "Contemporary wooden furniture for home and office. Crafted with premium materials.",
    imageUrl: furnitureImg,
  },
];

export default function Home() {
  const handleRequestQuote = (productId: string) => {
    console.log("Quote requested for product:", productId);
  };

  return (
    <div>
      <HeroCarousel />

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Product Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of quality products, from agricultural machinery to 
              premium commodities, furniture, and building materials.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </section>

      <TrustIndicators />

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Discover our best-selling products trusted by businesses worldwide
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden sm:flex" data-testid="button-view-all-products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onRequestQuote={handleRequestQuote}
              />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products">
              <Button data-testid="button-view-all-products-mobile">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Partner with Punjab's Trusted Export Company
              </h2>
              <p className="text-muted-foreground mb-6">
                With over 14 years of experience in international trade, The Atlas Exports 
                has built a reputation for quality, reliability, and exceptional customer service. 
                We handle everything from sourcing to shipping, making your import process seamless.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Quality-assured products with certifications",
                  "Competitive pricing with flexible payment terms",
                  "End-to-end logistics support",
                  "Dedicated account manager for each client",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" data-testid="button-cta-contact">
                    Get in Touch
                  </Button>
                </Link>
                <Link href="/client-portal">
                  <Button size="lg" variant="outline" data-testid="button-cta-portal">
                    Visit Client Portal
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={marbleImg}
                alt="Quality products"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg hidden lg:block">
                <div className="text-4xl font-bold">14+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
