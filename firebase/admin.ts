import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK only if it hasn't been initialized yet
if (!admin.apps.length) {
  try {
    // Check if we have service account credentials in environment variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Parse the service account key from environment variable
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8')
      );
      
      admin.initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      
      console.log('Firebase Admin initialized with service account credentials');
    } else {
      // Fall back to application default credentials
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      
      console.log('Firebase Admin initialized with application default credentials');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    
    // Initialize with minimal configuration to prevent crashes
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    
    console.error('Firebase Admin initialized with fallback configuration');
  }
}

export { admin };

