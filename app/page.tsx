'use client';

import React, { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Mobile Menu Toggle Function
    window.toggleMobileMenu = function() {
      const hamburger = document.querySelector('.hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      
      hamburger?.classList.toggle('active');
      mobileMenu?.classList.toggle('active');
    };

    // Categories Navigation Arrows
    window.scrollCategories = function(direction) {
      const scrollContainer = document.getElementById('categoriesScroll');
      const scrollAmount = 300;
      
      if (direction === 'left') {
        scrollContainer?.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      } else {
        scrollContainer?.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
      
      setTimeout(updateArrowStates, 300);
    };

    function updateArrowStates() {
      const scrollContainer = document.getElementById('categoriesScroll');
      const leftArrow = document.getElementById('leftArrow');
      const rightArrow = document.getElementById('rightArrow');
      
      if (!scrollContainer || !leftArrow || !rightArrow) return;
      
      if (scrollContainer.scrollLeft <= 0) {
        leftArrow.classList.add('disabled');
      } else {
        leftArrow.classList.remove('disabled');
      }
      
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (scrollContainer.scrollLeft >= maxScroll - 5) {
        rightArrow.classList.add('disabled');
      } else {
        rightArrow.classList.remove('disabled');
      }
    }

    // Handle Search
    window.handleSearch = function() {
      const searchInput = document.getElementById('searchInput');
      const query = searchInput?.value.trim();
      if (query) {
        window.location.href = `/products?search=${encodeURIComponent(query)}`;
      }
    };

    // Super Admin Detection
    function checkSuperAdminMode() {
      const superAdminEnabled = process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED === 'true';
      const superAdminLink = document.getElementById('superAdminLink');
      
      if (superAdminEnabled && superAdminLink) {
        superAdminLink.style.display = 'block';
      }
    }

    // Initialize
    updateArrowStates();
    checkSuperAdminMode();
    
    const scrollContainer = document.getElementById('categoriesScroll');
    scrollContainer?.addEventListener('scroll', updateArrowStates);
    
    window.addEventListener('resize', updateArrowStates);

    // Search input enter key
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        window.handleSearch();
      }
    });

    // Close mobile menu handlers
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', function() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        
        hamburger?.classList.remove('active');
        mobileMenu?.classList.remove('active');
      });
    });

    // Login Dropdown Handler
    function initLoginDropdown() {
      const loginDropdown = document.querySelector('.login-dropdown');
      const loginBtn = document.querySelector('.login-btn');
      const loginMenu = document.querySelector('.login-dropdown-menu');
      
      if (!loginDropdown || !loginBtn || !loginMenu) {
        console.log('Login dropdown elements not found, retrying...');
        setTimeout(initLoginDropdown, 500);
        return;
      }
      
      let isOpen = false;
      let hoverTimeout;
      
      // Click handler for button
      loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isOpen = !isOpen;
        
        if (isOpen) {
          loginMenu.style.display = 'block';
          loginMenu.classList.add('show');
        } else {
          loginMenu.classList.remove('show');
          setTimeout(() => {
            if (!loginMenu.classList.contains('show')) {
              loginMenu.style.display = 'none';
            }
          }, 200);
        }
      });
      
      // Hover handlers
      loginDropdown.addEventListener('mouseenter', function() {
        clearTimeout(hoverTimeout);
        isOpen = true;
        loginMenu.style.display = 'block';
        loginMenu.classList.add('show');
      });
      
      loginDropdown.addEventListener('mouseleave', function() {
        hoverTimeout = setTimeout(() => {
          isOpen = false;
          loginMenu.classList.remove('show');
          setTimeout(() => {
            if (!loginMenu.classList.contains('show')) {
              loginMenu.style.display = 'none';
            }
          }, 200);
        }, 100);
      });
      
      // Close when clicking outside
      document.addEventListener('click', function(e) {
        if (!loginDropdown.contains(e.target)) {
          isOpen = false;
          loginMenu.classList.remove('show');
          setTimeout(() => {
            if (!loginMenu.classList.contains('show')) {
              loginMenu.style.display = 'none';
            }
          }, 200);
        }
      });
      
      console.log('Login dropdown initialized successfully!');
    }
    
    // Initialize login dropdown
    initLoginDropdown();

    document.addEventListener('click', function(e) {
      const hamburger = document.querySelector('.hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      const header = document.querySelector('.header');
      
      if (!header?.contains(e.target)) {
        hamburger?.classList.remove('active');
        mobileMenu?.classList.remove('active');
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    return () => {
      // Cleanup
      window.removeEventListener('resize', updateArrowStates);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8fafc;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .logo-icon {
          background: white;
          color: #667eea;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        .nav-links a {
          color: white;
          text-decoration: none;
          transition: opacity 0.3s;
          font-weight: 500;
        }
        
        .nav-links a:hover {
          opacity: 0.8;
        }
        
        .login-dropdown {
          position: relative;
          display: inline-block;
        }
        
        .login-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .login-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .login-dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          min-width: 180px;
          z-index: 1000;
          margin-top: 0.5rem;
          overflow: hidden;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }
        
        .login-dropdown-menu.show {
          display: block;
          opacity: 1;
          transform: translateY(0);
        }
        
        .login-dropdown:hover .login-dropdown-menu {
          display: block;
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .login-dropdown-menu a {
          display: block;
          color: #333;
          text-decoration: none;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.3s;
          font-weight: 500;
        }
        
        .login-dropdown-menu a:hover {
          background: #f8fafc;
          color: #667eea;
        }
        
        .login-dropdown-menu a:last-child {
          border-bottom: none;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .cart-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .cart-icon:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background 0.3s;
        }
        
        .hamburger:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .hamburger span {
          width: 25px;
          height: 3px;
          background: white;
          margin: 3px 0;
          transition: 0.3s;
          border-radius: 2px;
        }
        
        .hamburger.active span:nth-child(1) {
          transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
          transform: rotate(45deg) translate(-5px, -6px);
        }
        
        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .mobile-menu.active {
          display: block;
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mobile-menu a {
          display: block;
          color: white;
          text-decoration: none;
          padding: 1rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: background 0.3s;
          font-weight: 500;
        }
        
        .mobile-menu a:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .mobile-menu a:last-child {
          border-bottom: none;
        }
        
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 0;
          text-align: center;
        }
        
        .hero-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .hero p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .search-container {
          max-width: 600px;
          margin: 0 auto 2rem;
          position: relative;
        }
        
        .search-input {
          width: 100%;
          padding: 1rem 3rem 1rem 1rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .search-button {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .stats-grid {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem auto 0;
          max-width: 800px;
          backdrop-filter: blur(10px);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }
        
        .stat-item {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(5px);
        }
        
        .stat-item h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .stat-item p {
          opacity: 0.8;
          font-size: 0.9rem;
        }
        
        .categories {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.2rem 0;
        }
        
        .categories-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
        }
        
        .categories h3 {
          color: white;
          text-align: center;
          margin-bottom: 1.2rem;
          font-size: 1.2rem;
          font-weight: 600;
          opacity: 0.9;
        }
        
        .categories-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .categories-scroll {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
          flex: 1;
        }
        
        .categories-scroll::-webkit-scrollbar {
          display: none;
        }
        
        .categories-grid {
          display: flex;
          gap: 1rem;
          padding: 0.4rem 0;
          min-width: max-content;
        }
        
        .category-btn {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.6rem 1.2rem;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
          min-height: 36px;
        }
        
        .category-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .nav-arrow {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.2rem;
          font-weight: bold;
          backdrop-filter: blur(10px);
          user-select: none;
        }
        
        .nav-arrow:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: scale(1.05);
        }
        
        .nav-arrow:active {
          transform: scale(0.95);
        }
        
        .nav-arrow.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }
        
        .nav-arrow.left {
          margin-right: 0.5rem;
        }
        
        .nav-arrow.right {
          margin-left: 0.5rem;
        }
        
        .products {
          padding: 4rem 0;
          background: white;
        }
        
        .products-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .products-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .products-header h2 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 1rem;
        }
        
        .products-header p {
          font-size: 1.1rem;
          color: #666;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }
        
        .product-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(45deg, #f0f2f5, #e1e8ed);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: #667eea;
          position: relative;
        }
        
        .product-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: #ff6b6b;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .product-type {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }
        
        .product-type.new {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .product-type.used {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }
        
        .product-content {
          padding: 1.5rem;
        }
        
        .product-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .product-price {
          margin-bottom: 0.5rem;
        }
        
        .product-price .current {
          font-size: 1.4rem;
          font-weight: 700;
          color: #667eea;
        }
        
        .product-price .original {
          text-decoration: line-through;
          color: #999;
          font-size: 1rem;
          margin-left: 0.5rem;
        }
        
        .product-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }
        
        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .product-rating .stars {
          color: #ffd700;
        }
        
        .product-rating .text {
          color: #666;
          font-size: 0.9rem;
        }
        
        .product-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-primary {
          flex: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          text-decoration: none;
          text-align: center;
          display: block;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-secondary:hover {
          background: rgba(102, 126, 234, 0.2);
        }
        
        .view-all-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
          margin: 0 auto;
        }
        
        .view-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .text-center {
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
          
          .hero p {
            font-size: 1rem;
          }
          
          .products-header h2 {
            font-size: 2rem;
          }
          
          .header-container {
            padding: 0 1rem;
          }
          
          .nav-links {
            display: none;
          }
          
          .hamburger {
            display: flex;
          }
          
          .nav-arrow {
            display: none;
          }
          
          .categories-wrapper {
            gap: 0;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            padding: 1rem;
          }
          
          .stat-item {
            padding: 0.75rem;
          }
          
          .stat-item h3 {
            font-size: 1.2rem;
          }
          
          .products-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .header-container {
            padding: 0 0.5rem;
          }
          
          .logo {
            font-size: 1.2rem;
          }
          
          .logo-icon {
            width: 35px;
            height: 35px;
          }
          
          .hero {
            padding: 2rem 0;
          }
          
          .hero h1 {
            font-size: 1.5rem;
          }
          
          .search-input {
            font-size: 1rem;
            padding: 0.875rem 2.5rem 0.875rem 0.875rem;
          }
          
          .search-button {
            padding: 0.625rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">M</div>
            <span>MTP Supply</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav">
            <div className="nav-links">
              <a href="/products">สินค้า</a>
              <a href="#categories">หมวดหมู่</a>
              <a href="/about">เกี่ยวกับเรา</a>
              <a href="/contact">ติดต่อเรา</a>
              
              {/* Login Dropdown */}
              <div className="login-dropdown">
                <button className="login-btn">เข้าสู่ระบบ</button>
                <div className="login-dropdown-menu">
                  <a href="/auth/signin">สำหรับลูกค้า</a>
                  <a href="/vendor/login">สำหรับ Vendor</a>
                  <a href="/admin/login">สำหรับ Admin</a>
                  <a href="/admin/super" id="superAdminLink" style={{display: 'none'}}>🔥 Super Admin</a>
                </div>
              </div>
            </div>
          </nav>

          <div className="header-actions">
            <div className="cart-icon">🛒</div>
            
            {/* Hamburger Menu (Mobile) */}
            <div className="hamburger" onClick={() => window.toggleMobileMenu?.()}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          <div className="mobile-menu" id="mobileMenu">
            <a href="/products">สินค้า</a>
            <a href="#categories">หมวดหมู่</a>
            <a href="/about">เกี่ยวกับเรา</a>
            <a href="/contact">ติดต่อเรา</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1>ตลาดสินค้า Surplus คุณภาพดี</h1>
          <p>ค้นหาสินค้าเหลือใช้จากโรงงาน คุณภาพดี ราคาประหยัด จากผู้ขายที่เชื่อถือได้ทั่วประเทศ</p>

          <div className="search-container">
            <input type="text" className="search-input" placeholder="ค้นหาสินค้าที่ต้องการ..." id="searchInput" />
            <button className="search-button" onClick={() => window.handleSearch?.()}>ค้นหา</button>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-item">
              <h3>300+</h3>
              <p>ผู้ใช้งาน</p>
            </div>
            <div className="stat-item">
              <h3>150+</h3>
              <p>ผู้ขาย</p>
            </div>
            <div className="stat-item">
              <h3>฿5M+</h3>
              <p>GMV/เดือน</p>
            </div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>ความพึงพอใจ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="categories">
        <div className="categories-container">
          <h3>หมวดหมู่สินค้ายอดนิยม</h3>
          <div className="categories-wrapper">
            {/* Left Arrow */}
            <div className="nav-arrow left" id="leftArrow" onClick={() => window.scrollCategories?.('left')}>
              ←
            </div>
            
            <div className="categories-scroll" id="categoriesScroll">
              <div className="categories-grid">
                <button className="category-btn">
                  <span>💻</span>
                  อิเล็กทรอนิกส์
                </button>
                <button className="category-btn">
                  <span>🏠</span>
                  เครื่องใช้ไฟฟ้า
                </button>
                <button className="category-btn">
                  <span>👕</span>
                  แฟชั่น
                </button>
                <button className="category-btn">
                  <span>🌿</span>
                  บ้านและสวน
                </button>
                <button className="category-btn">
                  <span>⚽</span>
                  กีฬาและสุขภาพ
                </button>
                <button className="category-btn">
                  <span>📚</span>
                  หนังสือและสื่อ
                </button>
                <button className="category-btn">
                  <span>🔧</span>
                  เครื่องมือ
                </button>
                <button className="category-btn">
                  <span>🎨</span>
                  อื่นๆ
                </button>
              </div>
            </div>
            
            {/* Right Arrow */}
            <div className="nav-arrow right" id="rightArrow" onClick={() => window.scrollCategories?.('right')}>
              →
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="products">
        <div className="products-container">
          <div className="products-header">
            <h2>สินค้าแนะนำ</h2>
            <p>สินค้า Surplus คุณภาพดี ราคาประหยัด จากผู้ขายที่เชื่อถือได้</p>
          </div>

          <div className="products-grid">
            {/* Product 1 */}
            <div className="product-card">
              <div className="product-image">
                🏠
                <div className="product-badge">ลดราคา 37%</div>
                <div className="product-type used">มือสอง</div>
              </div>
              <div className="product-content">
                <h3 className="product-title">เครื่องใช้ไฟฟ้าคุณภาพดี</h3>
                <div className="product-price">
                  <span className="current">฿2,500</span>
                  <span className="original">฿4,000</span>
                </div>
                <p className="product-description">เครื่องใช้ไฟฟ้าเหลือใช้จากโรงงาน สภาพดี ประกันคุณภาพ</p>
                <div className="product-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="text">4.8 (124 รีวิว)</span>
                </div>
                <div className="product-actions">
                  <a href="/products" className="btn-primary">ดูรายละเอียด</a>
                  <button className="btn-secondary">❤️</button>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="product-card">
              <div className="product-image">
                💻
                <div className="product-badge">ลดราคา 44%</div>
                <div className="product-type new">ใหม่</div>
              </div>
              <div className="product-content">
                <h3 className="product-title">อุปกรณ์อิเล็กทรอนิกส์</h3>
                <div className="product-price">
                  <span className="current">฿1,800</span>
                  <span className="original">฿3,200</span>
                </div>
                <p className="product-description">อุปกรณ์อิเล็กทรอนิกส์ใหม่ เหลือจากการผลิต คุณภาพเยี่ยม</p>
                <div className="product-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="text">4.9 (89 รีวิว)</span>
                </div>
                <div className="product-actions">
                  <a href="/products" className="btn-primary">ดูรายละเอียด</a>
                  <button className="btn-secondary">❤️</button>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="product-card">
              <div className="product-image">
                🔧
                <div className="product-badge">ลดราคา 37%</div>
                <div className="product-type used">มือสอง</div>
              </div>
              <div className="product-content">
                <h3 className="product-title">เครื่องมือและอุปกรณ์</h3>
                <div className="product-price">
                  <span className="current">฿950</span>
                  <span className="original">฿1,500</span>
                </div>
                <p className="product-description">เครื่องมือคุณภาพดี เหลือใช้จากโครงการ สภาพใหม่</p>
                <div className="product-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="text">4.7 (67 รีวิว)</span>
                </div>
                <div className="product-actions">
                  <a href="/products" className="btn-primary">ดูรายละเอียด</a>
                  <button className="btn-secondary">❤️</button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href="/products" className="view-all-btn">ดูสินค้าทั้งหมด</a>
          </div>
        </div>
      </section>
    </>
  );
}

