import { Globe, Package, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const indicators = [
  {
    icon: Award,
    value: '5+',
    label: 'Years Experience',
  },
  {
    icon: Globe,
    value: '10+',
    label: 'Countries Served',
  },
  {
    icon: Package,
    value: '5',
    label: 'Product Categories',
  },
];

export default function TrustIndicators() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC0yNHYyaC0yVjEwaDJ6TTEwIDM0djJoLTJ2LTJoMnptMC0yNHYyaC0yVjEwaDJ6TTM2IDUwVjQ4aDJ2MkgzNnptMC0yNFYyNGgyVjI2SDM2ek0xMCA1MFY0OGgyVjUwSDEwem0wLTI0VjI0aDJWMjZIMTB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          {indicators.map((item, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.08,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{ scale: 1.1, y: -5 }}
              data-testid={`indicator-${item.label
                .toLowerCase()
                .replace(' ', '-')}`}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08 + 0.1,
                  type: 'spring',
                  stiffness: 300,
                }}
                whileHover={{
                  scale: 1.2,
                  transition: { duration: 0.3 },
                }}
              >
                <item.icon className="h-12 w-12 mx-auto mb-4 opacity-90" />
              </motion.div>
              <motion.div
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.08 + 0.2,
                  type: 'spring',
                  stiffness: 300,
                }}
              >
                {item.value}
              </motion.div>
              <motion.div
                className="text-base md:text-lg opacity-90 font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.08 + 0.3 }}
              >
                {item.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
