import ContactForm from "../ContactForm";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";

export default function ContactFormExample() {
  return (
    <ThemeProvider>
      <div className="max-w-lg p-4">
        <ContactForm />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
