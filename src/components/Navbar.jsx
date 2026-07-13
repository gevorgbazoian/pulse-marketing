import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Gift } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Navbar({ onOpenBonus, onNavigate, onLogoClick, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();
  const dropdownRef = useRef(null);
  
  // Interactive Bento menu canvas states
  const navbarCanvasRef = useRef(null);
  const [navMouseCoords, setNavMouseCoords] = useState({ x: 0, y: 0 });
  const [navMouseHovered, setNavMouseHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Canvas particles generator for Navbar hover
  useEffect(() => {
    const canvas = navbarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial 6 blurred glow particles (red/gold theme)
    const particles = [];
    const colors = ['rgba(242, 183, 5, 0.28)', 'rgba(217, 61, 61, 0.24)'];

    for (let i = 0; i < 6; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 12 + 10,
        color: colors[i % 2],
        orbit: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005
      });
    }

    let animFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.orbit += p.speed;
        
        // Ambient drift
        p.vx += Math.cos(p.orbit) * 0.12;
        p.vy += Math.sin(p.orbit) * 0.12;

        // Hover mouse attraction
        if (navMouseHovered) {
          const dx = navMouseCoords.x - p.x;
          const dy = navMouseCoords.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            p.vx += (dx / dist) * force * 0.22;
            p.vy += (dy / dist) * force * 0.22;
          }
        }

        p.vx *= 0.86;
        p.vy *= 0.86;

        p.x += p.vx;
        p.y += p.vy;

        // Boundaries wrap
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Drawing glow circles
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrame = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animFrame);
    };
  }, [navMouseHovered, navMouseCoords]);

  const navLinks = [
    { name: t('nav.partners'), href: '#partners' },
    { name: t('nav.results'), href: '#results' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.aboutUs'), href: '#about' },
    { name: t('nav.blog'), href: '#blog' },
    { name: t('nav.contact'), href: '#contact' }
  ];

  const flags = {
    hy: '🇦🇲',
    en: '🇬🇧',
    ru: '🇷🇺'
  };

  const langNames = {
    hy: 'Հայերեն',
    en: 'English',
    ru: 'Русский'
  };

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href, { x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setNavMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' 
          : 'bg-transparent py-5'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        transition: 'var(--transition-smooth)',
        backgroundColor: scrolled ? 'rgba(253, 252, 247, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        padding: scrolled ? '0.8rem clamp(1rem, 2.5vw, 2rem)' : '1.5rem clamp(1rem, 2.5vw, 2rem)'
      }}
    >
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: '1rem'
        }}
      >
        {/* Brand Logo */}
        <a 
          href="#" 
          onClick={onLogoClick}
          className="logo-anchor"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '1.4rem',
            letterSpacing: '-0.02em',
            position: 'relative'
          }}
        >
          <span>pulse</span>
          <span 
            className="logo-dot-container"
            style={{
              position: 'relative',
              width: '8px',
              height: '8px',
              display: 'inline-block',
              alignSelf: 'flex-end',
              marginBottom: '6px'
            }}
          >
            <span 
              className="logo-dot"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--accent)',
                borderRadius: '50%',
                display: 'block'
              }}
            />
            {/* 6 Mini Galaxy Orbiting Dots */}
            {[...Array(6)].map((_, i) => (
              <span key={i} className={`logo-galaxy-dot galaxy-dot-${i}`} />
            ))}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Marketing</span>
        </a>

        {/* Desktop Navigation Links Container (Centered Pill) */}
        <div 
          className="desktop-links-menu"
          onMouseEnter={() => {
            setNavMouseHovered(true);
            window.dispatchEvent(new CustomEvent('navbar-hover-state', { detail: { hovered: true } }));
          }}
          onMouseLeave={() => {
            setNavMouseHovered(false);
            window.dispatchEvent(new CustomEvent('navbar-hover-state', { detail: { hovered: false } }));
          }}
          onMouseMove={handleMouseMove}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 1.2vw, 20px)',
            justifyContent: 'center',
            flexShrink: 1,
            padding: '0.35rem clamp(0.6rem, 1.5vw, 1.5rem)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Bento Menu Canvas Particles background */}
          <canvas 
            ref={navbarCanvasRef} 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none', 
              zIndex: 0 
            }} 
          />

          {navLinks.map((link) => {
            const isLinkActive = 
              (link.href === '#services' && currentPage === 'services') ||
              (link.href === '#results' && currentPage === 'results') ||
              (link.href === '#about' && currentPage === 'about') ||
              (link.href === '#blog' && currentPage === 'blog') ||
              (link.href === '#contact' && currentPage === 'contact');

            return (
              <div key={link.href} style={{ position: 'relative', zIndex: 1 }}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className="nav-item-link"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(11px, 0.8vw, 13px)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    position: 'relative',
                    padding: '0.2rem 0',
                    display: 'block',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {link.name}
                </a>
                <div className="nav-flatline-container">
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
                    {/* Grey static baseline */}
                    <path d="M 0 5 H 40 L 45 1 L 50 9 L 55 5 H 100" fill="none" stroke="rgba(33,34,36,0.1)" strokeWidth="1.2" />
                    {/* Gold active heartbeat sweep */}
                    <path className={`nav-flatline-pulse ${isLinkActive ? 'active' : ''}`} d="M 0 5 H 40 L 45 1 L 50 9 L 55 5 H 100" fill="none" stroke="var(--accent)" strokeWidth="1.8" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Actions Container (Right) */}
        <div 
          className="desktop-actions-menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexShrink: 0
          }}
        >
          {/* Desktop Language Switcher Dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: scrolled ? 'var(--bg-secondary)' : 'rgba(253, 252, 247, 0.5)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <span>{flags[language]}</span>
              <span style={{ textTransform: 'uppercase' }}>{language}</span>
              <span style={{ fontSize: '0.6rem', marginLeft: '2px', opacity: 0.7 }}>▼</span>
            </button>

            {langDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  minWidth: '130px',
                  zIndex: 1001,
                  animation: 'fadeIn 0.2s ease-out'
                }}
              >
                {Object.keys(flags).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.8rem',
                      width: '100%',
                      border: 'none',
                      background: language === lang ? 'var(--bg-secondary)' : 'transparent',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      fontWeight: language === lang ? 700 : 500,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <span>{flags[lang]}</span>
                    <span>{langNames[lang]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bonus Button */}
          <button
            onClick={onOpenBonus}
            className="btn-secondary btn-bonus-gift"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--accent)',
              color: 'var(--text-primary)',
              border: 'none',
              padding: '0.5rem 1.2rem',
              borderRadius: '30px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(242, 183, 5, 0.25)',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(242, 183, 5, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(242, 183, 5, 0.25)';
            }}
          >
            <Gift size={16} className="gift-icon-class" />
            <span>{t('nav.bonus')}</span>
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: scrolled ? '57px' : '77px', // dynamically account for header height
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: 'var(--shadow-md)',
            borderTop: '1px solid var(--border)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            zIndex: 999
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                setIsOpen(false);
                handleNavLinkClick(e, link.href);
              }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {link.name}
            </a>
          ))}

          {/* Mobile Language Switcher Row */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
              marginTop: '0.5rem'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Language</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {Object.keys(flags).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.4rem 0.8rem',
                    border: '1px solid',
                    borderColor: language === lang ? 'var(--accent)' : 'var(--border)',
                    borderRadius: '16px',
                    backgroundColor: language === lang ? 'rgba(242, 183, 5, 0.1)' : 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span>{flags[lang]}</span>
                  <span style={{ textTransform: 'uppercase' }}>{lang}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenBonus();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--accent)',
              color: 'var(--text-primary)',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Gift size={16} />
            <span>{t('nav.bonus')} 🎁</span>
          </button>
        </div>
      )}

      {/* Responsive Styles helper */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .desktop-links-menu,
          .desktop-actions-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
