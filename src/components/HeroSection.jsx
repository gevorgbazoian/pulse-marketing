import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function HeroSection({ onOpenBonus }) {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const canvasRef = useRef(null);
  const pulseRef = useRef(null);
  const badgePulseRef = useRef(null);
  
  // Ref handles for the Fluid Lighting blobs
  const blobRedRef = useRef(null);
  const blobGoldRef = useRef(null);
  
  // Refs for tracking interactive particle state
  const isAttractedToWord = useRef(false);
  const isAttractedToNavbar = useRef(false);
  const wordCenter = useRef({ x: 0, y: 0 });
  const particlesArray = useRef([]);
  const underlinePathRef = useRef(null);

  const { t, language } = useLanguage();

  const triggerPulseUnderline = () => {
    const path = underlinePathRef.current;
    if (!path) return;
    
    // Create an EKG heartbeat wave that moves left-to-right on the underline path
    const tl = gsap.timeline();
    tl.to(path, { attr: { d: "M 0 5 H 10 L 15 1 L 20 9 L 25 5 H 100" }, duration: 0.1, ease: "power1.inOut" })
      .to(path, { attr: { d: "M 0 5 H 25 L 30 1 L 35 9 L 40 5 H 100" }, duration: 0.1, ease: "power1.inOut" })
      .to(path, { attr: { d: "M 0 5 H 42 L 47 1 L 52 9 L 57 5 H 100" }, duration: 0.1, ease: "power1.inOut" })
      .to(path, { attr: { d: "M 0 5 H 60 L 65 1 L 70 9 L 75 5 H 100" }, duration: 0.1, ease: "power1.inOut" })
      .to(path, { attr: { d: "M 0 5 H 78 L 83 1 L 88 9 L 93 5 H 100" }, duration: 0.1, ease: "power1.inOut" })
      .to(path, { attr: { d: "M 0 5 H 90 L 93 1 L 96 9 L 99 5 H 100" }, duration: 0.1, ease: "power1.inOut" })
      .to(path, { attr: { d: "M 0 5 H 100" }, duration: 0.15, ease: "power2.out" });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Populate particles container
    const particles = [];
    const isMobileDevice = window.innerWidth < 820;
    const count = isMobileDevice ? 38 : 180;
    particlesArray.current = particles;

    // Set up canvas sizing
    const resizeCanvas = () => {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Populate particles for the first time ONLY after canvas dimensions are correctly set!
      if (particles.length === 0 && canvas.width > 0 && canvas.height > 0) {
        for (let i = 0; i < count; i++) {
          const rx = Math.random() * canvas.width;
          const ry = Math.random() * canvas.height;
          particles.push({
            x: rx,
            y: ry,
            origX: rx,
            origY: ry,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.8 + 1.2, // sizes between 1.2px and 3px
            color: Math.random() > 0.4 ? 'rgba(33, 34, 36, 0.28)' : 'rgba(242, 183, 5, 0.55)',
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.008
          });
        }
      } else if (oldWidth > 0 && oldHeight > 0) {
        // Rescale particle home coordinates proportionally so they always fill the full screen width and height!
        particles.forEach(p => {
          p.origX = (p.origX / oldWidth) * canvas.width;
          p.origY = (p.origY / oldHeight) * canvas.height;
        });
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    let mouse = { x: -1000, y: -1000, active: false };
    const handleMouseOverMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // Soft parallax drift for background Fluid lighting metaballs
      if (blobRedRef.current && blobGoldRef.current) {
        gsap.to(blobRedRef.current, {
          x: (mouse.x - rect.width / 2) * 0.08,
          y: (mouse.y - rect.height / 2) * 0.08,
          duration: 1.0,
          ease: 'power2.out'
        });
        gsap.to(blobGoldRef.current, {
          x: (mouse.x - rect.width / 2) * 0.04,
          y: (mouse.y - rect.height / 2) * 0.04,
          duration: 1.4,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleNavbarHover = (e) => {
      isAttractedToNavbar.current = e.detail.hovered;
      if (!e.detail.hovered && particlesArray.current) {
        // explosive kick on leave
        particlesArray.current.forEach(p => {
          const angle = Math.random() * Math.PI * 2;
          const force = Math.random() * 6 + 3;
          p.vx = Math.cos(angle) * force;
          p.vy = Math.sin(angle) * force;
        });
      }
    };

    window.addEventListener('navbar-hover-state', handleNavbarHover);

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseOverMove);
      heroElement.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Loop
    let time = 0;
    let animFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.015;
      
      // Get title bounding box to calculate text ricochet
      const titleEl = titleRef.current;
      let titleRect = null;
      if (titleEl) {
        const tr = titleEl.getBoundingClientRect();
        const cr = canvas.getBoundingClientRect();
        titleRect = {
          left: tr.left - cr.left - 12,
          right: tr.right - cr.left + 12,
          top: tr.top - cr.top - 12,
          bottom: tr.bottom - cr.top + 12
        };
      }

      const isMobileDevice = window.innerWidth < 820;

      // 8-second organic breathing cycle (4s squeeze, 4s expand)
      const breathingFactor = 1 + Math.sin(time * (Math.PI / 4)) * 0.06;

      particles.forEach((p, idx) => {
        // 1. Idle Float
        p.angle += p.speed;
        const driftX = Math.sin(p.angle) * 6;
        const driftY = Math.cos(p.angle) * 6;

        // Apply breathing factor to home coordinates
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const homeX = centerX + (p.origX - centerX) * breathingFactor;
        const homeY = centerY + (p.origY - centerY) * breathingFactor;

        if (isAttractedToWord.current) {
          // 2. High-speed flow towards the center of the accent word
          const dx = wordCenter.current.x - p.x;
          const dy = wordCenter.current.y - p.y;
          p.vx += dx * 0.16;
          p.vy += dy * 0.16;
        } else if (isAttractedToNavbar.current && !isMobileDevice) {
          // 3. Flow behind the Navbar Capsule Menu creating a glowing, fluffy halo cloud
          const spreadX = Math.cos(idx * 7) * 280;
          const spreadY = Math.sin(idx * 13) * 20;
          const targetX = canvas.width / 2 + spreadX;
          const targetY = 38 + spreadY + Math.sin(p.angle * 2) * 8;
          
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          p.vx += dx * 0.15;
          p.vy += dy * 0.15;
        } else if (mouse.active && !isMobileDevice) {
          // 4. Magnetic Pulse: Settle as a halo outline around the mouse cursor
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            // Settle on a circular path around the mouse
            const theta = Math.atan2(dy, dx);
            const targetX = mouse.x + Math.cos(theta) * 65;
            const targetY = mouse.y + Math.sin(theta) * 65;

            p.vx += (targetX - p.x) * 0.12;
            p.vy += (targetY - p.y) * 0.12;
          } else {
            p.vx += (homeX + driftX - p.x) * 0.03;
            p.vy += (homeY + driftY - p.y) * 0.03;
          }
        } else {
          // 5. Default state: return to home position (breathing!)
          p.vx += (homeX + driftX - p.x) * 0.03;
          p.vy += (homeY + driftY - p.y) * 0.03;
        }

        // Apply Damping and Update positions
        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;

        // 6. Typography ricochet / boundary collision
        if (titleRect && p.x > titleRect.left && p.x < titleRect.right && p.y > titleRect.top && p.y < titleRect.bottom) {
          const dL = p.x - titleRect.left;
          const dR = titleRect.right - p.x;
          const dT = p.y - titleRect.top;
          const dB = titleRect.bottom - p.y;
          const minDist = Math.min(dL, dR, dT, dB);

          if (minDist === dL) {
            p.x = titleRect.left - 2;
            p.vx = -Math.abs(p.vx) * 0.8 - 0.3;
          } else if (minDist === dR) {
            p.x = titleRect.right + 2;
            p.vx = Math.abs(p.vx) * 0.8 + 0.3;
          } else if (minDist === dT) {
            p.y = titleRect.top - 2;
            p.vy = -Math.abs(p.vy) * 0.8 - 0.3;
          } else {
            p.y = titleRect.bottom + 2;
            p.vy = Math.abs(p.vy) * 0.8 + 0.3;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('navbar-hover-state', handleNavbarHover);
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseOverMove);
        heroElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animFrameId);
    };
  }, [language]);

  useEffect(() => {
    // 1. Reveal letters and words with spring-back physics
    const titleElements = titleRef.current.querySelectorAll('.reveal-word-inner');
    gsap.fromTo(titleElements,
      { yPercent: 100, rotate: '2.5deg' },
      { 
        yPercent: 0, 
        rotate: '0deg', 
        duration: 1.1, 
        stagger: 0.07, 
        ease: 'back.out(1.8)', 
        delay: 0.45,
        onComplete: () => {
          // Trigger neon glow flash on the accent word
          const accentWord = titleRef.current.querySelector('.accent-word-neon');
          if (accentWord) {
            accentWord.classList.add('pulse-neon-flash');
          }
        }
      }
    );

    // 2. Pulse dot animations
    gsap.fromTo(pulseRef.current,
      { scale: 0.8, opacity: 0.5 },
      { scale: 1.3, opacity: 0, duration: 2, repeat: -1, ease: 'sine.out' }
    );
    gsap.fromTo(badgePulseRef.current,
      { scale: 1, opacity: 0.8 },
      { scale: 2.8, opacity: 0, duration: 1.8, repeat: -1, ease: 'power1.out' }
    );
  }, [t]);

  const renderTitle = () => {
    const titleText = t('hero.title');
    const accentWords = ['Pulse', 'Զարկերը', 'Пульс'];
    let matchedWord = '';

    for (const accentWord of accentWords) {
      if (titleText.includes(accentWord)) {
        matchedWord = accentWord;
        break;
      }
    }

    if (matchedWord) {
      const parts = titleText.split(matchedWord);
      
      const wrapWords = (text) => {
        return text.split(' ').map((word, idx) => {
          if (!word) return null;
          return (
            <span key={idx} className="reveal-word-wrapper" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
              <span className="reveal-word-inner" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {word}&nbsp;
              </span>
            </span>
          );
        });
      };

      return (
        <>
          {wrapWords(parts[0])}
          <span 
            className="accent-word-neon-container" 
            style={{ position: 'relative', display: 'inline-block', verticalAlign: 'bottom' }}
          >
            <span className="reveal-word-wrapper" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
              <span 
                className="reveal-word-inner accent-word-neon" 
                style={{ display: 'inline-block', color: 'var(--accent)', fontWeight: 900, cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  isAttractedToWord.current = true;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const canvasRect = canvasRef.current.getBoundingClientRect();
                  wordCenter.current = {
                    x: rect.left - canvasRect.left + rect.width / 2,
                    y: rect.top - canvasRect.top + rect.height / 2
                  };
                  e.currentTarget.classList.add('pulse-neon-flash');
                  triggerPulseUnderline();
                }}
                onMouseLeave={(e) => {
                  isAttractedToWord.current = false;
                  // Explosive outward kick for all particles when leaving hover
                  if (particlesArray.current) {
                    particlesArray.current.forEach(p => {
                      const angle = Math.random() * Math.PI * 2;
                      const force = Math.random() * 9 + 5;
                      p.vx = Math.cos(angle) * force;
                      p.vy = Math.sin(angle) * force;
                    });
                  }
                }}
              >
                {matchedWord}
              </span>
            </span>
            {/* Drawing cardiogram pulse underline */}
            <svg className="accent-word-underline-svg" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path ref={underlinePathRef} className="accent-underline-path" d="M 0 5 H 100" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          &nbsp;
          {wrapWords(parts[1])}
        </>
      );
    }

    return titleText;
  };

  return (
    <section 
      ref={heroRef}
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '8rem 2rem 4rem',
        position: 'relative',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden'
      }}
    >
      {/* Background Soft Fluid Lighting (The Pulse Aura) */}
      <div 
        ref={blobRedRef}
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 61, 61, 0.08) 0%, rgba(217, 61, 61, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 1,
          top: '15%',
          left: '20%',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />
      <div 
        ref={blobGoldRef}
        style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242, 183, 5, 0.09) 0%, rgba(242, 183, 5, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 1,
          top: '55%',
          left: '60%',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />

      {/* HTML5 Interactive Particle Field Canvas */}
      <canvas 
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div 
        style={{
          maxWidth: '850px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          zIndex: 2,
          position: 'relative'
        }}
      >
        {/* Slogan Badge with Breathing Aura Ring */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'var(--bg-secondary)',
            padding: '0.5rem 1.2rem',
            borderRadius: '50px',
            border: '1px solid var(--border)'
          }}
        >
          <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
            <span ref={badgePulseRef} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'var(--pulse-red)', borderRadius: '50%' }} />
            <span ref={pulseRef} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'var(--pulse-red)', borderRadius: '50%' }} />
            <span style={{ position: 'relative', width: '8px', height: '8px', backgroundColor: 'var(--pulse-red)', borderRadius: '50%' }} />
          </span>
          <span 
            style={{ 
              fontFamily: 'var(--font-heading)', 
              fontWeight: 800, 
              fontSize: '0.75rem', 
              letterSpacing: '0.15em', 
              color: 'var(--text-primary)',
              textTransform: 'uppercase'
            }}
          >
            {t('hero.badge')}
          </span>
        </div>

        {/* Word-by-word Reveal Title */}
        <h1 
          ref={titleRef}
          style={{
            fontSize: 'clamp(42px, 8vw, 84px)',
            lineHeight: '1.15',
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)',
            maxWidth: '780px'
          }}
        >
          {renderTitle()}
        </h1>

        {/* Description Paragraph */}
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="full-text">
            <p 
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.7'
              }}
            >
              {t('hero.descFull1')}
            </p>
            <p 
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                marginTop: '0.8rem',
                fontStyle: 'italic'
              }}
            >
              {t('hero.descFull2')}
            </p>
          </div>

          <div className="short-text">
            <p 
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}
            >
              {t('hero.descShort')}
            </p>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center' 
          }}
        >
          {/* Services: Liquid Fill Hover button */}
          <a 
            href="#services" 
            className="btn-primary btn-liquid-fill" 
            style={{ textDecoration: 'none', position: 'relative', overflow: 'hidden' }}
          >
            <span className="liquid-bg" />
            <span className="btn-text-content">{t('hero.btnServices')}</span>
          </a>

          {/* Free Audit: High-Voltage Cardiogram Stroke outline button */}
          <button 
            onClick={onOpenBonus} 
            className="btn-voltage-audit"
          >
            <svg className="voltage-border-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <rect className="voltage-rect" x="0" y="0" width="100%" height="100%" rx="8" fill="none" stroke="rgba(33,34,36,0.12)" strokeWidth="1.5" />
            </svg>
            <span>{t('hero.btnAudit')}</span>
          </button>
        </div>
      </div>

      {/* Down arrow link with Double-Tap Pulse Loop */}
      <a 
        href="#partners" 
        className="hero-scroll-arrow"
        style={{
          position: 'absolute',
          bottom: '2rem',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          letterSpacing: '0.1em',
          zIndex: 2
        }}
      >
        <span>{t('hero.scroll')}</span>
        <ArrowDown size={16} />
      </a>

      <style>{`
        @media (max-width: 820px) {
          .btn-liquid-fill, .btn-voltage-audit {
            width: 100% !important;
            height: 56px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 1.5rem !important;
            box-sizing: border-box !important;
            border-radius: 28px !important;
          }
          div[style*="marginTop: 1.5rem"] {
            width: 100% !important;
            padding: 0 1rem !important;
            box-sizing: border-box !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}
