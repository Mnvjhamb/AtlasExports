import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '@/hooks/useContent';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: content } = useSiteContent();

  const companyInfo = content?.companyInfo;

  return (
    <nav className="sticky top-0 z-50 bg-background/98 backdrop-blur-lg supports-[backdrop-filter]:bg-background/90 border-b border-border/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="flex items-center gap-3"
            data-testid="link-home-logo"
          >
            {companyInfo?.logoUrl ? (
              <motion.img
                src={companyInfo.logoUrl}
                alt={companyInfo?.name || 'Logo'}
                className="h-16 w-16 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Globe className="h-14 w-14 text-primary" />
              </motion.div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-2xl leading-tight">
                {companyInfo?.name || 'The Atlas Exports'}
              </span>
              <span className="text-sm text-muted-foreground">
                {companyInfo?.city || 'Punjab'},{' '}
                {companyInfo?.country || 'India'}
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
              >
                <Button
                  variant={
                    location.pathname === link.href ? 'secondary' : 'ghost'
                  }
                  className="text-sm relative"
                  data-testid={`link-nav-${link.label
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="navbar-indicator"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="hidden md:block"
            >
              <Button
                variant="outline"
                size="sm"
                data-testid="link-admin-portal"
              >
                Admin
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-border bg-background"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={link.href}>
                    <Button
                      variant={
                        location.pathname === link.href ? 'secondary' : 'ghost'
                      }
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`link-mobile-${link.label
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {link.label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <Link to="/admin">
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-admin"
                  >
                    Admin Portal
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
