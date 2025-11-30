import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  REVIEWS: 'reviews',
  CONTACTS: 'contacts',
  CONTENT: 'content',
  CLIENTS: 'clients',
} as const;

// Types
export interface Category {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
  imageUrls: string[];
  specifications: Record<string, string>;
  minOrderQuantity: number;
  unit: string;
  slug: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id?: string;
  clientName: string;
  company: string;
  country: string;
  rating: number;
  content: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  isApproved?: boolean; // Legacy field, use status instead
  createdAt: Timestamp;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  subject: string;
  message: string;
  productInterest?: string;
  isRead: boolean;
  repliedAt?: Timestamp;
  replyNote?: string;
  createdAt: Timestamp;
}

export interface AdminUser {
  id?: string;
  email: string;
  displayName: string;
  role: 'admin' | 'super_admin';
  createdAt: Timestamp;
  lastLogin?: Timestamp;
}

export interface Client {
  id?: string;
  name: string;
  country: string;
  logoUrl?: string;
  website?: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
}

export interface SiteContent {
  id?: string;
  key: string;
  value: string | Record<string, any>;
  updatedAt: Timestamp;
}

// Generic CRUD operations
export async function getAll<T extends DocumentData>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  try {
    const ref = collection(db, collectionName);
    const q =
      queryConstraints.length > 0 ? query(ref, ...queryConstraints) : ref;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];
  } catch (error: any) {
    console.error(`Error fetching ${collectionName}:`, error);
    // If it's an index error, log helpful message
    if (error.code === 'failed-precondition') {
      console.error(
        'This query requires a composite index. Check the Firebase Console for the link to create it.'
      );
    }
    throw error;
  }
}

export async function getById<T extends DocumentData>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as T & { id: string };
  } catch (error) {
    console.error(`Error fetching ${collectionName}/${id}:`, error);
    throw error;
  }
}

export async function create<T extends DocumentData>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<string> {
  try {
    const ref = collection(db, collectionName);
    const docRef = await addDoc(ref, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating in ${collectionName}:`, error);
    throw error;
  }
}

export async function update<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error updating ${collectionName}/${id}:`, error);
    throw error;
  }
}

export async function remove(
  collectionName: string,
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting ${collectionName}/${id}:`, error);
    throw error;
  }
}

// Category specific functions
export async function getCategories(activeOnly = false) {
  try {
    // Simple query without compound index requirement
    const ref = collection(db, COLLECTIONS.CATEGORIES);
    const snapshot = await getDocs(ref);

    let results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Category & { id: string })[];

    // Filter in memory if activeOnly
    if (activeOnly) {
      results = results.filter((cat) => cat.isActive);
    }

    // Sort by order
    results.sort((a, b) => (a.order || 0) - (b.order || 0));

    return results;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getAll<Category>(
    COLLECTIONS.CATEGORIES,
    where('slug', '==', slug),
    limit(1)
  );
  return categories[0] || null;
}

// Product specific functions
export async function getProducts(activeOnly = false, categoryId?: string) {
  try {
    // Simple query - filter in memory to avoid composite index requirements
    const ref = collection(db, COLLECTIONS.PRODUCTS);
    const snapshot = await getDocs(ref);

    let results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Product & { id: string })[];

    // Filter in memory
    if (activeOnly) {
      results = results.filter((product) => product.isActive);
    }
    if (categoryId) {
      results = results.filter((product) => product.categoryId === categoryId);
    }

    // Sort by createdAt descending (newest first)
    results.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return results;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getFeaturedProducts() {
  try {
    // Simple query - filter in memory
    const ref = collection(db, COLLECTIONS.PRODUCTS);
    const snapshot = await getDocs(ref);

    let results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Product & { id: string })[];

    // Filter for active and featured products
    results = results.filter(
      (product) => product.isActive && product.isFeatured
    );

    // Sort by createdAt and limit to 6
    results.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return results.slice(0, 6);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

export async function getProductBySlug(slug: string) {
  const products = await getAll<Product>(
    COLLECTIONS.PRODUCTS,
    where('slug', '==', slug),
    limit(1)
  );
  return products[0] || null;
}

// Review specific functions
export async function getApprovedReviews() {
  try {
    const ref = collection(db, COLLECTIONS.REVIEWS);
    const snapshot = await getDocs(ref);

    let results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Review & { id: string })[];

    // Filter approved reviews
    results = results.filter((review) => review.isApproved);

    // Sort by createdAt descending
    results.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return results;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

// Contact specific functions
export async function submitContact(
  data: Omit<ContactSubmission, 'id' | 'isRead' | 'createdAt'>
) {
  return create<ContactSubmission>(COLLECTIONS.CONTACTS, {
    ...data,
    isRead: false,
    createdAt: Timestamp.now(),
  });
}

export async function getUnreadContacts() {
  try {
    const ref = collection(db, COLLECTIONS.CONTACTS);
    const snapshot = await getDocs(ref);

    let results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (ContactSubmission & { id: string })[];

    // Filter unread
    results = results.filter((contact) => !contact.isRead);

    // Sort by createdAt descending
    results.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return results;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

// Content specific functions
export async function getContent(key: string) {
  const contents = await getAll<SiteContent>(
    COLLECTIONS.CONTENT,
    where('key', '==', key),
    limit(1)
  );
  return contents[0] || null;
}

export async function updateContent(
  key: string,
  value: string | Record<string, any>
) {
  const existing = await getContent(key);
  if (existing) {
    return update<SiteContent>(COLLECTIONS.CONTENT, existing.id, { value });
  } else {
    return create<SiteContent>(COLLECTIONS.CONTENT, {
      key,
      value,
      updatedAt: Timestamp.now(),
    });
  }
}
