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
    const docRef = doc(db, 'aboutUs', 'companyInfo');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      // Return default data if document doesn't exist
      const defaultData = {
        companyName: 'MTP Surplus',
        foundedYear: '2014',
        description: 'ผู้นำด้านการจัดหาและจำหน่ายสินค้าคุณภาพสูง',
        history: '',
        mission: '',
        vision: '',
        values: [],
        teamMembers: [],
        statistics: {
          customers: '0',
          partners: '0',
          serviceHours: '0',
          yearsOfExperience: '0'
        }
      };
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch About Us data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const docRef = doc(db, 'aboutUs', 'companyInfo');
    
    // Add timestamp
    const dataWithTimestamp = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    await setDoc(docRef, dataWithTimestamp);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving About Us data:', error);
    return NextResponse.json(
      { error: 'Failed to save About Us data' },
      { status: 500 }
    );
  }
}
