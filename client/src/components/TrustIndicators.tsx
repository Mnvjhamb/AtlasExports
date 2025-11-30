import { Globe, Package, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

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
    <section className="py-16 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {indicators.map((item, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              data-testid={`indicator-${item.label.toLowerCase().replace(" ", "-")}`}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
              >
                <item.icon className="h-10 w-10 mx-auto mb-3 opacity-90" />
              </motion.div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{item.value}</div>
              <div className="text-sm opacity-80">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
