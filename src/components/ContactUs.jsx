import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const InstagramIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [errors, setErrors] = useState({ name: false, phone: false });
  const [successPulse, setSuccessPulse] = useState({ name: false, phone: false });
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);

  // IntersectionObserver to stagger reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        } else {
          setIsRevealed(false);
          setSent(false);
        }
      });
    }, { threshold: 0.15 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Form submission with mock sending latency & error shaking
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: !form.name.trim(),
      phone: !form.phone.trim()
    };

    if (newErrors.name || newErrors.phone) {
      setErrors(newErrors);
      // reset error shaker styles after animation duration
      setTimeout(() => {
        setErrors({ name: false, phone: false });
      }, 600);
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setForm({ name: '', company: '', phone: '', message: '' });
      setSuccessPulse({ name: false, phone: false });
    }, 1500); // 1.5s sending state loading duration
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    
    // Corrected success pulse anim feedback
    if (value.trim()) {
      if (field === 'name' || field === 'phone') {
        setSuccessPulse(prev => ({ ...prev, [field]: true }));
        setTimeout(() => {
          setSuccessPulse(prev => ({ ...prev, [field]: false }));
        }, 600);
      }
    }
  };

  const getCopyrightText = () => {
    if (language === 'hy') return 'Բոլոր իրավունքները պաշտպանված են:';
    if (language === 'ru') return 'Все права защищены.';
    return 'All rights reserved.';
  };

  return (
    <section 
      ref={sectionRef}
      id="contact-us" 
      data-theme="light" 
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 0'
      }}
    >
      {/* Background Subtle Floating EKG Lifelines */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.72,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path
            className="contact-bg-lifeline"
            d="M 0 150 H 300 L 320 50 L 340 350 L 360 200 L 380 150 H 700 L 720 50 L 740 350 L 760 200 L 780 150 H 1000"
            fill="none"
            stroke="rgba(255, 51, 51, 0.08)"
            strokeWidth="2"
          />
          <path
            className="contact-bg-lifeline"
            style={{ animationDelay: '-12s' }}
            d="M 0 250 H 150 L 170 120 L 190 380 L 210 280 L 230 250 H 550 L 570 120 L 590 380 L 610 280 L 630 250 H 1000"
            fill="none"
            stroke="rgba(255, 204, 0, 0.12)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="container-pad" style={{ position: 'relative', zIndex: 1 }}>
        
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Coordinates & Social Info (staggered fade-up) */}
          <div 
            className={`reveal-contact-element ${isRevealed ? 'revealed' : ''}`}
            style={{ transitionDelay: '0.1s' }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              {t('contactUs.title')}
            </h2>
            
            {/* Responsive text */}
            <div className="full-text">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
                {t('contactUs.descFull')}
              </p>
            </div>
            <div className="short-text">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.8rem', fontSize: '0.95rem' }}>
                {t('contactUs.descShort')}
              </p>
            </div>

            {/* Coordinates details */}
            <div 
              className={`reveal-contact-element ${isRevealed ? 'revealed' : ''}`}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem', transitionDelay: '0.25s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={iconBoxStyle}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('contactUs.phone')}</div>
                  <a href="tel:+37477770784" style={coordLinkStyle}>+374 77 77 07 84</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={iconBoxStyle}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('contactUs.email')}</div>
                  <a href="mailto:info@pulsemarketing.am" style={coordLinkStyle}>info@pulsemarketing.am</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={iconBoxStyle}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('contactUs.address')}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{t('contactUs.addressValue')}</div>
                </div>
              </div>
            </div>

            {/* Social Links (floating + glow tags) */}
            <div 
              className={`reveal-contact-element ${isRevealed ? 'revealed' : ''}`}
              style={{ transitionDelay: '0.4s' }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>{t('contactUs.socialTitle')}</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="https://www.instagram.com/pulse__marketing/" target="_blank" rel="noopener noreferrer" className="contact-social-btn hover-insta" style={socialLinkStyle} aria-label="Instagram">
                  <InstagramIcon size={20} />
                </a>
                <a href="https://www.facebook.com/people/Pulse-Marketing/61559868705070/" target="_blank" rel="noopener noreferrer" className="contact-social-btn hover-fb" style={socialLinkStyle} aria-label="Facebook">
                  <FacebookIcon size={20} />
                </a>
                <a href="https://www.linkedin.com/company/pulse-marketing-yvn/" target="_blank" rel="noopener noreferrer" className="contact-social-btn hover-linkin" style={socialLinkStyle} aria-label="LinkedIn">
                  <LinkedinIcon size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form & Map card (reveals smoothly) */}
          <div 
            className={`reveal-contact-element ${isRevealed ? 'revealed' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', transitionDelay: '0.5s' }}
          >
            
            {/* Form Container */}
            <div 
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{t('contactUs.formTitle')}</h3>
              
              {!sent ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input
                      type="text"
                      placeholder={t('contactUs.namePlaceholder')}
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`contact-input ${errors.name ? 'shake-error' : ''} ${successPulse.name ? 'pulse-success-gold' : ''}`}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder={t('contactUs.companyPlaceholder')}
                      value={form.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="contact-input"
                      style={inputStyle}
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder={t('contactUs.phonePlaceholder')}
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`contact-input ${errors.phone ? 'shake-error' : ''} ${successPulse.phone ? 'pulse-success-gold' : ''}`}
                    style={inputStyle}
                  />
                  <textarea
                    rows="4"
                    placeholder={t('contactUs.messagePlaceholder')}
                    value={form.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="contact-input"
                    style={{ ...inputStyle, resize: 'none', borderRadius: '12px' }}
                  />
                  
                  {/* Submit Button with pulse and spinning load indicator */}
                  <button 
                    type="submit" 
                    className="btn-primary contact-submit-btn" 
                    style={{ 
                      alignSelf: 'flex-start', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.6rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <span>{language === 'hy' ? 'Ուղարկվում է...' : language === 'ru' ? 'Отправка...' : 'Sending...'}</span>
                        <div className="btn-loading-spinner" />
                      </>
                    ) : (
                      <>
                        {t('contactUs.btnSend')} <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div 
                  style={{
                    backgroundColor: 'rgba(46, 204, 113, 0.12)',
                    color: '#2ECC71',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: 700,
                    animation: 'stat-card-pulse-active-anim 0.4s ease-out'
                  }}
                >
                  {t('contactUs.successMsg')}
                </div>
              )}
            </div>

            {/* Simulated Yerevan Map UI with hover line drawing */}
            <div 
              className="map-card-wrapper"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s'
              }}
              onClick={() => window.open('https://maps.google.com/?q=62+Hanrapetutyan+St,+Yerevan', '_blank')}
            >
              <div 
                className="map-icon-box"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(242, 183, 5, 0.1)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                🗺️
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t('contactUs.mapTitle')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hanrapetutyan Street 62, Yerevan (Kentron)</div>
              </div>
              
              {/* Map link drawing effect wrapper */}
              <div className="map-link-container" style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 800 }}>
                {t('contactUs.mapOpen')}
              </div>
            </div>

          </div>
        </div>

        {/* Footer info bar */}
        <div 
          style={{ 
            marginTop: '6rem', 
            borderTop: '1px solid var(--border)', 
            paddingTop: '2rem', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}
        >
          <div>© {new Date().getFullYear()} Pulse Marketing. {getCopyrightText()}</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Yerevan, Armenia</span>
          </div>
        </div>

      </div>
    </section>
  );
}

const iconBoxStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--border)'
};

const coordLinkStyle = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  textDecoration: 'none',
  transition: 'var(--transition-fast)'
};

const socialLinkStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--border)',
  transition: 'var(--transition-smooth)'
};

const inputStyle = {
  width: '100%',
  padding: '0.8rem 1.2rem',
  borderRadius: '30px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.85rem',
  outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s'
};

