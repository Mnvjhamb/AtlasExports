import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import ClientCard from "@/components/ClientCard";
import ContactForm from "@/components/ContactForm";
import { SiWhatsapp, SiLinkedin, SiInstagram } from "react-icons/si";
import { Mail, Phone, MapPin, ArrowDown } from "lucide-react";

import heroImg from "@assets/generated_images/punjab_agricultural_fields_landscape.png";

// todo: remove mock functionality - replace with API data
const clients = [
  { name: "AgriTech Solutions", country: "United Arab Emirates" },
  { name: "Global Harvest Co.", country: "United Kingdom" },
  { name: "FarmPro Industries", country: "Australia" },
  { name: "Golden Grain Trading", country: "Saudi Arabia" },
  { name: "Pacific Agriculture", country: "Singapore" },
  { name: "Euro Agri Imports", country: "Germany" },
  { name: "AfriTrade LLC", country: "South Africa" },
  { name: "Canadian Farm Supplies", country: "Canada" },
];

// todo: remove mock functionality - replace with API data
const reviews = [
  {
    name: "Ahmed Al-Rashid",
    company: "AgriTech Solutions, UAE",
    rating: 5,
    comment: "Outstanding quality equipment and exceptional service. The Atlas Exports has been our trusted partner for 3 years now. Their team is professional and delivery is always on time.",
  },
  {
    name: "Sarah Thompson",
    company: "Global Harvest Co., UK",
    rating: 5,
    comment: "The basmati rice quality is consistently excellent. They understand our requirements perfectly and the packaging meets all UK import standards.",
  },
  {
    name: "Michael Chen",
    company: "Pacific Agriculture, Singapore",
    rating: 4,
    comment: "Great range of agricultural equipment at competitive prices. Their team is responsive and handles documentation efficiently.",
  },
];

// todo: remove mock functionality - replace with CMS content
const socialLinks = [
  { icon: SiWhatsapp, href: "https://wa.me/919876543210", label: "WhatsApp", color: "hover:text-green-500" },
  { icon: SiLinkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-blue-600" },
  { icon: SiInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-500" },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function ClientPortal() {
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
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Client Portal</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Connect with us, share your experience, and explore our trusted 
              network of global partners.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20"
                onClick={() => scrollToSection("clients")}
                data-testid="button-scroll-clients"
              >
                Our Clients
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20"
                onClick={() => scrollToSection("reviews")}
                data-testid="button-scroll-reviews"
              >
                Reviews
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20"
                onClick={() => scrollToSection("contact")}
                data-testid="button-scroll-contact"
              >
                Contact
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="clients" className="py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Trusted Clients</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're proud to partner with leading businesses across the globe. 
              Here are some of the companies that trust The Atlas Exports.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {clients.map((client, index) => (
              <ClientCard key={index} {...client} />
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-16 bg-card border-t border-b border-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear what our clients have to say about working with us
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <ReviewCard key={index} {...review} />
              ))}
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ReviewForm />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions or want to start a partnership? Reach out to us through 
              any of the channels below.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Address</div>
                        <div className="text-sm text-muted-foreground">
                          Industrial Area, Ludhiana<br />
                          Punjab 141003, India
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">+91 98765 43210</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">info@theatlasexports.com</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Connect With Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Follow us on social media for updates and industry insights.
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`link-portal-${social.label.toLowerCase()}`}
                      >
                        <Button variant="outline" size="icon" className={social.color}>
                          <social.icon className="h-5 w-5" />
                        </Button>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Monday - Saturday: 9:00 AM - 6:00 PM IST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
