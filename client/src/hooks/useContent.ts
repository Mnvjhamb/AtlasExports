import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore';

// ============ Content Types ============

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  order: number;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  phone: string;
  phone2?: string;
  email: string;
  salesEmail?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  businessHours: string;
  businessDays: string;
  foundedYear: string;
  countriesServed: string;
}

export interface SocialLinks {
  whatsapp: string;
  linkedin: string;
  instagram: string;
  facebook?: string;
  twitter?: string;
}

// Home page sections
export interface HomeSections {
  categoriesTitle: string;
  categoriesSubtitle: string;
  featuredProductsTitle: string;
  featuredProductsSubtitle: string;
  clientsTitle: string;
  clientsSubtitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaFeatures: string[];
  ctaBadgeNumber: string;
  ctaBadgeText: string;
}

// About page content
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface WhyChooseUsItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  mission: string;
  vision: string;
  whyChooseUsTitle: string;
  whyChooseUsSubtitle: string;
  whyChooseUsItems: WhyChooseUsItem[];
  teamTitle: string;
  teamSubtitle: string;
  teamMembers: TeamMember[];
  ctaTitle: string;
  ctaSubtitle: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  urgentTitle: string;
  urgentText: string;
}

export interface FooterContent {
  description: string;
  copyrightText: string;
}

export interface SiteContent {
  companyInfo: CompanyInfo;
  socialLinks: SocialLinks;
  home: HomeSections;
  about: AboutContent;
  contact: ContactContent;
  footer: FooterContent;
  heroSlides: HeroSlide[];
  updatedAt?: Timestamp;
}

// Default content
export const defaultContent: SiteContent = {
  companyInfo: {
    name: 'The Atlas Exports',
    tagline: 'Your Trusted Partner in Global Trade',
    description:
      'Your trusted partner for premium agricultural equipment and commodities. Exporting quality products from Punjab to the world.',
    logoUrl: '',
    phone: '+91 98765 43210',
    phone2: '+91 98765 43211',
    email: 'info@theatlasexports.com',
    salesEmail: 'sales@theatlasexports.com',
    address: 'Plot No. 123, Industrial Area',
    city: 'Ludhiana',
    state: 'Punjab',
    country: 'India',
    postalCode: '141003',
    businessHours: '9:00 AM - 6:00 PM IST',
    businessDays: 'Monday - Saturday',
    foundedYear: '2010',
    countriesServed: '25+',
  },
  socialLinks: {
    whatsapp: 'https://wa.me/919876543210',
    linkedin: 'https://linkedin.com/company/theatlasexports',
    instagram: 'https://instagram.com/theatlasexports',
    facebook: '',
    twitter: '',
  },
  home: {
    categoriesTitle: 'Our Product Categories',
    categoriesSubtitle:
      'Explore our diverse range of quality products, from agricultural machinery to premium commodities, furniture, and building materials.',
    featuredProductsTitle: 'Featured Products',
    featuredProductsSubtitle:
      'Discover our best-selling products trusted by businesses worldwide',
    clientsTitle: 'Our Trusted Clients',
    clientsSubtitle:
      "We're proud to partner with leading businesses across the globe. Here are some of the companies that trust The Atlas Exports.",
    ctaTitle: "Partner with Punjab's Trusted Export Company",
    ctaDescription:
      'With over 14 years of experience in international trade, The Atlas Exports has built a reputation for quality, reliability, and exceptional customer service. We handle everything from sourcing to shipping, making your import process seamless.',
    ctaFeatures: [
      'Quality-assured products with certifications',
      'Competitive pricing with flexible payment terms',
      'End-to-end logistics support',
      'Dedicated account manager for each client',
    ],
    ctaBadgeNumber: '14+',
    ctaBadgeText: 'Years of Excellence',
  },
  about: {
    heroTitle: 'About The Atlas Exports',
    heroSubtitle: 'Your Trusted Partner in Global Trade Since 2010',
    description: `The Atlas Exports is a premier B2B export company based in Punjab, India, specializing in agricultural equipment, agro commodities, furniture, marble & granite, and PVC/WPC products. Founded in 2010, we have grown to become one of the region's most trusted exporters, serving clients across 25+ countries.

Our headquarters in Ludhiana, the industrial hub of Punjab, gives us direct access to quality manufacturing facilities and agricultural produce. We work closely with farmers, manufacturers, and artisans to source the finest products that meet international quality standards.`,
    mission:
      "To bridge global markets with Punjab's finest products, delivering exceptional quality and value while fostering sustainable business relationships that benefit all stakeholders.",
    vision:
      'To become the most trusted name in agricultural and industrial exports from India, setting benchmarks for quality, reliability, and customer satisfaction in the international trade community.',
    whyChooseUsTitle: 'Why Choose Us',
    whyChooseUsSubtitle:
      'We go above and beyond to ensure your satisfaction with every order',
    whyChooseUsItems: [
      {
        id: '1',
        icon: 'Award',
        title: 'Quality Assurance',
        description:
          'Every product undergoes rigorous quality checks before export. We hold ISO certifications and follow international standards.',
      },
      {
        id: '2',
        icon: 'Users',
        title: 'Dedicated Support',
        description:
          'Each client gets a dedicated account manager who understands your business needs and ensures smooth transactions.',
      },
      {
        id: '3',
        icon: 'CheckCircle',
        title: 'End-to-End Service',
        description:
          'From sourcing to shipping, documentation to delivery - we handle the complete export process for you.',
      },
      {
        id: '4',
        icon: 'Target',
        title: 'Competitive Pricing',
        description:
          'Direct manufacturer relationships and efficient operations allow us to offer the best prices without compromising quality.',
      },
    ],
    teamTitle: 'Our Leadership',
    teamSubtitle: 'Meet the team driving our vision forward',
    teamMembers: [
      {
        id: '1',
        name: 'Rajinder Singh',
        role: 'Founder & CEO',
        initials: 'RS',
      },
      {
        id: '2',
        name: 'Harpreet Kaur',
        role: 'Co-Founder & COO',
        initials: 'HK',
      },
      {
        id: '3',
        name: 'Amarjit Singh',
        role: 'Director, Operations',
        initials: 'AS',
      },
    ],
    ctaTitle: 'Ready to Partner with Us?',
    ctaSubtitle:
      'Join hundreds of satisfied clients worldwide who trust us for their sourcing needs.',
  },
  contact: {
    title: 'Contact Us',
    subtitle:
      "Ready to discuss your export needs? Get in touch with our team and we'll respond within 24 hours.",
    urgentTitle: 'Need Urgent Assistance?',
    urgentText:
      'For time-sensitive inquiries, call our direct line or message us on WhatsApp.',
  },
  footer: {
    description:
      'Your trusted partner for premium agricultural equipment and commodities. Exporting quality products from Punjab to the world.',
    copyrightText: 'All rights reserved.',
  },
  heroSlides: [
    {
      id: '1',
      title: 'Premium Exports from Punjab',
      subtitle:
        'Delivering quality agricultural equipment and commodities to the world',
      imageUrl: '',
      order: 1,
    },
    {
      id: '2',
      title: 'Global Logistics Excellence',
      subtitle: 'Efficient shipping and handling for all your export needs',
      imageUrl: '',
      order: 2,
    },
    {
      id: '3',
      title: 'Finest Basmati Rice',
      subtitle: 'Premium quality rice from the heartland of Punjab',
      imageUrl: '',
      order: 3,
    },
    {
      id: '4',
      title: 'Your Trusted Partner',
      subtitle: 'Building long-term relationships with businesses worldwide',
      imageUrl: '',
      order: 4,
    },
  ],
};

const CONTENT_DOC_ID = 'site-content';

// ============ Hooks ============

export function useSiteContent() {
  return useQuery({
    queryKey: ['site-content'],
    queryFn: async (): Promise<SiteContent> => {
      try {
        const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<SiteContent>;
          // Merge with defaults to ensure all fields exist
          return {
            ...defaultContent,
            ...data,
            companyInfo: { ...defaultContent.companyInfo, ...data.companyInfo },
            socialLinks: { ...defaultContent.socialLinks, ...data.socialLinks },
            home: { ...defaultContent.home, ...data.home },
            about: {
              ...defaultContent.about,
              ...data.about,
              whyChooseUsItems: data.about?.whyChooseUsItems?.length
                ? data.about.whyChooseUsItems
                : defaultContent.about.whyChooseUsItems,
              teamMembers: data.about?.teamMembers?.length
                ? data.about.teamMembers
                : defaultContent.about.teamMembers,
            },
            contact: { ...defaultContent.contact, ...data.contact },
            footer: { ...defaultContent.footer, ...data.footer },
            heroSlides:
              data.heroSlides && data.heroSlides.length > 0
                ? data.heroSlides
                : defaultContent.heroSlides,
          };
        }
        return defaultContent;
      } catch (error) {
        console.error('Error fetching site content:', error);
        return defaultContent;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useUpdateSiteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: Partial<SiteContent>) => {
      const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_DOC_ID);

      // Get existing content first
      const docSnap = await getDoc(docRef);
      const existingContent = docSnap.exists()
        ? (docSnap.data() as SiteContent)
        : defaultContent;

      // Merge with existing content
      const updatedContent: SiteContent = {
        ...existingContent,
        ...content,
        updatedAt: Timestamp.now(),
      };

      await setDoc(docRef, updatedContent);
      return updatedContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
    },
  });
}

// Specific section update hooks for convenience
export function useUpdateCompanyInfo() {
  const updateContent = useUpdateSiteContent();

  return useMutation({
    mutationFn: async (companyInfo: Partial<CompanyInfo>) => {
      return updateContent.mutateAsync({
        companyInfo: companyInfo as CompanyInfo,
      });
    },
  });
}

export function useUpdateHeroSlides() {
  const updateContent = useUpdateSiteContent();

  return useMutation({
    mutationFn: async (heroSlides: HeroSlide[]) => {
      return updateContent.mutateAsync({ heroSlides });
    },
  });
}
