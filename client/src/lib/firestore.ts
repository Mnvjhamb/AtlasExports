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
} from "firebase/firestore";
import { db } from "./firebase";

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  CATEGORIES: "categories",
  PRODUCTS: "products",
  REVIEWS: "reviews",
  CONTACTS: "contacts",
  CONTENT: "content",
} as const;

// Types
export interface Category {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  order: number;
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
  isApproved: boolean;
  createdAt: Timestamp;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  message: string;
  productInterest?: string;
  isRead: boolean;
  createdAt: Timestamp;
}

export interface AdminUser {
  id?: string;
  email: string;
  displayName: string;
  role: "admin" | "super_admin";
  createdAt: Timestamp;
  lastLogin?: Timestamp;
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
  const ref = collection(db, collectionName);
  const q = queryConstraints.length > 0 ? query(ref, ...queryConstraints) : ref;
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (T & { id: string })[];
}

export async function getById<T extends DocumentData>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as T & { id: string };
}

export async function create<T extends DocumentData>(
  collectionName: string,
  data: Omit<T, "id">
): Promise<string> {
  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function update<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function remove(
  collectionName: string,
  id: string
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

// Category specific functions
export async function getCategories(activeOnly = false) {
  const constraints: QueryConstraint[] = [orderBy("order", "asc")];
  if (activeOnly) {
    constraints.unshift(where("isActive", "==", true));
  }
  return getAll<Category>(COLLECTIONS.CATEGORIES, ...constraints);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getAll<Category>(
    COLLECTIONS.CATEGORIES,
    where("slug", "==", slug),
    limit(1)
  );
  return categories[0] || null;
}

// Product specific functions
export async function getProducts(activeOnly = false, categoryId?: string) {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
  if (activeOnly) {
    constraints.unshift(where("isActive", "==", true));
  }
  if (categoryId) {
    constraints.unshift(where("categoryId", "==", categoryId));
  }
  return getAll<Product>(COLLECTIONS.PRODUCTS, ...constraints);
}

export async function getFeaturedProducts() {
  return getAll<Product>(
    COLLECTIONS.PRODUCTS,
    where("isActive", "==", true),
    where("isFeatured", "==", true),
    limit(6)
  );
}

export async function getProductBySlug(slug: string) {
  const products = await getAll<Product>(
    COLLECTIONS.PRODUCTS,
    where("slug", "==", slug),
    limit(1)
  );
  return products[0] || null;
}

// Review specific functions
export async function getApprovedReviews() {
  return getAll<Review>(
    COLLECTIONS.REVIEWS,
    where("isApproved", "==", true),
    orderBy("createdAt", "desc")
  );
}

// Contact specific functions
export async function submitContact(data: Omit<ContactSubmission, "id" | "isRead" | "createdAt">) {
  return create<ContactSubmission>(COLLECTIONS.CONTACTS, {
    ...data,
    isRead: false,
    createdAt: Timestamp.now(),
  });
}

export async function getUnreadContacts() {
  return getAll<ContactSubmission>(
    COLLECTIONS.CONTACTS,
    where("isRead", "==", false),
    orderBy("createdAt", "desc")
  );
}

// Content specific functions
export async function getContent(key: string) {
  const contents = await getAll<SiteContent>(
    COLLECTIONS.CONTENT,
    where("key", "==", key),
    limit(1)
  );
  return contents[0] || null;
}

export async function updateContent(key: string, value: string | Record<string, any>) {
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

