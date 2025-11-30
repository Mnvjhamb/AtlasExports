import { Globe, Package, Users, Award } from "lucide-react";

const indicators = [
  {
    icon: Award,
    value: "14+",
    label: "Years Experience",
  },
  {
    icon: Globe,
    value: "25+",
    label: "Countries Served",
  },
  {
    icon: Package,
    value: "5",
    label: "Product Categories",
  },
  {
    icon: Users,
    value: "500+",
    label: "Happy Clients",
  },
];

export default function TrustIndicators() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {indicators.map((item, index) => (
            <div
              key={index}
              className="text-center"
              data-testid={`indicator-${item.label.toLowerCase().replace(" ", "-")}`}
            >
              <item.icon className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <div className="text-3xl md:text-4xl font-bold mb-1">{item.value}</div>
              <div className="text-sm opacity-80">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
