import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { COLLECTIONS, AdminUser } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Firestore is properly configured
  const checkFirestoreConfig = () => {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    if (!projectId || projectId === 'your-project-id') {
      return 'Firebase Project ID not configured in client/.env';
    }
    return null;
  };

  useEffect(() => {
    const configError = checkFirestoreConfig();
    if (configError) {
      setError(configError);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setError(null);

      if (firebaseUser) {
        // Check if user is an admin
        try {
          console.log(
            'Fetching admin user document for UID:',
            firebaseUser.uid
          );
          const adminDocRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
          const adminDoc = await getDoc(adminDocRef);

          if (adminDoc.exists()) {
            console.log('Admin user found:', adminDoc.data());
            setAdminUser({ id: adminDoc.id, ...adminDoc.data() } as AdminUser);
          } else {
            // User exists in Auth but not in Firestore users collection
            // This means they're not an admin
            console.log(
              'User authenticated but not found in admin users collection'
            );
            console.log(
              'To make this user an admin, create a document in Firestore:'
            );
            console.log(
              `Collection: 'users', Document ID: '${firebaseUser.uid}'`
            );
            console.log(
              "Fields: { email, displayName, role: 'admin' or 'super_admin' }"
            );
            setAdminUser(null);
          }
        } catch (err: any) {
          console.error('Error fetching admin user:', err);
          console.error('Error code:', err.code);
          console.error('Error message:', err.message);

          // Handle specific Firebase errors
          if (err.code === 'unavailable' || err.message?.includes('offline')) {
            const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
            setError(
              `Cannot connect to Firestore. Please verify:\n` +
                `1. Firestore Database is created in Firebase Console\n` +
                `2. Project ID '${projectId}' is correct\n` +
                `3. You have internet connectivity`
            );
          } else if (err.code === 'permission-denied') {
            setError(
              'Permission denied. Check Firestore security rules or create the database in test mode.'
            );
          } else {
            setError(`Firestore error: ${err.message}`);
          }

          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);

    const configError = checkFirestoreConfig();
    if (configError) {
      throw new Error(configError);
    }

    const result = await signInWithEmailAndPassword(auth, email, password);

    // Verify user is an admin
    try {
      console.log('Checking admin status for:', result.user.uid);
      const adminDocRef = doc(db, COLLECTIONS.USERS, result.user.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (!adminDoc.exists()) {
        console.warn('User is not in admin collection. To add them:');
        console.warn(
          `Create document '${result.user.uid}' in 'users' collection`
        );
        await firebaseSignOut(auth);
        throw new Error(
          'You are not authorized to access the admin panel.\n\n' +
            "If you just created this account, you need to add yourself to the 'users' collection in Firestore:\n" +
            `Document ID: ${result.user.uid}\n` +
            "Fields: email, displayName, role ('admin' or 'super_admin')"
        );
      }

      setAdminUser({ id: adminDoc.id, ...adminDoc.data() } as AdminUser);
    } catch (err: any) {
      // If it's our custom error, rethrow it
      if (err.message?.includes('not authorized')) {
        throw err;
      }

      // Handle Firestore connection errors
      if (err.code === 'unavailable' || err.message?.includes('offline')) {
        await firebaseSignOut(auth);
        const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
        throw new Error(
          `Cannot connect to Firestore database.\n\n` +
            `Please check:\n` +
            `1. Go to Firebase Console → Firestore Database → Create Database\n` +
            `2. Verify project ID '${projectId}' matches your Firebase project\n` +
            `3. Check your internet connection`
        );
      }

      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAdminUser(null);
    setError(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value: AuthContextType = {
    user,
    adminUser,
    loading,
    error,
    signIn,
    signOut,
    resetPassword,
    isAdmin: !!adminUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
