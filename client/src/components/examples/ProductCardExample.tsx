import ProductCard from "../ProductCard";
import { ThemeProvider } from "@/contexts/ThemeContext";
import equipmentImg from "@assets/generated_images/hydraulic_disc_harrow_product.png";

export default function ProductCardExample() {
  return (
    <ThemeProvider>
      <div className="max-w-sm p-4">
        <ProductCard
          id="1"
          title="Hydraulic Disc Harrow"
          category="Agriculture Equipment"
          description="Heavy-duty disc harrow for efficient soil preparation. Suitable for 45-75 HP tractors."
          imageUrl={equipmentImg}
          onRequestQuote={(id) => console.log("Quote requested for:", id)}
        />
      </div>
    </ThemeProvider>
  );
}
