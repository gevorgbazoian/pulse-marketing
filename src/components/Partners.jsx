import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../LanguageContext';

export default function Partners({ onNavigate }) {
  const { t, language } = useLanguage();
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeHoverIndex, setActiveHoverIndex] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Mobile Ticker State
  const [selectedMobileIndex, setSelectedMobileIndex] = useState(null);

  const activeHoverIndexRef = useRef(activeHoverIndex);
  const mousePosRef = useRef(mousePos);

  useEffect(() => {
    activeHoverIndexRef.current = activeHoverIndex;
  }, [activeHoverIndex]);

  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos]);

  const clients = [
    { name: 'KOOM', type: t('partners.types.coffee'), desc: 'Specialty Coffee / SMM + Content / 1.2M+ views' },
    { name: 'Storia', type: t('partners.types.restaurant'), desc: 'Premium Restaurant / Branding + SMM / 2.5M+ views' },
    { name: 'Villa Dudu', type: t('partners.types.guesthouse'), desc: 'Boutique Guest House / Digital Ads / 800K+ reach' },
    { name: 'Coffee Centre', type: t('partners.types.roastery'), desc: 'Coffee Roastery & Academy / SMM / 1.5M+ impressions' },
    { name: 'Mah-Chah', type: t('partners.types.tea'), desc: 'Organic loose leaf tea blends / Content / 600K+ views' },
    { name: 'Après', type: t('partners.types.premium'), desc: 'Exclusive Leisure Spaces / SMM + Ads / 1.8M+ views' },
    { name: 'Noma', type: t('partners.types.bar'), desc: 'Award-winning mixology & lounge / Branding / 900K+ reach' },
    { name: 'Gilla', type: t('partners.types.visual'), desc: 'Avant-garde digital branding / Visuals / 1.1M+ views' }
  ];

  // Desktop coordinates for a perfect symmetric 2x4 Kinetic Grid
  const coords = [
    // Row 0
    { left: '5%', top: '40px', factor: 0.8, fontSize: '1.8rem', fontWeight: 900 },
    { left: '30%', top: '40px', factor: 1.2, fontSize: '2.6rem', fontWeight: 900 },
    { left: '55%', top: '40px', factor: 0.9, fontSize: '1.25rem', fontWeight: 800 },
    { left: '80%', top: '40px', factor: 1.15, fontSize: '1.3rem', fontWeight: 800 },
    // Row 1
    { left: '5%', top: '180px', factor: 1.1, fontSize: '1.25rem', fontWeight: 800 },
    { left: '30%', top: '180px', factor: 0.85, fontSize: '2.6rem', fontWeight: 900 },
    { left: '55%', top: '180px', factor: 1.2, fontSize: '1.8rem', fontWeight: 900 },
    { left: '80%', top: '180px', factor: 0.95, fontSize: '1.8rem', fontWeight: 900 }
  ];

  // Initial chaotic positions for the "shoot in" scroll reveal animation
  const initialPositions = [
    { left: '-35%', top: '40px', rotate: '0deg' },    // KOOM shoots from left
    { left: '30%', top: '-45%', rotate: '0deg' },    // Storia shoots from top
    { left: '55%', top: '-45%', rotate: '-10deg' },  // Villa Dudu shoots from top-right
    { left: '130%', top: '10px', rotate: '15deg' },  // Coffee Centre shoots from right
    { left: '-30%', top: '180px', rotate: '-10deg' }, // Mah-Chah shoots from bottom-left
    { left: '30%', top: '145%', rotate: '0deg' },    // Après shoots from bottom
    { left: '55%', top: '145%', rotate: '10deg' },   // Noma shoots from bottom-right
    { left: '130%', top: '220px', rotate: '20deg' }  // Gilla shoots from bottom-right
  ];

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRevealed(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Title Stagger Animation on Scroll Reveal
  useEffect(() => {
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char-reveal');
      if (isRevealed) {
        gsap.fromTo(chars, 
          { y: 30, rotate: '4deg', opacity: 0 },
          { 
            y: 0, 
            rotate: '0deg', 
            opacity: 1, 
            duration: 0.7, 
            stagger: 0.02, 
            ease: 'back.out(1.8)',
            delay: 0.1
          }
        );
      } else {
        gsap.killTweensOf(chars);
        gsap.set(chars, { y: 30, opacity: 0 });
      }
    }
  }, [isRevealed, language]);

  // Partners background Canvas particles physics engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle Setup based on device width
    const particles = [];
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const count = isMobile ? 25 : (isTablet ? 50 : 90);

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
        size: Math.random() * 1.5 + 1.2,
        color: Math.random() > 0.45 ? 'rgba(33, 34, 36, 0.22)' : 'rgba(242, 183, 5, 0.48)',
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005,
        waveActive: false
      });
    }

    // Scroll reveal gravitational wave state
    let waveY = -100;
    let waveActive = false;
    let time = 0;
    
    if (isRevealed) {
      waveActive = true;
      waveY = 0;
    }

    const getCardPos = (idx) => {
      const coord = coords[idx];
      if (!coord) return { x: 0, y: 0 };
      const leftPx = (parseFloat(coord.left) / 100) * canvas.width;
      const topPx = parseFloat(coord.top) + 40; // Center offset
      
      const factor = coord.factor;
      const cardParallaxX = isHovered ? mousePosRef.current.x * 0.05 * factor : 0;
      const cardParallaxY = isHovered ? mousePosRef.current.y * 0.05 * factor : 0;
      
      const isMe = activeHoverIndexRef.current === idx;
      
      return {
        x: leftPx + cardParallaxX + (isMe ? mousePosRef.current.x * 0.15 : 0),
        y: topPx + cardParallaxY + (isMe ? mousePosRef.current.y * 0.15 : 0)
      };
    };

    let animFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.015;

      // Advance gravitational wave
      if (waveActive && waveY < canvas.height + 200) {
        waveY += 12; // Speed of the wave
      }

      // Draw constellation connection lines
      if (isHovered && activeHoverIndexRef.current !== null) {
        const hoveredPos = getCardPos(activeHoverIndexRef.current);
        const col = activeHoverIndexRef.current % 4;
        const row = Math.floor(activeHoverIndexRef.current / 4);
        
        const neighbors = [];
        if (col > 0) neighbors.push(activeHoverIndexRef.current - 1);
        if (col < 3) neighbors.push(activeHoverIndexRef.current + 1);
        if (row === 0) neighbors.push(activeHoverIndexRef.current + 4);
        if (row === 1) neighbors.push(activeHoverIndexRef.current - 4);

        neighbors.forEach(nIdx => {
          const nPos = getCardPos(nIdx);
          ctx.beginPath();
          ctx.moveTo(hoveredPos.x, hoveredPos.y);
          ctx.lineTo(nPos.x, nPos.y);
          ctx.strokeStyle = 'rgba(242, 183, 5, 0.28)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([5, 8]);
          ctx.lineDashOffset = -time * 25; // Animated dash flow
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      particles.forEach((p) => {
        p.angle += p.speed;
        const driftX = Math.sin(p.angle) * 4;
        const driftY = Math.cos(p.angle) * 4;

        // 1. Reveal Gravitational Wave effect
        if (waveActive && Math.abs(p.y - waveY) < 120) {
          p.vy += 4.5; // Accelerate downward
        }

        // 2. Interactive repel when hovering logo cards
        if (isHovered) {
          const dx = p.x - spotlightPos.x;
          const dy = p.y - spotlightPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = isMobile ? 80 : 135;

          if (dist < repelRadius) {
            const force = (repelRadius - dist) / repelRadius;
            p.vx += (dx / dist) * force * 12;
            p.vy += (dy / dist) * force * 12;
          }
        }

        // Return Home physics interpolation
        p.vx += (p.origX + driftX - p.x) * 0.03;
        p.vy += (p.origY + driftY - p.y) * 0.03;

        // Damping
        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle with gradient alpha decay near mouse
        let opacity = 1;
        if (isHovered) {
          const dx = p.x - spotlightPos.x;
          const dy = p.y - spotlightPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 135) {
            opacity = Math.max(0.1, dist / 135); // Fade out near cursor
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; // Fallback
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset
      });

      animFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [isRevealed, isHovered, spotlightPos]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlightPos({ x, y });
    
    // Relative to center for 3D parallax
    const centerX = x - rect.width / 2;
    const centerY = y - rect.height / 2;
    setMousePos({ x: centerX, y: centerY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveHoverIndex(null);
    setMousePos({ x: 0, y: 0 });
  };

  // Mobile Ticker Rows
  const row1Indices = [0, 1, 2, 3];
  const row2Indices = [4, 5, 6, 7];
  const mobileRow1 = [...row1Indices, ...row1Indices];
  const mobileRow2 = [...row2Indices, ...row2Indices];

  const handleMobileSelect = (idx) => {
    setSelectedMobileIndex(selectedMobileIndex === idx ? null : idx);
  };

  // Split title string by words first, then characters for responsive wrapping
  const titleText = t('partners.title') || '';
  const titleWords = titleText.split(' ').map((word) => ({
    wordText: word,
    chars: word.split('')
  }));

  return (
    <section 
      ref={sectionRef}
      id="partners"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '6rem 0',
        position: 'relative',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        overflow: 'hidden'
      }}
    >
      {/* Background Canvas Particles */}
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

      {/* Aurora Ambient Drift Blobs */}
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />

      <div className="container-pad" style={{ marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
        {/* Header container using flex column to prevent line-wrapping overlaps */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', marginBottom: '1.4rem' }}>
          {/* Cardiac Character Reveal Title */}
          <h2 
            ref={titleRef} 
            style={{ 
              fontSize: 'clamp(1.6rem, 5.5vw, 2.2rem)', 
              margin: 0, 
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.3',
              textAlign: 'center'
            }}
          >
            {titleWords.map((wordObj, wordIdx) => (
              <span 
                key={wordIdx} 
                style={{ 
                  display: 'inline-block', 
                  whiteSpace: 'nowrap',
                  verticalAlign: 'bottom',
                  marginRight: '0.25em'
                }}
              >
                {wordObj.chars.map((char, charIdx) => (
                  <span 
                    key={charIdx} 
                    className="char-reveal" 
                    style={{ 
                      display: 'inline-block', 
                      opacity: 0, 
                      transform: 'translateY(30px)'
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          
          {/* Underline flatline with animated cardiac spark */}
          <div style={{ position: 'relative', width: '180px', height: '12px', overflow: 'visible', margin: 0 }}>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <path d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="rgba(33,34,36,0.06)" strokeWidth="1" />
              <path className={`partners-flatline-pulse ${isRevealed ? 'active' : ''}`} d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="full-text">
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {t('partners.descFull')}
            </p>
          </div>
          <div className="short-text">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {t('partners.descShort')}
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP VERSION: 3D Kinetic Grid */}
      <div 
        ref={containerRef}
        className="galaxy-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          height: '320px',
          margin: '2rem auto',
          width: 'calc(100% - 3rem)',
          maxWidth: '1200px',
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          zIndex: 2
        }}
      >
        {/* Spotlight Follow */}
        {isHovered && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              background: `radial-gradient(circle 220px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(242, 183, 5, 0.12) 0%, transparent 100%)`,
              zIndex: 1,
              transition: 'background 0.05s linear'
            }}
          />
        )}

        {clients.map((client, index) => {
          const coord = coords[index] || { left: '0%', top: '0px', factor: 1, fontSize: '1.5rem', fontWeight: 800 };
          const initialPos = initialPositions[index] || { left: '50%', top: '50%', rotate: '0deg' };
          
          return (
            <BrandUniverseItem 
              key={index}
              client={client}
              index={index}
              coord={coord}
              initialPos={initialPos}
              isRevealed={isRevealed}
              globalMouse={mousePos}
              isParentHovered={isHovered}
              activeHoverIndex={activeHoverIndex}
              setActiveHoverIndex={setActiveHoverIndex}
            />
          );
        })}
      </div>

      {/* Dynamic Constellation Tooltip */}
      <div 
        style={{
          height: '42px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1rem',
          transition: 'all 0.3s ease',
          opacity: activeHoverIndex !== null ? 1 : 0,
          transform: activeHoverIndex !== null ? 'translateY(0)' : 'translateY(5px)',
          zIndex: 5,
          position: 'relative'
        }}
        className="constellation-tooltip-container"
      >
        {activeHoverIndex !== null && (
          <div 
            style={{
              backgroundColor: 'rgba(253, 252, 247, 0.95)',
              border: '1.5px solid var(--accent)',
              borderRadius: '20px',
              padding: '0.4rem 1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span style={{ color: 'var(--accent)' }}>{clients[activeHoverIndex].name}</span>
            <span> — </span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{clients[activeHoverIndex].desc}</span>
          </div>
        )}
      </div>

      {/* MOBILE VERSION: 2 Vertical Ticker Columns */}
      <div 
        className="ticker-wall-mobile-vertical" 
        style={{ 
          display: 'none', 
          zIndex: 2,
          justifyContent: 'center',
          gap: '1.2rem',
          height: '340px',
          overflow: 'hidden',
          position: 'relative',
          margin: '2rem auto',
          width: '100%'
        }}
      >
        {/* Left Column (Scrolls UP) */}
        <div 
          className={`ticker-col-vertical scroll-up ${selectedMobileIndex !== null ? 'paused' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'scroll-vertical-up 14s linear infinite',
            animationPlayState: selectedMobileIndex !== null ? 'paused' : 'running'
          }}
        >
          {mobileRow1.map((idx, index) => {
            const client = clients[idx];
            const isSelected = selectedMobileIndex === idx;
            return (
              <div 
                key={`col1-${index}`} 
                onClick={() => handleMobileSelect(idx)}
                style={{
                  padding: '1rem 1.2rem',
                  backgroundColor: 'rgba(253, 252, 247, 0.92)',
                  backdropFilter: 'blur(8px)',
                  border: isSelected ? '2px solid var(--accent)' : '1px solid rgba(33, 34, 36, 0.08)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  minWidth: '135px',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isSelected ? '0 10px 25px rgba(242, 183, 5, 0.2)' : 'var(--shadow-sm)',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{client.name}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--accent)', marginTop: '4px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                  {client.type}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (Scrolls DOWN) */}
        <div 
          className={`ticker-col-vertical scroll-down ${selectedMobileIndex !== null ? 'paused' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'scroll-vertical-down 14s linear infinite',
            animationPlayState: selectedMobileIndex !== null ? 'paused' : 'running'
          }}
        >
          {mobileRow2.map((idx, index) => {
            const client = clients[idx];
            const isSelected = selectedMobileIndex === idx;
            return (
              <div 
                key={`col2-${index}`} 
                onClick={() => handleMobileSelect(idx)}
                style={{
                  padding: '1rem 1.2rem',
                  backgroundColor: 'rgba(253, 252, 247, 0.92)',
                  backdropFilter: 'blur(8px)',
                  border: isSelected ? '2px solid var(--accent)' : '1px solid rgba(33, 34, 36, 0.08)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  minWidth: '135px',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isSelected ? '0 10px 25px rgba(242, 183, 5, 0.2)' : 'var(--shadow-sm)',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{client.name}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--accent)', marginTop: '4px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                  {client.type}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Mobile Brand Tagline Drawer */}
      {selectedMobileIndex !== null && (
        <div 
          className="container-pad"
          style={{ 
            marginTop: '1.5rem', 
            textAlign: 'center', 
            position: 'relative', 
            zIndex: 2, 
            animation: 'fadeIn 0.4s ease'
          }}
        >
          <div 
            style={{ 
              backgroundColor: 'rgba(253, 252, 247, 0.95)', 
              border: '1px solid var(--accent)', 
              borderRadius: '12px', 
              padding: '1.2rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              {clients[selectedMobileIndex].name}
            </h4>
            <p style={{ margin: '4px 0 8px 0', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 800, letterSpacing: '0.1em' }}>
              {clients[selectedMobileIndex].type}
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {clients[selectedMobileIndex].desc}
            </p>
          </div>
        </div>
      )}

      {/* Visual Showroom Button Link */}
      {onNavigate && (
        <div style={{ textAlign: 'center', marginTop: '3.5rem', position: 'relative', zIndex: 5 }}>
          <button
            onClick={(e) => onNavigate('#partners-lab', { x: e.clientX, y: e.clientY })}
            className="btn-secondary"
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '30px',
              border: '1.5px solid var(--accent)',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(242, 183, 5, 0.05)',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(242, 183, 5, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(242, 183, 5, 0.05)';
            }}
          >
            {t('partners.viewLaboratory') || 'ՏԵՍՆԵԼ ԱՄԲՈՂՋԱԿԱՆ ՑՈՒՑԱԿԸ'}
          </button>
        </div>
      )}
    </section>
  );
}

function BrandUniverseItem({ client, index, coord, initialPos, isRevealed, globalMouse, isParentHovered, activeHoverIndex, setActiveHoverIndex }) {
  const brandRef = useRef(null);
  const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 });
  const [isSelfHovered, setIsSelfHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!brandRef.current) return;
    const rect = brandRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setLocalMouse({ x, y });
  };

  const handleMouseEnter = () => {
    setIsSelfHovered(true);
    setActiveHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setIsSelfHovered(false);
    setActiveHoverIndex(null);
    setLocalMouse({ x: 0, y: 0 });
  };

  // Blur and opacity states based on global hover focus
  const isAnyItemHovered = activeHoverIndex !== null;
  const isMeHovered = activeHoverIndex === index;

  let blurVal = '0px';
  let opacityVal = 1;
  if (isAnyItemHovered) {
    if (isMeHovered) {
      blurVal = '0px';
      opacityVal = 1;
    } else {
      blurVal = '0px';
      opacityVal = 0.35;
    }
  }

  // Parallax offset
  const parallaxX = isParentHovered ? globalMouse.x * 0.05 * coord.factor : 0;
  const parallaxY = isParentHovered ? globalMouse.y * 0.05 * coord.factor : 0;

  // Magnetic hover offset
  const magnetX = isMeHovered ? localMouse.x * 0.45 : 0;
  const magnetY = isMeHovered ? localMouse.y * 0.45 : 0;

  // Kinetic Grid Repulsion Wave physics
  let repelX = 0;
  let repelY = 0;
  if (isAnyItemHovered && !isMeHovered) {
    const hRow = Math.floor(activeHoverIndex / 4);
    const hCol = activeHoverIndex % 4;
    const row = Math.floor(index / 4);
    const col = index % 4;

    const colDiff = col - hCol;
    const rowDiff = row - hRow;

    // Push away based on relative column/row directions
    repelX = Math.sign(colDiff) * 20;
    repelY = Math.sign(rowDiff) * 15;
  }

  const tx = parallaxX + magnetX + repelX;
  const ty = parallaxY + magnetY + repelY;
  const tz = isMeHovered ? 60 : (isParentHovered ? -15 * coord.factor : 0);
  const rx = isMeHovered ? -localMouse.y * 0.2 : 0;
  const ry = isMeHovered ? localMouse.x * 0.2 : 0;

  // Delay is calculated proportionally to horizontal left percentage to form a clean wave
  const floatDelay = parseFloat(coord.left) * 0.05;

  // Determine positions and rotations dynamically for the shoot-in effect
  const currentLeft = isRevealed ? coord.left : initialPos.left;
  const currentTop = isRevealed ? coord.top : initialPos.top;
  const currentRotate = isRevealed ? '0deg' : initialPos.rotate;

  return (
    <div
      className={`galaxy-card-wrapper ${isRevealed ? 'revealed' : ''}`}
      style={{
        position: 'absolute',
        left: currentLeft,
        top: currentTop,
        transform: `rotate(${currentRotate})`,
        animation: isRevealed && !isAnyItemHovered ? 'float-galaxy 9s ease-in-out infinite' : 'none',
        animationDelay: `-${floatDelay}s`,
        zIndex: isMeHovered ? 10 : 2,
        // Smooth slide-in coordinates interpolation on reveal
        transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.4s ease, left 1.4s cubic-bezier(0.16, 1, 0.3, 1), top 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: isRevealed ? `${index * 0.08}s` : '0s'
      }}
    >
      <div
        ref={brandRef}
        className="galaxy-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: coord.fontWeight,
          fontSize: coord.fontSize,
          color: isMeHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
          letterSpacing: '0.05em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 2rem',
          userSelect: 'none',
          cursor: 'pointer',
          transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${isMeHovered ? 1.08 : 1})`,
          filter: `blur(${blurVal})`,
          opacity: opacityVal,
          textShadow: isMeHovered 
            ? '0 0 25px rgba(242, 183, 5, 0.45)' 
            : 'none',
          transition: isMeHovered
            ? 'color 0.2s ease, filter 0.3s ease, opacity 0.3s ease'
            : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s ease, opacity 0.5s ease, color 0.5s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span>{client.name}</span>
          {(client.name === 'KOOM' || client.name === 'Storia' || isMeHovered) && (
            <span style={{ 
              width: '6px', 
              height: '6px', 
              backgroundColor: 'var(--accent)', 
              borderRadius: '50%',
              boxShadow: isMeHovered ? '0 0 10px var(--accent)' : 'none',
              transition: 'box-shadow 0.3s ease'
            }} />
          )}
        </div>
        <div 
          style={{ 
            fontSize: '0.65rem', 
            textTransform: 'uppercase', 
            color: isMeHovered ? 'var(--accent)' : 'var(--text-secondary)', 
            fontWeight: 800, 
            marginTop: '6px', 
            letterSpacing: '0.15em',
            opacity: isMeHovered ? 1 : 0.65,
            transition: 'color 0.3s ease, opacity 0.3s ease'
          }}
        >
          {client.type}
        </div>
      </div>
    </div>
  );
}
