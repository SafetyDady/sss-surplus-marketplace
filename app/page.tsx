'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ margin: 0, padding: 0, boxSizing: 'border-box', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", lineHeight: 1.6, color: '#333', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '1rem 0', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
      }}>
        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto', 
          padding: '0 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <div style={{ 
              background: 'white', 
              color: '#667eea', 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold' 
            }}>
              M
            </div>
            <span>MTP Supply</span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#products" style={{ color: 'white', textDecoration: 'none', transition: 'opacity 0.3s' }}>สินค้า</a>
              <a href="#categories" style={{ color: 'white', textDecoration: 'none', transition: 'opacity 0.3s' }}>หมวดหมู่</a>
              <a href="#about" style={{ color: 'white', textDecoration: 'none', transition: 'opacity 0.3s' }}>เกี่ยวกับเรา</a>
            </div>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '0.5rem', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              transition: 'background 0.3s' 
            }}>
              🛒
            </div>
            <Link href="/auth/register" style={{ 
              background: '#ff6b6b', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600', 
              transition: 'all 0.3s', 
              textDecoration: 'none', 
              display: 'inline-block' 
            }}>
              เข้าร่วมเป็นผู้ขาย
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '3rem 0', 
        textAlign: 'center' 
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '700' }}>
            ตลาดสินค้า Surplus คุณภาพดี
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            ค้นหาสินค้าเหลือใช้จากโรงงาน คุณภาพดี ราคาประหยัด จากผู้ขายที่เชื่อถือได้ทั่วประเทศ
          </p>

          <div style={{ maxWidth: '600px', margin: '0 auto 2rem', position: 'relative' }}>
            <input
              type="text"
              placeholder="ค้นหาสินค้าที่ต้องการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ 
                width: '100%', 
                padding: '1rem 3rem 1rem 1rem', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '1.1rem', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <button
              onClick={handleSearch}
              style={{ 
                position: 'absolute', 
                right: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                background: '#667eea', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600' 
              }}
            >
              ค้นหา
            </button>
          </div>

          {/* Dashboard Preview */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '12px', 
            padding: '1.5rem', 
            margin: '2rem auto 0', 
            maxWidth: '800px', 
            backdropFilter: 'blur(10px)', 
            height: '200px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem', 
              width: '100%' 
            }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '8px', 
                backdropFilter: 'blur(5px)' 
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>300+</h3>
                <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>ผู้ใช้งาน</p>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '8px', 
                backdropFilter: 'blur(5px)' 
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>150+</h3>
                <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>ผู้ขาย</p>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '8px', 
                backdropFilter: 'blur(5px)' 
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>฿5M+</h3>
                <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>GMV/เดือน</p>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '8px', 
                backdropFilter: 'blur(5px)' 
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>98%</h3>
                <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>ความพึงพอใจ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '1.2rem 0' 
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          <h3 style={{ 
            color: 'white', 
            textAlign: 'center', 
            marginBottom: '1.2rem', 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            opacity: 0.9 
          }}>
            หมวดหมู่สินค้ายอดนิยม
          </h3>
          <div style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              padding: '0.4rem 0', 
              minWidth: 'max-content' 
            }}>
              {[
                { icon: '💻', name: 'อิเล็กทรอนิกส์' },
                { icon: '🏠', name: 'เครื่องใช้ไฟฟ้า' },
                { icon: '👕', name: 'แฟชั่น' },
                { icon: '🌿', name: 'บ้านและสวน' },
                { icon: '⚽', name: 'กีฬาและสุขภาพ' },
                { icon: '📚', name: 'หนังสือและสื่อ' },
                { icon: '🔧', name: 'เครื่องมือ' },
                { icon: '🎨', name: 'อื่นๆ' }
              ].map((category, index) => (
                <button
                  key={index}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.15)', 
                    color: 'white', 
                    border: '2px solid rgba(255, 255, 255, 0.3)', 
                    padding: '0.6rem 1.2rem', 
                    borderRadius: '20px', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '0.9rem', 
                    transition: 'all 0.3s ease', 
                    whiteSpace: 'nowrap', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    backdropFilter: 'blur(10px)', 
                    minHeight: '36px' 
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Hero Section */}
      <section id="products" style={{ padding: '4rem 0', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>
              สินค้าแนะนำ
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              สินค้า Surplus คุณภาพดี ราคาประหยัด จากผู้ขายที่เชื่อถือได้
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2rem', 
            marginBottom: '3rem' 
          }}>
            {[
              {
                title: 'เครื่องใช้ไฟฟ้าคุณภาพดี',
                price: '฿2,500',
                originalPrice: '฿4,000',
                description: 'เครื่องใช้ไฟฟ้าเหลือใช้จากโรงงาน สภาพดี ประกันคุณภาพ',
                rating: '4.8',
                reviews: '124',
                badge: 'ลดราคา 37%',
                type: 'used',
                icon: '🏠'
              },
              {
                title: 'อุปกรณ์อิเล็กทรอนิกส์',
                price: '฿1,800',
                originalPrice: '฿3,200',
                description: 'อุปกรณ์อิเล็กทรอนิกส์ใหม่ เหลือจากการผลิต คุณภาพเยี่ยม',
                rating: '4.9',
                reviews: '89',
                badge: 'ลดราคา 44%',
                type: 'new',
                icon: '💻'
              },
              {
                title: 'เครื่องมือและอุปกรณ์',
                price: '฿950',
                originalPrice: '฿1,500',
                description: 'เครื่องมือคุณภาพดี เหลือใช้จากโครงการ สภาพใหม่',
                rating: '4.7',
                reviews: '67',
                badge: 'ลดราคา 37%',
                type: 'used',
                icon: '🔧'
              }
            ].map((product, index) => (
              <div
                key={index}
                style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', 
                  transition: 'all 0.3s ease', 
                  cursor: 'pointer' 
                }}
              >
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  background: 'linear-gradient(45deg, #f0f2f5, #e1e8ed)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '3rem', 
                  color: '#667eea', 
                  position: 'relative' 
                }}>
                  {product.icon}
                  <div style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    left: '1rem', 
                    background: '#ff6b6b', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: '600' 
                  }}>
                    {product.badge}
                  </div>
                  <div style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    right: '1rem', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '15px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    background: product.type === 'new' 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white'
                  }}>
                    {product.type === 'new' ? 'ใหม่' : 'มือสอง'}
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem', 
                    color: '#333' 
                  }}>
                    {product.title}
                  </h3>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '1.4rem', 
                      fontWeight: '700', 
                      color: '#667eea' 
                    }}>
                      {product.price}
                    </span>
                    <span style={{ 
                      textDecoration: 'line-through', 
                      color: '#999', 
                      fontSize: '1rem', 
                      marginLeft: '0.5rem' 
                    }}>
                      {product.originalPrice}
                    </span>
                  </div>
                  <p style={{ 
                    color: '#666', 
                    fontSize: '0.9rem', 
                    marginBottom: '1rem', 
                    lineHeight: 1.4 
                  }}>
                    {product.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginBottom: '1rem' 
                  }}>
                    <span style={{ color: '#ffd700' }}>⭐⭐⭐⭐⭐</span>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      {product.rating} ({product.reviews} รีวิว)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href="/products" style={{ 
                      flex: 1, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: 'white', 
                      padding: '0.75rem 1rem', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontWeight: '600', 
                      transition: 'all 0.3s',
                      textDecoration: 'none',
                      textAlign: 'center',
                      display: 'block'
                    }}>
                      ดูรายละเอียด
                    </Link>
                    <button style={{ 
                      background: '#f8fafc', 
                      border: '2px solid #e2e8f0', 
                      padding: '0.75rem', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s', 
                      color: '#666' 
                    }}>
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/products" style={{ 
            display: 'block', 
            margin: '3rem auto 0', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white', 
            padding: '1rem 2rem', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: '600', 
            fontSize: '1.1rem', 
            transition: 'all 0.3s',
            textDecoration: 'none',
            textAlign: 'center',
            width: 'fit-content'
          }}>
            ดูสินค้าทั้งหมด
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>
              หมวดหมู่สินค้า
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              สินค้า Surplus หลากหลายประเภท พร้อมส่งทั่วประเทศ
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              { icon: '💻', title: 'อิเล็กทรอนิกส์', desc: 'คอมพิวเตอร์ โทรศัพท์ อุปกรณ์ไอที' },
              { icon: '🏠', title: 'เครื่องใช้ไฟฟ้า', desc: 'เครื่องใช้ในบ้าน อุปกรณ์ครัว' },
              { icon: '👕', title: 'แฟชั่น', desc: 'เสื้อผ้า รองเท้า เครื่องประดับ' },
              { icon: '🌿', title: 'บ้านและสวน', desc: 'เฟอร์นิเจอร์ ของตแต่งบ้าน' },
              { icon: '⚽', title: 'กีฬาและสุขภาพ', desc: 'อุปกรณ์กีฬา เครื่องออกกำลังกาย' },
              { icon: '📚', title: 'หนังสือและสื่อ', desc: 'หนังสือ ซีดี ดีวีดี' }
            ].map((category, index) => (
              <div
                key={index}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white', 
                  padding: '2rem', 
                  borderRadius: '16px', 
                  textAlign: 'center', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s' 
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {category.icon}
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  {category.title}
                </h3>
                <p style={{ opacity: 0.9 }}>
                  {category.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#2d3748', color: 'white', padding: '3rem 0 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem', 
            marginBottom: '2rem' 
          }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>MTP Supply</h3>
              <p style={{ color: '#cbd5e0', lineHeight: 1.6 }}>
                แพลตฟอร์มซื้อขายสินค้า Surplus ที่ใหญ่ที่สุดในประเทศไทย 
                เชื่อมต่อผู้ซื้อและผู้ขายอย่างปลอดภัย
              </p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>ลิงก์ด่วน</h3>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: '#cbd5e0', textDecoration: 'none' }}>เกี่ยวกับเรา</a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: '#cbd5e0', textDecoration: 'none' }}>วิธีการใช้งาน</a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: '#cbd5e0', textDecoration: 'none' }}>นโยบายความเป็นส่วนตัว</a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: '#cbd5e0', textDecoration: 'none' }}>เงื่อนไขการใช้งาน</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>ติดต่อเรา</h3>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '0.5rem', color: '#cbd5e0' }}>
                  📧 support@mtpsupply.com
                </li>
                <li style={{ marginBottom: '0.5rem', color: '#cbd5e0' }}>
                  📞 02-123-4567
                </li>
                <li style={{ marginBottom: '0.5rem', color: '#cbd5e0' }}>
                  📍 กรุงเทพมหานคร ประเทศไทย
                </li>
              </ul>
            </div>
          </div>
          <div style={{ 
            borderTop: '1px solid #4a5568', 
            paddingTop: '1rem', 
            textAlign: 'center', 
            color: '#cbd5e0' 
          }}>
            <p>&copy; 2024 MTP Supply. สงวนลิขสิทธิ์ทั้งหมด.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

