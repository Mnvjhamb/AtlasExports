import CategoryCard from "../CategoryCard";
import { ThemeProvider } from "@/contexts/ThemeContext";
import equipmentImg from "@assets/generated_images/hydraulic_disc_harrow_product.png";

export default function CategoryCardExample() {
  return (
    <ThemeProvider>
      <div className="max-w-sm p-4">
        <CategoryCard
          id="agri-equipment"
          name="Agriculture Equipment"
          imageUrl={equipmentImg}
          productCount={12}
        />
      </div>
    </ThemeProvider>
  );
}
