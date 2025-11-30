import ContactForm from "@/components/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiWhatsapp, SiLinkedin, SiInstagram } from "react-icons/si";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

// todo: remove mock functionality - replace with CMS content
const socialLinks = [
  { icon: SiWhatsapp, href: "https://wa.me/919876543210", label: "WhatsApp" },
  { icon: SiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Ready to discuss your export needs? Get in touch with our team and 
            we'll respond within 24 hours.
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
                        Plot No. 123, Industrial Area<br />
                        Ludhiana, Punjab 141003<br />
                        India
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
                        +91 98765 43210<br />
                        +91 98765 43211
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
                        info@theatlasexports.com<br />
                        sales@theatlasexports.com
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
                        Monday - Saturday<br />
                        9:00 AM - 6:00 PM IST
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Quick Connect</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Prefer instant messaging? Connect with us on your favorite platform.
                </p>
                <div className="space-y-3">
                  {socialLinks.map((social) => (
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

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Need Urgent Assistance?</h3>
                <p className="text-sm opacity-90 mb-4">
                  For time-sensitive inquiries, call our direct line or message us on WhatsApp.
                </p>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="w-full" data-testid="button-urgent-whatsapp">
                    <SiWhatsapp className="h-5 w-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
