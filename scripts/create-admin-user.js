/**
 * Script to create admin user in Firestore
 * This will add sanchai5651@gmail.com to adminWhitelist collection
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  // For demo purposes, we'll use demo credentials
  // In production, this should use proper service account
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "demo-project",
      clientEmail: "demo@demo-project.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB\n-----END PRIVATE KEY-----\n"
    }),
    databaseURL: "https://demo-project-default-rtdb.firebaseio.com/"
  });
}

const db = admin.firestore();

async function createAdminUser() {
  try {
    console.log('Creating admin user in Firestore...');
    
    // Create adminWhitelist collection with sanchai5651@gmail.com
    const adminRef = db.collection('adminWhitelist').doc('sanchai5651@gmail.com');
    
    await adminRef.set({
      email: 'sanchai5651@gmail.com',
      role: 'super_admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'migration_script',
      active: true
    });
    
    console.log('✅ Admin user created successfully!');
    
    // Also create in users collection for backup
    const userRef = db.collection('users').doc('sanchai5651@gmail.com');
    
    await userRef.set({
      email: 'sanchai5651@gmail.com',
      role: 'super_admin',
      displayName: 'Super Admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null,
      active: true
    });
    
    console.log('✅ User record created successfully!');
    
    return { success: true, message: 'Admin user created' };
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return { success: false, error: error.message };
  }
}

// Export for use in API
module.exports = { createAdminUser };

// Run if called directly
if (require.main === module) {
  createAdminUser()
    .then(result => {
      console.log('Result:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Script error:', error);
      process.exit(1);
    });
}

