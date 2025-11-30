import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore';

interface DashboardStats {
  products: {
    total: number;
    active: number;
    featured: number;
  };
  categories: {
    total: number;
    active: number;
  };
  reviews: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    averageRating: number;
  };
  contacts: {
    total: number;
    unread: number;
    replied: number;
  };
  clients: {
    total: number;
    active: number;
  };
}

interface RecentContact {
  id: string;
  name: string;
  company: string;
  subject: string;
  isRead: boolean;
  createdAt: any;
}

interface RecentReview {
  id: string;
  clientName: string;
  company: string;
  rating: number;
  status: string;
  createdAt: any;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch all collections in parallel
      const [
        productsSnap,
        categoriesSnap,
        reviewsSnap,
        contactsSnap,
        clientsSnap,
      ] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.PRODUCTS)),
        getDocs(collection(db, COLLECTIONS.CATEGORIES)),
        getDocs(collection(db, COLLECTIONS.REVIEWS)),
        getDocs(collection(db, COLLECTIONS.CONTACTS)),
        getDocs(collection(db, COLLECTIONS.CLIENTS)),
      ]);

      // Process products
      const products = productsSnap.docs.map((d) => d.data());
      const activeProducts = products.filter((p) => p.isActive !== false);
      const featuredProducts = products.filter((p) => p.isFeatured === true);

      // Process categories
      const categories = categoriesSnap.docs.map((d) => d.data());
      const activeCategories = categories.filter((c) => c.isActive !== false);

      // Process reviews
      const reviews = reviewsSnap.docs.map((d) => d.data());
      const approvedReviews = reviews.filter(
        (r) => r.status === 'approved' || (r.isApproved === true && !r.status)
      );
      const pendingReviews = reviews.filter(
        (r) => r.status === 'pending' || (!r.status && !r.isApproved)
      );
      const rejectedReviews = reviews.filter((r) => r.status === 'rejected');
      const avgRating =
        approvedReviews.length > 0
          ? approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            approvedReviews.length
          : 0;

      // Process contacts
      const contacts = contactsSnap.docs.map((d) => d.data());
      const unreadContacts = contacts.filter((c) => !c.isRead);
      const repliedContacts = contacts.filter((c) => c.repliedAt);

      // Process clients
      const clients = clientsSnap.docs.map((d) => d.data());
      const activeClients = clients.filter((c) => c.isActive !== false);

      return {
        products: {
          total: products.length,
          active: activeProducts.length,
          featured: featuredProducts.length,
        },
        categories: {
          total: categories.length,
          active: activeCategories.length,
        },
        reviews: {
          total: reviews.length,
          approved: approvedReviews.length,
          pending: pendingReviews.length,
          rejected: rejectedReviews.length,
          averageRating: avgRating,
        },
        contacts: {
          total: contacts.length,
          unread: unreadContacts.length,
          replied: repliedContacts.length,
        },
        clients: {
          total: clients.length,
          active: activeClients.length,
        },
      };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useRecentContacts(count = 5) {
  return useQuery({
    queryKey: ['dashboard-recent-contacts', count],
    queryFn: async (): Promise<RecentContact[]> => {
      const ref = collection(db, COLLECTIONS.CONTACTS);
      const snapshot = await getDocs(ref);

      const contacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || 'Unknown',
        company: doc.data().company || '',
        subject: doc.data().subject || '',
        isRead: doc.data().isRead || false,
        createdAt: doc.data().createdAt,
      }));

      // Sort by createdAt descending
      contacts.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      return contacts.slice(0, count);
    },
    staleTime: 30 * 1000,
  });
}

export function useRecentReviews(count = 5) {
  return useQuery({
    queryKey: ['dashboard-recent-reviews', count],
    queryFn: async (): Promise<RecentReview[]> => {
      const ref = collection(db, COLLECTIONS.REVIEWS);
      const snapshot = await getDocs(ref);

      const reviews = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          clientName: data.clientName || 'Anonymous',
          company: data.company || '',
          rating: data.rating || 0,
          status: data.status || (data.isApproved ? 'approved' : 'pending'),
          createdAt: data.createdAt,
        };
      });

      // Sort by createdAt descending
      reviews.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      return reviews.slice(0, count);
    },
    staleTime: 30 * 1000,
  });
}

// Helper to format relative time
export function formatRelativeTime(timestamp: any): string {
  if (!timestamp) return 'Unknown';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Get subject label
export function getSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    'product-inquiry': 'Product Inquiry',
    'quote-request': 'Quote Request',
    partnership: 'Partnership',
    general: 'General Inquiry',
  };
  return labels[subject] || subject || 'General';
}

