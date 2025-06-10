// Fixed Login Dropdown Component
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const LoginDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="login-container">
      <button 
        ref={buttonRef}
        className="login-btn"
        onClick={toggleDropdown}
        onMouseEnter={() => setIsOpen(true)}
      >
        เข้าสู่ระบบ
      </button>
      
      <div 
        ref={dropdownRef}
        className={`login-dropdown-menu ${isOpen ? 'show' : ''}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => {
          // Small delay to prevent flickering
          setTimeout(() => {
            if (!buttonRef.current?.matches(':hover')) {
              setIsOpen(false);
            }
          }, 100);
        }}
      >
        <Link href="/auth/signin" className="dropdown-item">
          สำหรับลูกค้า
        </Link>
        <Link href="/vendor/login" className="dropdown-item">
          สำหรับ Vendor
        </Link>
        <Link href="/admin/login" className="dropdown-item">
          สำหรับ Admin
        </Link>
        <Link href="/admin/super" className="dropdown-item super-admin">
          🔥 Super Admin
        </Link>
      </div>

      <style jsx>{`
        .login-container {
          position: relative;
          display: inline-block;
        }

        .login-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .login-dropdown-menu {
          position: absolute;
          top: calc(100% + 5px);
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease-in-out;
        }

        .login-dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: block;
          padding: 12px 16px;
          color: #374151;
          text-decoration: none;
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: #f9fafb;
          color: #1f2937;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .super-admin {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white !important;
          font-weight: 600;
        }

        .super-admin:hover {
          background: linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%);
          color: white !important;
        }

        /* Ensure dropdown stays open when hovering */
        .login-container:hover .login-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default LoginDropdown;

