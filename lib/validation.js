// lib/validation.js

// Field validation rules
export const validationRules = {
  // เลขบัตรประชาชน (13 หลัก)
  idCard: {
    pattern: /^[0-9]{13}$/,
    message: 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก'
  },
  
  // เลขประจำตัวผู้เสียภาษี (13 หลัก)
  taxId: {
    pattern: /^[0-9]{13}$/,
    message: 'เลขประจำตัวผู้เสียภาษีต้องเป็นตัวเลข 13 หลัก'
  },
  
  // อีเมล
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'รูปแบบอีเมลไม่ถูกต้อง'
  },
  
  // เบอร์โทรศัพท์
  phone: {
    pattern: /^[0-9-+().\s]{8,15}$/,
    message: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง'
  },
  
  // เบอร์มือถือ
  mobile: {
    pattern: /^[0-9]{10}$/,
    message: 'เบอร์มือถือต้องเป็นตัวเลข 10 หลัก'
  },
  
  // เว็บไซต์
  website: {
    pattern: /^https?:\/\/.+\..+/,
    message: 'รูปแบบเว็บไซต์ไม่ถูกต้อง (ต้องขึ้นต้นด้วย http:// หรือ https://)'
  }
};

// Required fields based on applicant type
export const getRequiredFields = (applicantType) => {
  const commonFields = [
    'applicantType',
    'address',
    'contactName',
    'position', 
    'email',
    'phone',
    'mobile',
    'productCategories',
    'productDescription',
    'monthlyVolume',
    'motivation',
    'terms'
  ];

  if (applicantType === 'individual') {
    return [...commonFields, 'firstName', 'lastName', 'idCard'];
  } else if (applicantType === 'company') {
    return [...commonFields, 'companyName', 'businessType', 'taxId'];
  }
  
  return commonFields;
};

// Field labels for error messages
export const fieldLabels = {
  applicantType: 'ประเภทผู้สมัคร',
  firstName: 'ชื่อ',
  lastName: 'นามสกุล',
  idCard: 'เลขบัตรประชาชน',
  companyName: 'ชื่อบริษัท',
  businessType: 'ประเภทธุรกิจ',
  taxId: 'เลขประจำตัวผู้เสียภาษี',
  address: 'ที่อยู่',
  contactName: 'ชื่อผู้ติดต่อ',
  position: 'ตำแหน่ง',
  email: 'อีเมล',
  phone: 'เบอร์โทรศัพท์',
  mobile: 'เบอร์มือถือ',
  lineId: 'Line ID',
  website: 'เว็บไซต์',
  productCategories: 'หมวดหมู่สินค้า',
  productDescription: 'รายละเอียดสินค้า',
  monthlyVolume: 'ปริมาณสินค้าต่อเดือน',
  experience: 'ประสบการณ์',
  motivation: 'เหตุผลที่ต้องการเป็น Vendor',
  otherPlatforms: 'แพลตฟอร์มอื่น',
  terms: 'ยอมรับข้อตกลง',
  newsletter: 'รับข่าวสาร'
};

// Document requirements
export const documentCategories = {
  individual: {
    idCard: {
      required: true,
      label: 'สำเนาบัตรประชาชน',
      maxFiles: 2,
      description: 'แนบรูปหน้า-หลังของบัตรประชาชน'
    },
    houseRegistration: {
      required: true,
      label: 'สำเนาทะเบียนบ้าน',
      maxFiles: 1,
      description: 'แนบสำเนาทะเบียนบ้านที่มีชื่อผู้สมัคร'
    },
    businessRegistration: {
      required: false,
      label: 'หนังสือรับรองการจดทะเบียนพาณิชย์',
      maxFiles: 1,
      description: 'แนับถ้ามีการจดทะเบียนพาณิชย์'
    }
  },
  
  company: {
    companyRegistration: {
      required: true,
      label: 'หนังสือรับรองการจดทะเบียนบริษัท',
      maxFiles: 1,
      description: 'หนังสือรับรองจากกรมพัฒนาธุรกิจการค้า'
    },
    memorandum: {
      required: true,
      label: 'หนังสือบริคณห์สนธิ',
      maxFiles: 1,
      description: 'หนังสือบริคณห์สนธิของบริษัท'
    },
    authorizedPersonId: {
      required: true,
      label: 'สำเนาบัตรประชาชนผู้มีอำนาจลงนาม',
      maxFiles: 2,
      description: 'บัตรประชาชนของผู้มีอำนาจลงนาม (หน้า-หลัง)'
    },
    powerOfAttorney: {
      required: false,
      label: 'หนังสือมอบอำนาจ',
      maxFiles: 1,
      description: 'แนบถ้ามีการมอบอำนาจให้ผู้อื่นดำเนินการ'
    }
  }
};

// File validation
export const allowedFileTypes = {
  images: ['image/jpeg', 'image/jpg', 'image/png'],
  documents: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
};

export const fileSizeLimits = {
  maxFileSize: 5 * 1024 * 1024, // 5MB per file
  maxTotalSize: 20 * 1024 * 1024 // 20MB total
};

// Main validation function
export const validateForm = (formData) => {
  const errors = {};
  
  // Validate required fields based on applicant type
  const requiredFields = getRequiredFields(formData.applicantType);
  
  requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      errors[field] = `${fieldLabels[field]} จำเป็นต้องกรอก`;
    }
  });
  
  // Validate field formats
  Object.keys(validationRules).forEach(field => {
    if (formData[field] && formData[field].trim() !== '') {
      if (!validationRules[field].pattern.test(formData[field])) {
        errors[field] = validationRules[field].message;
      }
    }
  });
  
  // Validate documents
  if (formData.applicantType) {
    const documentErrors = validateDocuments(formData.documents || {}, formData.applicantType);
    if (Object.keys(documentErrors).length > 0) {
      errors.documents = documentErrors;
    }
  }
  
  return errors;
};

// Document validation function
export const validateDocuments = (documents, applicantType) => {
  const errors = {};
  const requiredDocs = documentCategories[applicantType];
  
  if (!requiredDocs) return errors;
  
  Object.keys(requiredDocs).forEach(docType => {
    const docConfig = requiredDocs[docType];
    const uploadedFiles = documents[docType] || [];
    
    if (docConfig.required && uploadedFiles.length === 0) {
      errors[docType] = `${docConfig.label} จำเป็นต้องแนบ`;
    }
    
    if (uploadedFiles.length > docConfig.maxFiles) {
      errors[docType] = `${docConfig.label} แนบได้สูงสุด ${docConfig.maxFiles} ไฟล์`;
    }
    
    // Validate file types and sizes
    uploadedFiles.forEach((file, index) => {
      if (!allowedFileTypes.documents.includes(file.type)) {
        errors[`${docType}_${index}`] = 'ประเภทไฟล์ไม่ถูกต้อง (รองรับ PDF, JPG, PNG เท่านั้น)';
      }
      
      if (file.size > fileSizeLimits.maxFileSize) {
        errors[`${docType}_${index}`] = 'ขนาดไฟล์เกิน 5MB';
      }
    });
  });
  
  return errors;
};

// Validate single field (for real-time validation)
export const validateField = (fieldName, value, applicantType = null) => {
  const errors = {};
  
  // Check if field is required
  if (applicantType) {
    const requiredFields = getRequiredFields(applicantType);
    if (requiredFields.includes(fieldName) && (!value || value.trim() === '')) {
      errors[fieldName] = `${fieldLabels[fieldName]} จำเป็นต้องกรอก`;
      return errors;
    }
  }
  
  // Check field format
  if (value && value.trim() !== '' && validationRules[fieldName]) {
    if (!validationRules[fieldName].pattern.test(value)) {
      errors[fieldName] = validationRules[fieldName].message;
    }
  }
  
  return errors;
};

