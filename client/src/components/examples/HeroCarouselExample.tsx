import HeroCarousel from "../HeroCarousel";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function HeroCarouselExample() {
  return (
    <ThemeProvider>
      <HeroCarousel />
    </ThemeProvider>
  );
}
