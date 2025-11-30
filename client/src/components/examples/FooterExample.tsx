import Footer from "../Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function FooterExample() {
  return (
    <ThemeProvider>
      <Footer />
    </ThemeProvider>
  );
}
