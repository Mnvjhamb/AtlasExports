import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  getById,
  create,
  update,
  remove,
  COLLECTIONS,
  type Review,
} from '@/lib/firestore';

// ============ Public Hooks ============

export function useApprovedReviews() {
  return useQuery({
    queryKey: ['reviews', 'approved'],
    queryFn: async () => {
      const ref = collection(db, COLLECTIONS.REVIEWS);
      const snapshot = await getDocs(ref);

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Review & { id: string })[];

      // Filter approved reviews (support both old isApproved and new status field)
      const approved = results.filter(
        (r) => r.status === 'approved' || (r.isApproved === true && !r.status)
      );

      // Sort by createdAt descending
      approved.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      return approved;
    },
  });
}

// ============ Admin Hooks ============

export function useAllReviews() {
  return useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: async () => {
      const ref = collection(db, COLLECTIONS.REVIEWS);
      const snapshot = await getDocs(ref);

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Review & { id: string })[];

      // Normalize status for legacy data
      results.forEach((r) => {
        if (!r.status) {
          r.status = r.isApproved ? 'approved' : 'pending';
        }
      });

      // Sort by createdAt descending (newest first)
      results.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      return results;
    },
  });
}

export function useReview(id: string | undefined) {
  return useQuery({
    queryKey: ['reviews', id],
    queryFn: () => (id ? getById<Review>(COLLECTIONS.REVIEWS, id) : null),
    enabled: !!id,
  });
}

// ============ Mutations ============

interface CreateReviewData {
  clientName: string;
  company: string;
  country: string;
  rating: number;
  content: string;
  email?: string;
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewData) => {
      return create<Review>(COLLECTIONS.REVIEWS, {
        clientName: data.clientName,
        company: data.company,
        country: data.country || '',
        rating: data.rating,
        content: data.content,
        status: 'pending',
        createdAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Review, 'id' | 'createdAt'>>;
    }) => update<Review>(COLLECTIONS.REVIEWS, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      update<Review>(COLLECTIONS.REVIEWS, id, {
        status: 'approved',
        isApproved: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useRejectReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      update<Review>(COLLECTIONS.REVIEWS, id, {
        status: 'rejected',
        isApproved: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remove(COLLECTIONS.REVIEWS, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

// ============ Helpers ============

export function calculateAverageRating(reviews: Review[]): number {
  const approvedReviews = reviews.filter(
    (r) => r.status === 'approved' || r.isApproved
  );
  if (approvedReviews.length === 0) return 0;
  const sum = approvedReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return sum / approvedReviews.length;
}

export function getReviewStatusColor(
  status: string
): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
}
