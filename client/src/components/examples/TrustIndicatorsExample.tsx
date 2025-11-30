import TrustIndicators from "../TrustIndicators";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function TrustIndicatorsExample() {
  return (
    <ThemeProvider>
      <TrustIndicators />
    </ThemeProvider>
  );
}
