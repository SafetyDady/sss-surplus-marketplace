// Firebase Test Script
// Run this in browser console to test Firebase connection

import { db, storage } from './lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Test 1: Firestore Connection
async function testFirestore() {
  try {
    console.log('🔥 Testing Firestore connection...');
    
    // Add test document
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Hello Firebase!',
      timestamp: new Date(),
      testId: Math.random().toString(36).substr(2, 9)
    });
    
    console.log('✅ Document written with ID:', testDoc.id);
    
    // Read test documents
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Found', querySnapshot.size, 'test documents');
    
    return true;
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    return false;
  }
}

// Test 2: Storage Connection
async function testStorage() {
  try {
    console.log('📁 Testing Storage connection...');
    
    // Create test file
    const testFile = new Blob(['Hello Firebase Storage!'], { type: 'text/plain' });
    const testRef = ref(storage, 'test/test-file.txt');
    
    // Upload file
    const snapshot = await uploadBytes(testRef, testFile);
    console.log('✅ File uploaded:', snapshot.metadata.name);
    
    // Get download URL
    const downloadURL = await getDownloadURL(testRef);
    console.log('✅ Download URL:', downloadURL);
    
    return true;
  } catch (error) {
    console.error('❌ Storage test failed:', error);
    return false;
  }
}

// Test 3: Contact Form Submission
async function testContactForm() {
  try {
    console.log('📧 Testing Contact Form...');
    
    const testMessage = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '089-123-4567',
      subject: 'สอบถามเกี่ยวกับสินค้า',
      message: 'นี่คือข้อความทดสอบจาก Firebase Test Script'
    };
    
    // Import contact service
    const { submitContactMessage } = await import('./lib/contactService');
    const result = await submitContactMessage(testMessage);
    
    if (result.success) {
      console.log('✅ Contact form test passed:', result.id);
      return true;
    } else {
      console.error('❌ Contact form test failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Contact form test failed:', error);
    return false;
  }
}

// Test 4: Vendor Application Submission
async function testVendorApplication() {
  try {
    console.log('🤝 Testing Vendor Application...');
    
    const testApplication = {
      applicantType: 'individual',
      companyInfo: {
        companyName: 'Test Company',
        businessType: 'ขายปลีก',
        companyAddress: '123 Test Street, Bangkok',
        taxId: '1234567890123'
      },
      contactInfo: {
        contactName: 'Test Vendor',
        email: 'vendor@test.com',
        phone: '02-123-4567',
        mobile: '089-123-4567'
      },
      productInfo: {
        productCategories: ['อิเล็กทรอนิกส์'],
        productDescription: 'สินค้าทดสอบ',
        monthlyVolume: '100 ชิ้น'
      },
      additionalInfo: {
        motivation: 'ทดสอบระบบ',
        terms: true
      }
    };
    
    // Import vendor service
    const { submitVendorApplication } = await import('./lib/vendorService');
    const result = await submitVendorApplication(testApplication, {});
    
    if (result.success) {
      console.log('✅ Vendor application test passed:', result.id);
      return true;
    } else {
      console.error('❌ Vendor application test failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Vendor application test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Firebase Tests...');
  console.log('================================');
  
  const results = {
    firestore: await testFirestore(),
    storage: await testStorage(),
    contactForm: await testContactForm(),
    vendorApplication: await testVendorApplication()
  };
  
  console.log('================================');
  console.log('📊 Test Results:');
  console.log('Firestore:', results.firestore ? '✅' : '❌');
  console.log('Storage:', results.storage ? '✅' : '❌');
  console.log('Contact Form:', results.contactForm ? '✅' : '❌');
  console.log('Vendor Application:', results.vendorApplication ? '✅' : '❌');
  
  const allPassed = Object.values(results).every(result => result === true);
  console.log('================================');
  console.log('Overall Result:', allPassed ? '🎉 ALL TESTS PASSED!' : '⚠️ SOME TESTS FAILED');
  
  return results;
}

// Export for use
window.firebaseTests = {
  testFirestore,
  testStorage,
  testContactForm,
  testVendorApplication,
  runAllTests
};

console.log('🔥 Firebase Test Script Loaded!');
console.log('Run: firebaseTests.runAllTests() to test everything');
console.log('Or run individual tests: firebaseTests.testFirestore()');

