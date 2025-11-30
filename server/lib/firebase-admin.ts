import { initializeApp, cert, getApps, App, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let app: App;
let isInitialized = false;

// Check if Firebase Admin is properly configured
function checkConfig() {
  const hasServiceAccountKey = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const hasIndividualConfig = 
    process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_CLIENT_EMAIL && 
    process.env.FIREBASE_PRIVATE_KEY;

  if (!hasServiceAccountKey && !hasIndividualConfig) {
    console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  🔥 FIREBASE ADMIN SDK NOT CONFIGURED                            ║
╠══════════════════════════════════════════════════════════════════╣
║  Please add these to server/.env:                                ║
║                                                                  ║
║  FIREBASE_PROJECT_ID=your-project-id                             ║
║  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gsvc... ║
║  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
║  FIREBASE_STORAGE_BUCKET=your-project.appspot.com                ║
║                                                                  ║
║  Get these from: Firebase Console → Project Settings →           ║
║                  Service Accounts → Generate new private key     ║
╚══════════════════════════════════════════════════════════════════╝
    `);
    return false;
  }
  return true;
}

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    app = getApps()[0];
    isInitialized = true;
    return;
  }

  if (!checkConfig()) {
    console.warn("⚠️  Firebase Admin SDK not initialized - API routes will not work");
    return;
  }

  try {
    // Check if using service account JSON file path or individual env vars
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Using JSON string from environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Using individual environment variables
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
      
      if (!privateKey) {
        throw new Error("FIREBASE_PRIVATE_KEY is missing or empty");
      }

      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: privateKey,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
    
    isInitialized = true;
    console.log("✅ Firebase Admin SDK initialized successfully");
  } catch (error: any) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
    isInitialized = false;
  }
}

// Initialize on module load
initializeFirebaseAdmin();

// Export services with safety checks
export function getAdminAuth() {
  if (!isInitialized) {
    throw new Error("Firebase Admin SDK not initialized. Check server/.env configuration.");
  }
  return getAuth(app);
}

export function getAdminDb() {
  if (!isInitialized) {
    throw new Error("Firebase Admin SDK not initialized. Check server/.env configuration.");
  }
  return getFirestore(app);
}

export function getAdminStorage() {
  if (!isInitialized) {
    throw new Error("Firebase Admin SDK not initialized. Check server/.env configuration.");
  }
  return getStorage(app);
}

// For backward compatibility - but these will throw if not initialized
export const adminAuth = isInitialized ? getAuth(app!) : null;
export const adminDb = isInitialized ? getFirestore(app!) : null;
export const adminStorage = isInitialized ? getStorage(app!) : null;

export { isInitialized };
export default app!;
