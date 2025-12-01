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
}

export interface SocialLinks {
  whatsapp: string;
  linkedin: string;
  instagram: string;
  facebook?: string;
  twitter?: string;
}

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  mission: string;
  vision: string;
  whyChooseUs: string;
  foundedYear: string;
  countriesServed: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  urgentText: string;
}

export interface SiteContent {
  companyInfo: CompanyInfo;
  socialLinks: SocialLinks;
  about: AboutContent;
  contact: ContactContent;
  heroSlides: HeroSlide[];
  updatedAt?: Timestamp;
}

// Default content
export const defaultContent: SiteContent = {
  companyInfo: {
    name: 'The Atlas Exports',
    tagline: 'Your Trusted Partner in Global Trade',
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
  },
  socialLinks: {
    whatsapp: 'https://wa.me/919876543210',
    linkedin: 'https://linkedin.com/company/theatlasexports',
    instagram: 'https://instagram.com/theatlasexports',
    facebook: '',
    twitter: '',
  },
  about: {
    heroTitle: 'About The Atlas Exports',
    heroSubtitle: 'Your Trusted Partner in Global Trade Since 2010',
    description: `The Atlas Exports is a premier B2B export company based in Punjab, India, specializing in agricultural equipment, agro commodities, furniture, marble & granite, and PVC/WPC products. Founded in 2010, we have grown to become one of the region's most trusted exporters, serving clients across 25+ countries.

Our headquarters in Ludhiana, the industrial hub of Punjab, gives us direct access to quality manufacturing facilities and agricultural produce. We work closely with farmers, manufacturers, and artisans to source the finest products that meet international quality standards.`,
    mission:
      'To bridge global markets with Punjab\'s finest products, delivering exceptional quality and value while fostering sustainable business relationships that benefit all stakeholders.',
    vision:
      'To become the most trusted name in agricultural and industrial exports from India, setting benchmarks for quality, reliability, and customer satisfaction in the international trade community.',
    whyChooseUs:
      'With over 14 years of experience in international trade, we offer quality-assured products, competitive pricing, end-to-end logistics support, and dedicated account managers for each client.',
    foundedYear: '2010',
    countriesServed: '25+',
  },
  contact: {
    title: 'Contact Us',
    subtitle:
      "Ready to discuss your export needs? Get in touch with our team and we'll respond within 24 hours.",
    urgentText:
      'For time-sensitive inquiries, call our direct line or message us on WhatsApp.',
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
          const data = docSnap.data() as SiteContent;
          // Merge with defaults to ensure all fields exist
          return {
            ...defaultContent,
            ...data,
            companyInfo: { ...defaultContent.companyInfo, ...data.companyInfo },
            socialLinks: { ...defaultContent.socialLinks, ...data.socialLinks },
            about: { ...defaultContent.about, ...data.about },
            contact: { ...defaultContent.contact, ...data.contact },
            heroSlides:
              data.heroSlides?.length > 0
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
      const queryClient = updateContent.mutateAsync;
      // This will be handled by the parent hook
      return updateContent.mutateAsync({ companyInfo: companyInfo as CompanyInfo });
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

