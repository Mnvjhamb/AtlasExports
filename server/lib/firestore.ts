import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isInitialized } from "./firebase-admin";

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

// Helper to get db instance safely
function getDb() {
  if (!isInitialized) {
    throw new Error("Firebase not initialized. Check server/.env configuration.");
  }
  return getAdminDb();
}

// Generic CRUD operations
export async function getAll<T>(
  collectionName: string
): Promise<(T & { id: string })[]> {
  const db = getDb();
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (T & { id: string })[];
}

export async function getById<T>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  const db = getDb();
  const doc = await db.collection(collectionName).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as T & { id: string };
}

export async function create<T extends Record<string, any>>(
  collectionName: string,
  data: Omit<T, "id">
): Promise<string> {
  const db = getDb();
  const docRef = await db.collection(collectionName).add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

export async function update<T extends Record<string, any>>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  const db = getDb();
  await db.collection(collectionName).doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function remove(
  collectionName: string,
  id: string
): Promise<void> {
  const db = getDb();
  await db.collection(collectionName).doc(id).delete();
}

// Category operations
export async function getCategories(activeOnly = false) {
  const db = getDb();
  let query = db.collection(COLLECTIONS.CATEGORIES).orderBy("order", "asc");
  if (activeOnly) {
    query = query.where("isActive", "==", true);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Category & { id: string })[];
}

// Product operations
export async function getProducts(activeOnly = false, categoryId?: string) {
  const db = getDb();
  let query = db.collection(COLLECTIONS.PRODUCTS).orderBy("createdAt", "desc");
  if (activeOnly) {
    query = query.where("isActive", "==", true);
  }
  if (categoryId) {
    query = query.where("categoryId", "==", categoryId);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Product & { id: string })[];
}

// Review operations
export async function getApprovedReviews() {
  const db = getDb();
  const snapshot = await db
    .collection(COLLECTIONS.REVIEWS)
    .where("isApproved", "==", true)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Review & { id: string })[];
}

// Contact operations
export async function submitContact(data: Omit<ContactSubmission, "id" | "isRead" | "createdAt">) {
  return create<ContactSubmission>(COLLECTIONS.CONTACTS, {
    ...data,
    isRead: false,
  } as Omit<ContactSubmission, "id">);
}

export async function getContacts(unreadOnly = false) {
  const db = getDb();
  let query = db.collection(COLLECTIONS.CONTACTS).orderBy("createdAt", "desc");
  if (unreadOnly) {
    query = query.where("isRead", "==", false);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (ContactSubmission & { id: string })[];
}

// Admin user operations
export async function getAdminUser(uid: string) {
  return getById<AdminUser>(COLLECTIONS.USERS, uid);
}

export async function createAdminUser(uid: string, data: Omit<AdminUser, "id" | "createdAt">) {
  const db = getDb();
  await db.collection(COLLECTIONS.USERS).doc(uid).set({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
  return uid;
}

// Content operations
export async function getContent(key: string) {
  const db = getDb();
  const snapshot = await db
    .collection(COLLECTIONS.CONTENT)
    .where("key", "==", key)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as SiteContent & { id: string };
}
