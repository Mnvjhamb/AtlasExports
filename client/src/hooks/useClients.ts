import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  getById,
  create,
  update,
  remove,
  COLLECTIONS,
  type Client,
} from '@/lib/firestore';

// ============ Public Hooks ============

export function useClients(activeOnly = true) {
  return useQuery({
    queryKey: ['clients', activeOnly],
    queryFn: async () => {
      const ref = collection(db, COLLECTIONS.CLIENTS);
      const snapshot = await getDocs(ref);

      let results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Client & { id: string })[];

      // Filter active only if requested
      if (activeOnly) {
        results = results.filter((c) => c.isActive !== false);
      }

      // Sort by order, then by name
      results.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.name || '').localeCompare(b.name || '');
      });

      return results;
    },
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => (id ? getById<Client>(COLLECTIONS.CLIENTS, id) : null),
    enabled: !!id,
  });
}

// ============ Mutations ============

interface CreateClientData {
  name: string;
  country: string;
  logoUrl?: string;
  website?: string;
  isActive?: boolean;
  order?: number;
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClientData) => {
      return create<Client>(COLLECTIONS.CLIENTS, {
        name: data.name,
        country: data.country,
        logoUrl: data.logoUrl || '',
        website: data.website || '',
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
        createdAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Client, 'id' | 'createdAt'>>;
    }) => update<Client>(COLLECTIONS.CLIENTS, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remove(COLLECTIONS.CLIENTS, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

