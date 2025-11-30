import Navbar from "../Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function NavbarExample() {
  return (
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
}
