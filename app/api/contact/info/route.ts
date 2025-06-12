import { NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function GET() {
  try {
    const docRef = doc(db, 'contactInfo', 'companyContact');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      // Return default data if document doesn't exist
      const defaultData = {
        address: '123 ถนนสุขุมวิท, แขวงคลองเตย, เขตคลองเตย, กรุงเทพมหานคร 10110',
        phone: '02-123-4567',
        email: 'contact@mtpsurplus.com',
        googleMapsUrl: 'https://goo.gl/maps/example',
        socialMedia: {
          facebook: 'https://facebook.com/mtpsurplus',
          line: 'https://line.me/mtpsurplus',
          instagram: 'https://instagram.com/mtpsurplus'
        }
      };
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const docRef = doc(db, 'contactInfo', 'companyContact');
    
    // Add timestamp
    const dataWithTimestamp = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    await setDoc(docRef, dataWithTimestamp);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contact info:', error);
    return NextResponse.json(
      { error: 'Failed to save contact info' },
      { status: 500 }
    );
  }
}
