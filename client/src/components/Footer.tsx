import { Link } from 'wouter';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { SiWhatsapp, SiLinkedin, SiInstagram, SiFacebook } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiteContent } from '@/hooks/useContent';
import { useCategories } from '@/hooks/useProducts';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const { data: content, isLoading: contentLoading } = useSiteContent();
  const { data: categories, isLoading: categoriesLoading } = useCategories(true);

  const companyInfo = content?.companyInfo;
  const socialLinks = content?.socialLinks;
  const footer = content?.footer;

  // Build social links array from content
  const socialItems = [
    {
      icon: SiWhatsapp,
      href: socialLinks?.whatsapp || '',
      label: 'WhatsApp',
    },
    {
      icon: SiLinkedin,
      href: socialLinks?.linkedin || '',
      label: 'LinkedIn',
    },
    {
      icon: SiInstagram,
      href: socialLinks?.instagram || '',
      label: 'Instagram',
    },
    {
      icon: SiFacebook,
      href: socialLinks?.facebook || '',
      label: 'Facebook',
    },
  ].filter((s) => s.href);

  // Get category names for products section
  const categoryNames = categories?.slice(0, 5).map((c) => c.name) || [];

  if (contentLoading) {
    return (
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-bold text-lg">
                  {companyInfo?.name || 'The Atlas Exports'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {companyInfo?.city || 'Ludhiana'},{' '}
                  {companyInfo?.country || 'India'}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {footer?.description ||
                companyInfo?.description ||
                'Your trusted partner for premium agricultural equipment and commodities. Exporting quality products from Punjab to the world.'}
            </p>
            {socialItems.length > 0 && (
              <div className="flex gap-2">
                {socialItems.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                  >
                    <Button variant="outline" size="icon">
                      <social.icon className="h-4 w-4" />
                    </Button>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              {categoriesLoading ? (
                [...Array(5)].map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-4 w-24" />
                  </li>
                ))
              ) : categoryNames.length > 0 ? (
                categoryNames.map((category) => (
                  <li key={category}>
                    <Link
                      href="/products"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {category}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">
                  No categories yet
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  {companyInfo?.address || 'Industrial Area'},{' '}
                  {companyInfo?.city || 'Ludhiana'},{' '}
                  {companyInfo?.state || 'Punjab'}{' '}
                  {companyInfo?.postalCode || '141003'},{' '}
                  {companyInfo?.country || 'India'}
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{companyInfo?.phone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{companyInfo?.email || 'info@theatlasexports.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {companyInfo?.name || 'The Atlas Exports'}.{' '}
            {footer?.copyrightText || 'All rights reserved.'}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
