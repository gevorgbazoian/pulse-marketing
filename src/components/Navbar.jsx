import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Gift } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Navbar({ onOpenBonus, onNavigate, onLogoClick, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const lastScrollY = useRef(0);
  
  const { language, setLanguage, t } = useLanguage();
  const dropdownRef = useRef(null);
  
  // Interactive Bento menu canvas states
  const navbarCanvasRef = useRef(null);
  const [navMouseCoords, setNavMouseCoords] = useState({ x: 0, y: 0 });
  const [navMouseHovered, setNavMouseHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShrunk(true);
      } else if (currentScrollY < lastScrollY.current) {
        setShrunk(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeTheme, setActiveTheme] = useState('dark');

  useEffect(() => {
    if (currentPage !== 'home') {
      setActiveTheme('dark');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionTheme = entry.target.getAttribute('data-theme') || 'dark';
          setActiveTheme(sectionTheme);
        }
      });
    }, {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    });

    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, [currentPage]);

  const themeClass = activeTheme === 'light' ? 'theme-light' : 'theme-dark';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false);
  const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target)) {
        setMobileLangDropdownOpen(false);
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

  const allNavLinks = [
    { name: t('nav.partners'), href: '#partners' },
    { name: t('nav.results'), href: '#results' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.aboutUs'), href: '#about' },
    { name: t('nav.blog'), href: '#blog' },
    { name: t('nav.contact'), href: '#contact' }
  ];

  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const handleOutsideClickMore = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClickMore);
    return () => document.removeEventListener('mousedown', handleOutsideClickMore);
  }, []);

  const isMobile = windowWidth < 820;
  const isTabletNarrow = windowWidth >= 820 && windowWidth < 980;
  const isTabletWide = windowWidth >= 980 && windowWidth < 1180;

  // Priority navigation lists
  const visibleLinks = isMobile 
    ? [] 
    : (isTabletNarrow || isTabletWide)
      ? allNavLinks.filter(link => link.href !== '#blog' && link.href !== '#about')
      : allNavLinks;

  const dropdownLinks = (isTabletNarrow || isTabletWide)
    ? allNavLinks.filter(link => link.href === '#blog' || link.href === '#about')
    : [];

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
      className={`navbar fixed top-0 left-0 w-full z-50 ${themeClass} ${scrolled ? 'scrolled' : 'not-scrolled'}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        backgroundColor: !scrolled ? 'transparent' : (activeTheme === 'light' ? 'rgba(253, 252, 247, 0.85)' : 'rgba(15, 15, 17, 0.85)'),
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: !scrolled ? '1px solid transparent' : (activeTheme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255, 255, 255, 0.08)'),
        boxShadow: scrolled 
          ? (shrunk ? '0 10px 30px rgba(0, 0, 0, 0.15)' : '0 6px 20px rgba(0, 0, 0, 0.08)')
          : 'none',
        padding: shrunk
          ? '0.6rem clamp(1rem, 2.5vw, 2rem)'
          : (scrolled ? '1.1rem clamp(1rem, 2.5vw, 2rem)' : '1.5rem clamp(1rem, 2.5vw, 2rem)')
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
          className={`logo-anchor ${themeClass}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
            fontFamily: 'var(--font-heading)',
            position: 'relative'
          }}
        >
          {/* Vector P capsule */}
          <div 
            className="logo-icon-capsule"
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #FFCC00 0%, #FF3333 100%)',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(255, 204, 0, 0.25)',
              transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <svg style={{ width: '18px', height: '18px', color: '#000000', display: 'block' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 3h6a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H9v6H6V3zm3 3v6h3a3 3 0 0 0 3-3v0a3 3 0 0 0-3-3H9z"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '1.1' }}>
            <span className="logo-brand-text" style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>PULSE</span>
            <span className="logo-marketing" style={{ fontSize: '0.55rem', fontWeight: 800, color: '#A0A5AA', textTransform: 'uppercase', letterSpacing: '0.25em', marginTop: '2px' }}>Marketing</span>
          </div>
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
            gap: isTabletNarrow ? '10px' : 'clamp(8px, 1.2vw, 20px)',
            justifyContent: 'center',
            flexShrink: 1,
            padding: isTabletNarrow ? '0.25rem 0.8rem' : '0.35rem clamp(0.6rem, 1.5vw, 1.5rem)',
            position: 'relative',
            overflow: 'visible'
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

          {visibleLinks.map((link) => {
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
                    fontSize: isTabletNarrow ? '11px' : 'clamp(11px, 0.8vw, 13px)',
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

          {dropdownLinks.length > 0 && (
            <div ref={moreRef} style={{ position: 'relative', zIndex: 1 }}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontSize: isTabletNarrow ? '11px' : '13px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  padding: '0.2rem 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  outline: 'none'
                }}
              >
                <span>{language === 'hy' ? 'Ավելին' : language === 'ru' ? 'Еще' : 'More'}</span>
                <span style={{ fontSize: '0.65rem' }}>▼</span>
              </button>
              {moreDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    left: 0,
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-md)',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    minWidth: '150px',
                    zIndex: 1002,
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  {dropdownLinks.map((link) => {
                    const isLinkActive = 
                      (link.href === '#about' && currentPage === 'about') ||
                      (link.href === '#blog' && currentPage === 'blog');

                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => {
                          setMoreDropdownOpen(false);
                          handleNavLinkClick(e, link.href);
                        }}
                        style={{
                          display: 'block',
                          padding: '0.5rem 0.8rem',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: isLinkActive ? 'var(--accent)' : 'var(--text-primary)',
                          textDecoration: 'none',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderRadius: '8px',
                          backgroundColor: isLinkActive ? 'rgba(242, 183, 5, 0.1)' : 'transparent',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        {link.name}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}
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
              className="lang-dropdown-btn"
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

        {/* Mobile Toggle / Actions Wrapper */}
        <div 
          className="mobile-actions-wrapper"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.8rem'
          }}
        >
          {/* Mobile Language Switcher (Icon-only e.g. EN) */}
          <div ref={mobileDropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMobileLangDropdownOpen(!mobileLangDropdownOpen)}
              className="lang-dropdown-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: scrolled ? 'var(--bg-secondary)' : 'rgba(253, 252, 247, 0.5)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                outline: 'none',
                transition: 'var(--transition-fast)'
              }}
            >
              {language}
            </button>
            {mobileLangDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  minWidth: '110px',
                  zIndex: 1001,
                  animation: 'fadeIn 0.2s ease-out'
                }}
              >
                {Object.keys(flags).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setMobileLangDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem 0.6rem',
                      width: '100%',
                      border: 'none',
                      background: language === lang ? 'var(--bg-secondary)' : 'transparent',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      fontWeight: language === lang ? 700 : 500,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{flags[lang]}</span>
                    <span style={{ textTransform: 'uppercase' }}>{lang}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'block',
              padding: 0
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
        @media (max-width: 820px) {
          .desktop-links-menu,
          .desktop-actions-menu {
            display: none !important;
          }
          .mobile-actions-wrapper {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
