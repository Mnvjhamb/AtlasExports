import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import TrustIndicators from '@/components/TrustIndicators';
import {
  Target,
  Eye,
  Award,
  Users,
  CheckCircle,
  Shield,
  Truck,
  HeartHandshake,
  Globe,
  Zap,
  ThumbsUp,
} from 'lucide-react';
import { useSiteContent } from '@/hooks/useContent';

import heroImg from '@assets/generated_images/business_partnership_handshake.png';
import warehouseImg from '@assets/generated_images/export_warehouse_shipping_containers.png';

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ElementType> = {
  Award,
  Users,
  CheckCircle,
  Target,
  Shield,
  Truck,
  HeartHandshake,
  Globe,
  Zap,
  ThumbsUp,
  Eye,
};

export default function About() {
  const { data: content, isLoading } = useSiteContent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-[40vh] w-full" />
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const about = content?.about;
  const companyInfo = content?.companyInfo;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img
          src={heroImg}
          alt="About The Atlas Exports"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {about?.heroTitle || 'About The Atlas Exports'}
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              {about?.heroSubtitle ||
                `${
                  companyInfo?.tagline || 'Your Trusted Partner in Global Trade'
                } Since ${companyInfo?.foundedYear || '2010'}`}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
              <div className="prose prose-lg text-muted-foreground">
                {(about?.description || '').split('\n\n').map((para, i) => (
                  <p
                    key={i}
                    className="mb-4"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <img
                src={warehouseImg}
                alt="Our facilities"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-muted-foreground">{about?.mission}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-muted-foreground">{about?.vision}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TrustIndicators />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {about?.whyChooseUsTitle || 'Why Choose Us'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {about?.whyChooseUsSubtitle ||
                'We go above and beyond to ensure your satisfaction with every order'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(about?.whyChooseUsItems || []).map((item) => {
              const Icon = iconMap[item.icon] || Award;
              return (
                <Card
                  key={item.id}
                  className="text-center"
                >
                  <CardContent className="p-6">
                    <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {about?.teamTitle || 'Our Leadership'}
            </h2>
            <p className="text-muted-foreground">
              {about?.teamSubtitle ||
                'Meet the team driving our vision forward'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
            {(about?.teamMembers || []).map((member) => (
              <div
                key={member.id}
                className="text-center flex-shrink-0"
                style={{ minWidth: '200px' }}
              >
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  {member.imageUrl && (
                    <AvatarImage
                      src={member.imageUrl}
                      alt={member.name}
                    />
                  )}
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {about?.ctaTitle || 'Ready to Partner with Us?'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {about?.ctaSubtitle ||
              `Join hundreds of satisfied clients worldwide who trust ${
                companyInfo?.name || 'The Atlas Exports'
              } for their sourcing needs.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button
                size="lg"
                data-testid="button-about-contact"
              >
                Get in Touch
              </Button>
            </Link>
            <Link to="/products">
              <Button
                size="lg"
                variant="outline"
                data-testid="button-about-products"
              >
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
