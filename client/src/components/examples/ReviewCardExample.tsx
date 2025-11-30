import ReviewCard from "../ReviewCard";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function ReviewCardExample() {
  return (
    <ThemeProvider>
      <div className="max-w-md p-4">
        <ReviewCard
          name="Ahmed Al-Rashid"
          company="AgriTech Solutions, UAE"
          rating={5}
          comment="Outstanding quality equipment and exceptional service. The Atlas Exports has been our trusted partner for 3 years now."
        />
      </div>
    </ThemeProvider>
  );
}
