import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// ตรวจสอบว่าผู้ใช้เป็น Super Admin หรือไม่
export function isSuperAdmin(userEmail) {
  if (!userEmail) return false;
  
  const superAdminEmails = process.env.SUPER_ADMIN_EMAILS?.split(',') || [];
  return superAdminEmails.includes(userEmail.toLowerCase().trim());
}

// ตรวจสอบว่า Super Admin mode เปิดอยู่หรือไม่
export function isSuperAdminModeEnabled() {
  return process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED === 'true';
}

// Hook สำหรับตรวจสอบสถานะ Super Admin
export function useSuperAdminStatus() {
  const [user, setUser] = useState(null);
  const [isSuper, setIsSuper] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        const superStatus = isSuperAdmin(currentUser.email) && isSuperAdminModeEnabled();
        setIsSuper(superStatus);
      } else {
        setIsSuper(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isSuper, loading };
}

// ตรวจสอบสิทธิ์ Super Admin สำหรับ API
export async function validateSuperAdminAccess(request) {
  try {
    // ตรวจสอบ Environment ก่อน
    if (!isSuperAdminModeEnabled()) {
      return { isValid: false, error: 'Super Admin mode is disabled' };
    }

    // ตรวจสอบ Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isValid: false, error: 'Missing or invalid authorization header' };
    }

    // ในการใช้งานจริง ควรตรวจสอบ Firebase ID Token
    // const token = authHeader.replace('Bearer ', '');
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // const userEmail = decodedToken.email;
    
    // สำหรับตอนนี้ ให้ผ่านไปก่อน (ในการพัฒนา)
    return { isValid: true };
    
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}

