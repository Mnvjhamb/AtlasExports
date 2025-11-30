import ClientCard from "../ClientCard";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function ClientCardExample() {
  return (
    <ThemeProvider>
      <div className="max-w-sm p-4">
        <ClientCard name="AgriTech Solutions" country="United Arab Emirates" />
      </div>
    </ThemeProvider>
  );
}
