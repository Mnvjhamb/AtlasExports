import { useState } from "react";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContactForm from "@/components/ContactForm";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft, Package } from "lucide-react";

import equipmentImg from "@assets/generated_images/hydraulic_disc_harrow_product.png";
import cultivatorImg from "@assets/generated_images/farm_cultivator_equipment.png";
import discPloughImg from "@assets/generated_images/disc_plough_equipment.png";

// todo: remove mock functionality - replace with API data
const productData: Record<string, {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  specifications: Record<string, string>;
}> = {
  "1": {
    id: "1",
    title: "Hydraulic Disc Harrow",
    category: "Agriculture Equipment",
    description: "Our Hydraulic Disc Harrow is a premium quality agricultural implement designed for efficient soil preparation. It features heavy-duty construction with high-carbon steel discs that provide excellent cutting and mixing action. The hydraulic system allows for easy depth adjustment and transport positioning. Ideal for both primary and secondary tillage operations, this harrow effectively breaks up clods, incorporates crop residue, and creates a smooth seedbed. Built to withstand the rigors of heavy farming use while delivering consistent performance season after season.",
    images: [equipmentImg, cultivatorImg, discPloughImg],
    specifications: {
      "Working Width": "2.0 - 3.5 meters",
      "Number of Discs": "16 - 28 discs",
      "Disc Diameter": "560 mm (22 inches)",
      "Weight": "800 - 1500 kg",
      "Required HP": "45 - 75 HP",
      "Frame Type": "Heavy-duty tubular steel",
      "Disc Spacing": "230 mm",
      "Transport Width": "2.5 meters",
      "Warranty": "2 years manufacturing defects",
    },
  },
};

// todo: remove mock functionality - replace with API data
const relatedProducts = [
  { id: "2", title: "Cultivator", category: "Agriculture Equipment", description: "9-tyne spring loaded cultivator for deep tillage.", imageUrl: cultivatorImg },
  { id: "4", title: "Disc Plough", category: "Agriculture Equipment", description: "3-disc heavy-duty plough for primary tillage.", imageUrl: discPloughImg },
  { id: "10", title: "Rotavator", category: "Agriculture Equipment", description: "Multi-speed rotary tiller for seedbed preparation.", imageUrl: cultivatorImg },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const product = productData[id || "1"] || productData["1"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/products">
          <Button variant="ghost" className="mb-6" data-testid="button-back-products">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === selectedImage
                      ? "border-primary"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  data-testid={`button-image-${index}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Badge className="mb-3">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-muted-foreground mb-6">{product.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => setShowQuoteForm(true)}
                data-testid="button-request-quote"
              >
                Request Quote
              </Button>
              <Link href="/contact" className="flex-1">
                <Button size="lg" variant="outline" className="w-full" data-testid="button-contact-us">
                  Contact Us
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div
                      key={key}
                      className={`flex justify-between py-2 ${
                        index !== Object.entries(product.specifications).length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                {...prod}
                onRequestQuote={() => setShowQuoteForm(true)}
              />
            ))}
          </div>
        </section>
      </div>

      <Dialog open={showQuoteForm} onOpenChange={setShowQuoteForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Quote for {product.title}</DialogTitle>
          </DialogHeader>
          <ContactForm productName={product.title} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
