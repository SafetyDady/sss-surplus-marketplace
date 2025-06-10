# แก้ไขปัญหา Dropdown ปุ่มเข้าสู่ระบบ

## ปัญหาที่พบ
- Dropdown มี `display: none` ทำให้ไม่แสดงเมื่อ click
- CSS class: `jsx-4e7b5b7668eab305 login-dropdown-menu`
- Structure: button + div.login-dropdown-menu

## โซลูชัน
สร้าง CSS และ JavaScript ที่ทำงานได้ถูกต้อง:

### 1. CSS สำหรับ Dropdown
```css
.login-container {
  position: relative;
  display: inline-block;
}

.login-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  display: none; /* Hidden by default */
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.2s ease-in-out;
}

.login-dropdown-menu.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.login-dropdown-menu a {
  display: block;
  padding: 12px 16px;
  color: #374151;
  text-decoration: none;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.login-dropdown-menu a:hover {
  background-color: #f9fafb;
}

.login-dropdown-menu a:last-child {
  border-bottom: none;
}

/* Hover state for container */
.login-container:hover .login-dropdown-menu {
  display: block;
  opacity: 1;
  transform: translateY(0);
}
```

### 2. JavaScript สำหรับ Toggle
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.querySelector('.login-btn');
  const dropdown = document.querySelector('.login-dropdown-menu');
  let isOpen = false;

  if (loginButton && dropdown) {
    // Click handler
    loginButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      isOpen = !isOpen;
      
      if (isOpen) {
        dropdown.classList.add('show');
      } else {
        dropdown.classList.remove('show');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!loginButton.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
        isOpen = false;
      }
    });

    // Keep open when hovering over dropdown
    dropdown.addEventListener('mouseenter', function() {
      dropdown.classList.add('show');
      isOpen = true;
    });

    // Optional: Close when mouse leaves the entire container
    const container = loginButton.parentElement;
    if (container) {
      container.addEventListener('mouseleave', function() {
        setTimeout(() => {
          if (!dropdown.matches(':hover') && !loginButton.matches(':hover')) {
            dropdown.classList.remove('show');
            isOpen = false;
          }
        }, 100);
      });
    }
  }
});
```

## การใช้งาน
1. เพิ่ม CSS ลงในไฟล์ styles
2. เพิ่ม JavaScript ลงในไฟล์ component
3. ตรวจสอบให้แน่ใจว่า HTML structure ถูกต้อง

