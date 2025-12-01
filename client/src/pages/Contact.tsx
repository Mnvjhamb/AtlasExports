import ContactForm from '@/components/ContactForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SiWhatsapp, SiLinkedin, SiInstagram } from 'react-icons/si';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useSiteContent } from '@/hooks/useContent';

export default function Contact() {
  const { data: content, isLoading } = useSiteContent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4">
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div>
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const companyInfo = content?.companyInfo;
  const socialLinks = content?.socialLinks;
  const contactContent = content?.contact;

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
  ].filter((s) => s.href);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {contactContent?.title || 'Contact Us'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {contactContent?.subtitle ||
              "Ready to discuss your export needs? Get in touch with our team and we'll respond within 24 hours."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Contact Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Head Office</div>
                      <div className="text-sm text-muted-foreground">
                        {companyInfo?.address || 'Plot No. 123, Industrial Area'}
                        <br />
                        {companyInfo?.city || 'Ludhiana'},{' '}
                        {companyInfo?.state || 'Punjab'}{' '}
                        {companyInfo?.postalCode || '141003'}
                        <br />
                        {companyInfo?.country || 'India'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">
                        {companyInfo?.phone || '+91 98765 43210'}
                        {companyInfo?.phone2 && (
                          <>
                            <br />
                            {companyInfo.phone2}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">
                        {companyInfo?.email || 'info@theatlasexports.com'}
                        {companyInfo?.salesEmail && (
                          <>
                            <br />
                            {companyInfo.salesEmail}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Business Hours</div>
                      <div className="text-sm text-muted-foreground">
                        {companyInfo?.businessDays || 'Monday - Saturday'}
                        <br />
                        {companyInfo?.businessHours || '9:00 AM - 6:00 PM IST'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {socialItems.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Quick Connect</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Prefer instant messaging? Connect with us on your favorite
                    platform.
                  </p>
                  <div className="space-y-3">
                    {socialItems.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        data-testid={`link-contact-${social.label.toLowerCase()}`}
                      >
                        <Button variant="outline" className="w-full justify-start">
                          <social.icon className="h-5 w-5 mr-3" />
                          {social.label}
                        </Button>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  {contactContent?.urgentTitle || 'Need Urgent Assistance?'}
                </h3>
                <p className="text-sm opacity-90 mb-4">
                  {contactContent?.urgentText ||
                    'For time-sensitive inquiries, call our direct line or message us on WhatsApp.'}
                </p>
                {socialLinks?.whatsapp && (
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="secondary"
                      className="w-full"
                      data-testid="button-urgent-whatsapp"
                    >
                      <SiWhatsapp className="h-5 w-5 mr-2" />
                      Chat on WhatsApp
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
