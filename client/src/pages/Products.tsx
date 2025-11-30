import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContactForm from "@/components/ContactForm";
import { Package, Filter } from "lucide-react";

import equipmentImg from "@assets/generated_images/hydraulic_disc_harrow_product.png";
import riceImg from "@assets/generated_images/premium_basmati_rice_grains.png";
import furnitureImg from "@assets/generated_images/modern_wooden_furniture.png";
import marbleImg from "@assets/generated_images/marble_granite_stone_slabs.png";
import cultivatorImg from "@assets/generated_images/farm_cultivator_equipment.png";
import discPloughImg from "@assets/generated_images/disc_plough_equipment.png";
import kinnowImg from "@assets/generated_images/fresh_kinnow_citrus_fruits.png";

// todo: remove mock functionality - replace with API data
const categories = [
  { id: "all", name: "All Categories" },
  { id: "agri-equipment", name: "Agriculture Equipment" },
  { id: "agri-commodities", name: "Agriculture Commodities" },
  { id: "furniture", name: "Furniture" },
  { id: "marble-granite", name: "Marble & Granite" },
  { id: "pvc-wpc", name: "PVC & WPC Sheets" },
];

// todo: remove mock functionality - replace with API data
const allProducts = [
  { id: "1", title: "Hydraulic Disc Harrow", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "Heavy-duty disc harrow for efficient soil preparation. Suitable for 45-75 HP tractors.", imageUrl: equipmentImg },
  { id: "2", title: "Cultivator", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "9-tyne spring loaded cultivator for deep tillage. Robust construction for heavy use.", imageUrl: cultivatorImg },
  { id: "3", title: "Chisel Plough", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "Heavy-duty chisel plough for breaking hard pans. 7-9 tynes for optimal performance.", imageUrl: discPloughImg },
  { id: "4", title: "Disc Plough", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "3-disc heavy-duty plough for primary tillage. Ideal for tough and hard soils.", imageUrl: discPloughImg },
  { id: "5", title: "Mould Board Plough", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "Traditional mould board plough for inverting soil. Available in 2-4 bottom variants.", imageUrl: equipmentImg },
  { id: "6", title: "Reversible Mould Board Plough", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "Advanced reversible design for efficient field coverage. Hydraulic reversing mechanism.", imageUrl: equipmentImg },
  { id: "7", title: "Laser Land Leveler", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "Precision laser-guided land leveling system. Improves irrigation efficiency by 30%.", imageUrl: cultivatorImg },
  { id: "8", title: "Water Tank", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "Agricultural water tanks in various capacities. Durable construction with UV protection.", imageUrl: marbleImg },
  { id: "9", title: "Hydraulic Trailer", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "Heavy-duty hydraulic tipping trailers. 4-12 ton capacity options available.", imageUrl: equipmentImg },
  { id: "10", title: "Rotavator", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "Multi-speed rotary tiller for seedbed preparation. 36-84 blades configuration.", imageUrl: cultivatorImg },
  { id: "11", title: "Ditcher", category: "agri-equipment", categoryLabel: "Agriculture Equipment", description: "Tractor-mounted ditcher for drainage channels. Adjustable depth and width.", imageUrl: discPloughImg },
  { id: "12", title: "Premium Basmati Rice", category: "agri-commodities", categoryLabel: "Agriculture Commodities", description: "Extra-long grain premium basmati rice. Aged for 2 years for perfect aroma and taste.", imageUrl: riceImg },
  { id: "13", title: "Non-Basmati Rice", category: "agri-commodities", categoryLabel: "Agriculture Commodities", description: "High-quality non-basmati rice varieties. IR-64, Swarna, and Sona Masuri available.", imageUrl: riceImg },
  { id: "14", title: "Fresh Kinnow", category: "agri-commodities", categoryLabel: "Agriculture Commodities", description: "Premium quality Punjab Kinnow mandarins. Sweet, juicy, and perfect for export.", imageUrl: kinnowImg },
  { id: "15", title: "Indian Spices", category: "agri-commodities", categoryLabel: "Agriculture Commodities", description: "Premium quality spices including turmeric, cumin, coriander, and red chili.", imageUrl: kinnowImg },
  { id: "16", title: "Chickpeas", category: "agri-commodities", categoryLabel: "Agriculture Commodities", description: "Desi and Kabuli chickpeas. Clean, sorted, and export-grade quality.", imageUrl: riceImg },
  { id: "17", title: "Jaggery", category: "agri-commodities", categoryLabel: "Agriculture Commodities", description: "Pure sugarcane jaggery. Available in blocks, powder, and liquid forms.", imageUrl: kinnowImg },
  { id: "18", title: "Sugar", category: "agri-commodities", categoryLabel: "Agriculture Commodities", description: "Refined white sugar and raw sugar. ICUMSA 45-150 grades available.", imageUrl: riceImg },
  { id: "19", title: "Cotton", category: "agri-commodities", categoryLabel: "Agriculture Commodities", description: "Premium quality cotton bales. Long staple and medium staple varieties.", imageUrl: marbleImg },
  { id: "20", title: "Modern Dining Set", category: "furniture", categoryLabel: "Furniture", description: "Contemporary 6-seater dining set. Solid wood with modern finish.", imageUrl: furnitureImg },
  { id: "21", title: "Office Furniture Collection", category: "furniture", categoryLabel: "Furniture", description: "Complete office furniture solutions. Desks, chairs, and storage units.", imageUrl: furnitureImg },
  { id: "22", title: "Bedroom Furniture Set", category: "furniture", categoryLabel: "Furniture", description: "Elegant bedroom set including bed, wardrobes, and side tables.", imageUrl: furnitureImg },
  { id: "23", title: "Italian Marble Slabs", category: "marble-granite", categoryLabel: "Marble & Granite", description: "Premium imported Italian marble. Carrara, Statuario, and Calacatta varieties.", imageUrl: marbleImg },
  { id: "24", title: "Black Galaxy Granite", category: "marble-granite", categoryLabel: "Marble & Granite", description: "Premium black granite with golden flecks. Perfect for countertops and flooring.", imageUrl: marbleImg },
  { id: "25", title: "Rajasthani Marble", category: "marble-granite", categoryLabel: "Marble & Granite", description: "High-quality Indian marble from Rajasthan. Makrana white and green varieties.", imageUrl: marbleImg },
  { id: "26", title: "PVC Wall Panels", category: "pvc-wpc", categoryLabel: "PVC & WPC Sheets", description: "Decorative PVC panels for interior walls. Waterproof and easy to install.", imageUrl: marbleImg },
  { id: "27", title: "WPC Door Frames", category: "pvc-wpc", categoryLabel: "PVC & WPC Sheets", description: "Wood Plastic Composite door frames. Termite-proof and weather-resistant.", imageUrl: marbleImg },
  { id: "28", title: "PVC Ceiling Sheets", category: "pvc-wpc", categoryLabel: "PVC & WPC Sheets", description: "Lightweight PVC ceiling panels. Various designs and finishes available.", imageUrl: marbleImg },
];

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialCategory = searchParams.get("category") || "all";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return allProducts;
    return allProducts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const selectedProductName = quoteProduct
    ? allProducts.find((p) => p.id === quoteProduct)?.title
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            Browse our complete catalog of quality products for export
          </p>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{filteredProducts.length} products</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                category={product.categoryLabel}
                description={product.description}
                imageUrl={product.imageUrl}
                onRequestQuote={setQuoteProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try selecting a different category
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory("all")}
              data-testid="button-reset-filter"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!quoteProduct} onOpenChange={() => setQuoteProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Quote</DialogTitle>
          </DialogHeader>
          <ContactForm productName={selectedProductName} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
