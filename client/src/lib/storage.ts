import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'products/image.jpg')
 * @returns The download URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

/**
 * Upload an image to a specific folder
 * @param file - The image file
 * @param folder - The folder name (e.g., 'hero', 'products', 'categories')
 * @returns The download URL
 */
export async function uploadImage(
  file: File,
  folder: string = 'images'
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${folder}/${timestamp}_${safeName}`;
  return uploadFile(file, path);
}

/**
 * Upload a product image
 * @param file - The image file
 * @param productId - Optional product ID for organizing files
 * @returns The download URL
 */
export async function uploadProductImage(
  file: File,
  productId?: string
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = productId
    ? `products/${productId}/${timestamp}_${safeName}`
    : `products/temp/${timestamp}_${safeName}`;

  return uploadFile(file, path);
}

/**
 * Upload a category image
 * @param file - The image file
 * @param categoryId - Optional category ID for organizing files
 * @returns The download URL
 */
export async function uploadCategoryImage(
  file: File,
  categoryId?: string
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = categoryId
    ? `categories/${categoryId}/${timestamp}_${safeName}`
    : `categories/temp/${timestamp}_${safeName}`;

  return uploadFile(file, path);
}

/**
 * Delete a file from Firebase Storage
 * @param url - The download URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error: any) {
    // Ignore if file doesn't exist
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}

/**
 * Upload multiple files
 * @param files - Array of files to upload
 * @param basePath - Base path for uploads
 * @returns Array of download URLs
 */
export async function uploadMultipleFiles(
  files: File[],
  basePath: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${basePath}/${timestamp}_${index}_${safeName}`;
    return uploadFile(file, path);
  });

  return Promise.all(uploadPromises);
}

/**
 * Validate file is an image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Validate file size (default max 5MB)
 */
export function isValidFileSize(file: File, maxSizeMB = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

