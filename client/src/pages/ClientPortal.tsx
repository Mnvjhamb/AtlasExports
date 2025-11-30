import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ContactForm from '@/components/ContactForm';
import { SiWhatsapp, SiLinkedin, SiInstagram } from 'react-icons/si';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Star,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useSiteContent } from '@/hooks/useContent';

import heroImg from '@assets/generated_images/punjab_agricultural_fields_landscape.png';

const portalFeatures = [
  {
    icon: Users,
    title: 'Our Clients',
    description:
      'View our trusted network of global partners on the homepage.',
    link: '/#clients',
    linkText: 'View on Homepage',
  },
  {
    icon: Star,
    title: 'Reviews & Testimonials',
    description: 'Read what our clients say and share your own experience.',
    link: '/reviews',
    linkText: 'View Reviews',
  },
  {
    icon: MessageSquare,
    title: 'Get in Touch',
    description: 'Have questions? Contact us directly through the form below.',
    link: '#contact',
    linkText: 'Contact Form',
  },
];

export default function ClientPortal() {
  const { data: content, isLoading } = useSiteContent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-[50vh] w-full" />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Skeleton className="h-8 w-48 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  const clientPortal = content?.clientPortal;
  const companyInfo = content?.companyInfo;
  const socialLinks = content?.socialLinks;

  const socialItems = [
    {
      icon: SiWhatsapp,
      href: socialLinks?.whatsapp || '',
      label: 'WhatsApp',
      color: 'hover:text-green-500',
    },
    {
      icon: SiLinkedin,
      href: socialLinks?.linkedin || '',
      label: 'LinkedIn',
      color: 'hover:text-blue-600',
    },
    {
      icon: SiInstagram,
      href: socialLinks?.instagram || '',
      label: 'Instagram',
      color: 'hover:text-pink-500',
    },
  ].filter((s) => s.href);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={heroImg}
          alt="Client Portal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {clientPortal?.heroTitle || 'Client Portal'}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {clientPortal?.heroSubtitle ||
                `Connect with us, explore our client network, and share your experience working with ${companyInfo?.name || 'The Atlas Exports'}.`}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              {clientPortal?.quickLinksTitle || 'Quick Links'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {clientPortal?.quickLinksSubtitle ||
                'Explore client resources and connect with our team'}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {portalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">
                      {feature.description}
                    </p>
                    <Link href={feature.link}>
                      <Button variant="outline" className="w-full">
                        {feature.linkText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="py-16 bg-card border-t border-border scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              {clientPortal?.contactTitle || 'Get in Touch'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {clientPortal?.contactSubtitle ||
                'Have questions or want to start a partnership? Reach out to us through any of the channels below.'}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ContactForm />
            </motion.div>
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Address</div>
                        <div className="text-sm text-muted-foreground">
                          {companyInfo?.address || 'Industrial Area'},{' '}
                          {companyInfo?.city || 'Ludhiana'}
                          <br />
                          {companyInfo?.state || 'Punjab'}{' '}
                          {companyInfo?.postalCode || '141003'},{' '}
                          {companyInfo?.country || 'India'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">
                          {companyInfo?.phone || '+91 98765 43210'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">
                          {companyInfo?.email || 'info@theatlasexports.com'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {socialItems.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Connect With Us</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Follow us on social media for updates and industry
                      insights.
                    </p>
                    <div className="flex gap-3">
                      {socialItems.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`link-portal-${social.label.toLowerCase()}`}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className={social.color}
                          >
                            <social.icon className="h-5 w-5" />
                          </Button>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      {companyInfo?.businessDays || 'Monday - Saturday'}:{' '}
                      {companyInfo?.businessHours || '9:00 AM - 6:00 PM IST'}
                    </p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
