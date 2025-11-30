import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getCategories,
  getFeaturedProducts,
  getProductBySlug,
  getById,
  create,
  update,
  remove,
  COLLECTIONS,
  type Product,
  type Category,
} from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';

// ============ Categories Hooks ============

export function useCategories(activeOnly = true) {
  return useQuery({
    queryKey: ['categories', { activeOnly }],
    queryFn: () => getCategories(activeOnly),
  });
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => (id ? getById<Category>(COLLECTIONS.CATEGORIES, id) : null),
    enabled: !!id,
  });
}

// ============ Products Hooks ============

export function useProducts(activeOnly = true, categoryId?: string) {
  return useQuery({
    queryKey: ['products', { activeOnly, categoryId }],
    queryFn: () => getProducts(activeOnly, categoryId),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => (id ? getById<Product>(COLLECTIONS.PRODUCTS, id) : null),
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => (slug ? getProductBySlug(slug) : null),
    enabled: !!slug,
  });
}

// ============ Admin Mutations ============

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
      create<Product>(COLLECTIONS.PRODUCTS, data as Omit<Product, 'id'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Product, 'id' | 'createdAt'>>;
    }) => update<Product>(COLLECTIONS.PRODUCTS, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remove(COLLECTIONS.PRODUCTS, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ============ Category Mutations ============

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) =>
      create<Category>(COLLECTIONS.CATEGORIES, data as Omit<Category, 'id'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Category, 'id' | 'createdAt'>>;
    }) => update<Category>(COLLECTIONS.CATEGORIES, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remove(COLLECTIONS.CATEGORIES, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// ============ Helpers ============

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
