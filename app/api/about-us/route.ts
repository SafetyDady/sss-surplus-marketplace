import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase.js';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// GET - ดึงข้อมูล About Us
export async function GET() {
  try {
    const docRef = doc(db, 'aboutUs', 'companyInfo');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return NextResponse.json({
        success: true,
        data: data
      });
    } else {
      // ถ้าไม่มีข้อมูล ให้สร้างข้อมูลเริ่มต้น
      const defaultData = {
        companyName: 'MTP Surplus',
        foundedYear: 2014,
        description: 'ผู้นำด้านการจัดหาและจำหน่ายสินค้าคุณภาพสูง ด้วยประสบการณ์กว่า 10 ปี',
        history: 'MTP Surplus ก่อตั้งขึ้นในปี 2014 ด้วยวิสัยทัศน์ในการเป็นผู้นำด้านการจัดหาสินค้าคุณภาพสูง เราเริ่มต้นจากธุรกิจขนาดเล็กและเติบโตมาเป็นบริษัทชั้นนำที่มีเครือข่ายกว้างขวางทั่วประเทศ',
        mission: 'มุ่งมั่นในการจัดหาและจำหน่ายสินค้าคุณภาพสูงที่ตอบสนองความต้องการของลูกค้า ด้วยบริการที่เป็นเลิศและราคาที่เป็นธรรม เพื่อสร้างความพึงพอใจสูงสุดให้กับลูกค้า',
        vision: 'เป็นผู้นำด้านการจัดหาสินค้าในประเทศไทย ที่ได้รับการยอมรับในระดับสากล ด้วยนวัตกรรมและเทคโนโลยีที่ทันสมัย เพื่อสร้างอนาคตที่ยั่งยืนร่วมกัน',
        statistics: {
          customers: '1000+',
          partners: '50+',
          serviceHours: '24/7',
          yearsOfExperience: '10+'
        },
        teamMembers: [
          {
            id: 'ceo',
            name: 'สมชาย วิทยากุล',
            position: 'ประธานเจ้าหน้าที่บริหาร',
            description: 'ประสบการณ์กว่า 15 ปีในอุตสาหกรรมการจัดหาสินค้า ผู้นำองค์กรด้วยวิสัยทัศน์และความเชี่ยวชาญ',
            avatar: 'สม',
            visible: true
          },
          {
            id: 'sales_director',
            name: 'อนุชา ธุรกิจดี',
            position: 'ผู้อำนวยการฝ่ายขาย',
            description: 'เชี่ยวชาญด้านการขายและการตลาด มีเครือข่ายลูกค้ากว้างขวางทั่วประเทศ',
            avatar: 'อน',
            visible: true
          },
          {
            id: 'operations_director',
            name: 'ประยุทธ คุณภาพดี',
            position: 'ผู้อำนวยการฝ่ายปฏิบัติการ',
            description: 'ผู้เชี่ยวชาญด้านการจัดการห่วงโซ่อุปทานและการควบคุมคุณภาพสินค้า',
            avatar: 'ปร',
            visible: true
          }
        ],
        values: [
          {
            title: 'คุณภาพ',
            description: 'มุ่งมั่นในการให้บริการและสินค้าที่มีคุณภาพสูงสุด',
            icon: '✅'
          },
          {
            title: 'ความน่าเชื่อถือ',
            description: 'สร้างความไว้วางใจผ่านการปฏิบัติที่โปร่งใสและซื่อสัตย์',
            icon: '🔒'
          },
          {
            title: 'นวัตกรรม',
            description: 'พัฒนาและปรับปรุงอย่างต่อเนื่องเพื่อตอบสนองความต้องการ',
            icon: '⚡'
          },
          {
            title: 'การบริการ',
            description: 'ให้บริการด้วยใจและความเอาใจใส่ในทุกรายละเอียด',
            icon: '👥'
          }
        ],
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system'
      };
      
      await setDoc(docRef, defaultData);
      return NextResponse.json({
        success: true,
        data: defaultData
      });
    }
  } catch (error) {
    console.error('Error fetching about us data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch about us data'
    }, { status: 500 });
  }
}

// POST/PUT - อัปเดตข้อมูล About Us
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, updatedBy = 'admin' } = body;
    
    const docRef = doc(db, 'aboutUs', 'companyInfo');
    
    // เพิ่มข้อมูล timestamp และผู้อัปเดต
    const updateData = {
      ...data,
      lastUpdated: new Date().toISOString(),
      updatedBy: updatedBy
    };
    
    await updateDoc(docRef, updateData);
    
    return NextResponse.json({
      success: true,
      message: 'About us data updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Error updating about us data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update about us data'
    }, { status: 500 });
  }
}

// PUT - อัปเดตข้อมูลเฉพาะส่วน
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data, updatedBy = 'admin' } = body;
    
    const docRef = doc(db, 'aboutUs', 'companyInfo');
    
    // อัปเดตเฉพาะส่วนที่ระบุ
    const updateData = {
      [section]: data,
      lastUpdated: new Date().toISOString(),
      updatedBy: updatedBy
    };
    
    await updateDoc(docRef, updateData);
    
    return NextResponse.json({
      success: true,
      message: `${section} updated successfully`,
      data: updateData
    });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update section'
    }, { status: 500 });
  }
}

