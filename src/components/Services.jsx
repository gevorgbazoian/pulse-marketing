import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { 
  Target, Award, Camera, Palette, Globe, 
  RotateCw, Layers, Printer, Share2, Star 
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const InstagramIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Services() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const coreRef = useRef(null);
  const titleRef = useRef(null);
  const wrapperRef = useRef(null);
  
  const catRefs = useRef([]);
  const cardRefs = useRef([]);

  // States
  const [isRevealed, setIsRevealed] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [coords, setCoords] = useState({ catLines: [], subLines: [] });
  const [showCoreSpark, setShowCoreSpark] = useState(false);
  const [isCoreActive, setIsCoreActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Resize window width listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = windowWidth < 1024;

  // Icons map matching translations list positions
  const icons = [
    <InstagramIcon size={24} />, // 0: SMM
    <Target size={24} />,        // 1: Targeting
    <Award size={24} />,         // 2: Branding
    <Camera size={24} />,        // 3: Photo/Video
    <Palette size={24} />,       // 4: Graphic Design
    <Globe size={24} />,         // 5: Web Design
    <RotateCw size={24} />,      // 6: 3D Animation
    <Layers size={24} />,        // 7: Visual Content
    <Printer size={24} />,       // 8: Printed Materials
    <Share2 size={24} />,        // 9: Marketing Strategy
    <Star size={24} />           // 10: TripAdvisor
  ];

  const serviceListTranslated = t('services.list') || [];
  
  // 9 cards ordered index map:
  // Branch 1: SMM (0), Targeting (1), Photo/Video (3)
  // Branch 2: Branding (2), Graphic Design (4), Printed Materials (8)
  // Branch 3: Web Design (5), 3D Animation (6), Visual Content (7)
  const orderIndices = [0, 1, 3, 2, 4, 8, 5, 6, 7];
  const services = orderIndices.map((idx) => {
    const item = serviceListTranslated[idx] || {};
    return {
      ...item,
      icon: icons[idx] || icons[0],
      originalIndex: idx
    };
  });

  // Scroll Reveal Observer with repeatable resets
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        } else {
          // Reset states when scrolled away to allow clean re-play
          setIsRevealed(false);
          setIsCoreActive(false);
          setShowCoreSpark(false);
        }
      });
    }, { threshold: 0.08 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Update SVG line coordinates dynamically
  const updateCoordinates = () => {
    if (isMobileView) return; // skip SVG math on mobile/tablet view

    const wrapper = wrapperRef.current;
    const core = coreRef.current;
    if (!wrapper || !core) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const coreRect = core.getBoundingClientRect();

    const startX = coreRect.left - wrapperRect.left + coreRect.width / 2 + 10;
    const startY = coreRect.top - wrapperRect.top + coreRect.height / 2;

    // 1. Calculate Core -> 3 Category Headers (with 12px gap before capsule)
    const newCatLines = catRefs.current.map((cat) => {
      if (!cat) return null;
      const rect = cat.getBoundingClientRect();
      const endX = rect.left - wrapperRect.left - 12; // 12px spacing gap!
      const endY = rect.top - wrapperRect.top + rect.height / 2;
      return { startX, startY, endX, endY };
    }).filter(Boolean);

    // 2. Calculate 3 Category Headers -> 9 Sub-service cards (with 12px gaps)
    const newSubLines = [];
    const catMap = {
      0: [0, 1, 2], // Category 1 connects to sub-cards index 0,1,2
      1: [3, 4, 5], // Category 2 connects to sub-cards index 3,4,5
      2: [6, 7, 8]  // Category 3 connects to sub-cards index 6,7,8
    };

    for (let catIdx = 0; catIdx < 3; catIdx++) {
      const cat = catRefs.current[catIdx];
      if (!cat) continue;
      const catRect = cat.getBoundingClientRect();

      // Start path from right edge of category node + 12px spacing gap
      const cStartX = catRect.left - wrapperRect.left + catRect.width + 12;
      const cStartY = catRect.top - wrapperRect.top + catRect.height / 2;

      const cardIndices = catMap[catIdx] || [];
      cardIndices.forEach((cardIdx) => {
        const card = cardRefs.current[cardIdx];
        if (!card) return;
        const cardRect = card.getBoundingClientRect();

        // Connect to left edge of card - 12px spacing gap
        const cEndX = cardRect.left - wrapperRect.left - 12;
        const cEndY = cardRect.top - wrapperRect.top + cardRect.height / 2;

        newSubLines.push({
          startX: cStartX,
          startY: cStartY,
          endX: cEndX,
          endY: cEndY,
          catIdx,
          cardIdx
        });
      });
    }

    setCoords({ catLines: newCatLines, subLines: newSubLines });
  };

  useEffect(() => {
    if (isRevealed && !isMobileView) {
      updateCoordinates();
      window.addEventListener('resize', updateCoordinates);
      
      const timer1 = setTimeout(updateCoordinates, 300);
      const timer2 = setTimeout(updateCoordinates, 800);
      
      return () => {
        window.removeEventListener('resize', updateCoordinates);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isRevealed, language, isMobileView]);

  // Synchronized Neural Pulse Ignition Timeline (Snappier speeds!)
  useEffect(() => {
    if (sectionRef.current) {
      const catHeaders = sectionRef.current.querySelectorAll('.category-header-node');
      const cards = sectionRef.current.querySelectorAll('.service-card-snap');
      const chars = titleRef.current ? titleRef.current.querySelectorAll('.char-reveal') : [];
      const catBranches = sectionRef.current.querySelectorAll('.neural-branch-cat');
      const subBranches = sectionRef.current.querySelectorAll('.neural-branch-sub');

      if (isRevealed) {
        // Step 1: Title Stagger Reveal (Faster duration and stagger)
        if (chars.length > 0) {
          gsap.fromTo(chars,
            { y: 30, rotate: '2.5deg', opacity: 0 },
            { y: 0, rotate: '0deg', opacity: 1, duration: 0.55, stagger: 0.015, ease: 'back.out(1.5)' }
          );
        }

        const tl = gsap.timeline();
        tl.delay(0.45); // Snappier delay

        // Step 2: Drop title spark down to Core Node (Only on Desktop)
        if (!isMobileView) {
          tl.call(() => {
            setShowCoreSpark(true);
          });
        }

        // Step 3: Core Node Ignites with scale pulse (Faster ignition)
        tl.to(coreRef.current, {
          scale: 1.35,
          duration: 0.28,
          ease: 'power2.out',
          onStart: () => setIsCoreActive(true)
        });
        tl.to(coreRef.current, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.in'
        });

        // Step 4: Draw Tier 1 paths (Only on Desktop - Faster growth)
        if (!isMobileView && catBranches.length > 0) {
          tl.fromTo(catBranches,
            { strokeDashoffset: 2000, opacity: 0 },
            { strokeDashoffset: 0, opacity: 1, duration: 0.52, stagger: 0.08, ease: 'power2.out' },
            '-=0.12'
          );
        }

        // Step 5: Stagger reveal 3 Category Headers (Faster stagger)
        if (catHeaders.length > 0) {
          tl.fromTo(catHeaders,
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.38, stagger: 0.05, ease: 'back.out(1.8)' },
            isMobileView ? '-=0.15' : '-=0.25'
          );
        }

        // Step 6: Draw Tier 2 paths (Only on Desktop - Faster growth)
        if (!isMobileView && subBranches.length > 0) {
          tl.fromTo(subBranches,
            { strokeDashoffset: 2000, opacity: 0 },
            { strokeDashoffset: 0, opacity: 1, duration: 0.62, stagger: 0.03, ease: 'power2.out' },
            '-=0.15'
          );
        }

        // Step 7: Bloom 9 Service Cards (Faster scale-up reveal)
        if (cards.length > 0) {
          tl.fromTo(cards,
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, stagger: 0.025, ease: 'back.out(1.6)' },
            isMobileView ? '-=0.25' : '-=0.35'
          );
        }
      } else {
        // Reset timeline elements when scrolled away
        if (chars.length > 0) {
          gsap.killTweensOf(chars);
          gsap.set(chars, { y: 30, opacity: 0 });
        }
        if (catBranches.length > 0) {
          gsap.killTweensOf(catBranches);
          gsap.set(catBranches, { strokeDashoffset: 2000, opacity: 0 });
        }
        if (subBranches.length > 0) {
          gsap.killTweensOf(subBranches);
          gsap.set(subBranches, { strokeDashoffset: 2000, opacity: 0 });
        }
        gsap.killTweensOf([coreRef.current, ...catHeaders, ...cards]);
        gsap.set(catHeaders, { scale: 0.7, opacity: 0 });
        gsap.set(cards, { scale: 0.7, opacity: 0 });
        gsap.set(coreRef.current, { scale: 1 });
        setIsCoreActive(false);
        setShowCoreSpark(false);
      }
    }
  }, [isRevealed, language, isMobileView]);

  const titleText = t('services.title') || '';
  const titleWords = titleText.split(' ').map((word) => ({
    wordText: word,
    chars: word.split('')
  }));

  // Helper to generate path coordinates dynamically (Desktop only)
  const getPathD = (line) => {
    if (!line) return '';
    const { startX, startY, endX, endY } = line;
    const cp1x = startX + (endX - startX) * 0.45;
    const cp2x = startX + (endX - startX) * 0.55;
    return "M " + startX + "," + startY + " C " + cp1x + "," + startY + " " + cp2x + "," + endY + " " + endX + "," + endY;
  };

  return (
    <section 
      ref={sectionRef}
      id="services"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 0'
      }}
    >
      <div className="container-pad" style={{ position: 'relative', zIndex: 5 }}>
        
        {/* Header container using flex column to prevent line-wrapping overlaps */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', marginBottom: '1.4rem', position: 'relative', zIndex: 10 }}>
          {/* Cardiac Character Reveal */}
          <h2 
            ref={titleRef}
            style={{ 
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
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

          {/* Flatline Underline */}
          <div style={{ position: 'relative', width: '220px', height: '12px', overflow: 'visible', margin: 0 }}>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <path d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="rgba(33,34,36,0.06)" strokeWidth="1" />
              <path className={"partners-flatline-pulse " + (isRevealed ? "active" : "")} d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div className="full-text">
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                {t('services.descFull')}
              </p>
            </div>
            <div className="short-text">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {t('services.descShort')}
              </p>
            </div>
          </div>
        </div>

        {/* Mind Map Tree Structure Wrapper (Cosmic Floating Container) */}
        <div ref={wrapperRef} className="services-floating-wrapper" style={{ position: 'relative', overflow: 'visible' }}>
          
          {/* Dynamic SVG Mind Map Overlay (Desktop only) */}
          {!isMobileView && (
            <svg 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                overflow: 'visible'
              }}
            >
              {/* Vertical Spark Drop Line connecting flatline to the core */}
              {showCoreSpark && coords.catLines.length > 0 && (
                <line 
                  className="core-spark-drop-line"
                  x1={coords.catLines[0].startX}
                  y1={-120}
                  x2={coords.catLines[0].startX}
                  y2={coords.catLines[0].startY - 40}
                  stroke="var(--accent)"
                  strokeWidth="2.2"
                  strokeDasharray="10 8"
                  filter="drop-shadow(0 0 5px var(--accent))"
                />
              )}

              {/* Core Downward Drifting Ambient Sparks */}
              {isCoreActive && coords.catLines.length > 0 && (
                <>
                  <circle 
                    className="core-spark-drift-down"
                    cx={coords.catLines[0].startX}
                    cy={coords.catLines[0].startY}
                    r="2.5"
                    style={{ '--dx': '-16px', '--dy': '110px', 'animationDelay': '0s' }}
                  />
                  <circle 
                    className="core-spark-drift-down"
                    cx={coords.catLines[0].startX}
                    cy={coords.catLines[0].startY}
                    r="3.2"
                    style={{ '--dx': '12px', '--dy': '85px', 'animationDelay': '1.5s' }}
                  />
                  <circle 
                    className="core-spark-drift-down"
                    cx={coords.catLines[0].startX}
                    cy={coords.catLines[0].startY}
                    r="2"
                    style={{ '--dx': '-6px', '--dy': '140px', 'animationDelay': '3.0s' }}
                  />
                </>
              )}

              {/* Tier 1 paths (Core -> Categories) */}
              {coords.catLines.map((line, idx) => {
                const pathD = getPathD(line);
                return (
                  <g key={"cat-" + idx} className="services-ambient-constellation" style={{ animationDelay: (idx * 0.3) + "s" }}>
                    {/* Static background path */}
                    <path 
                      className="neural-branch neural-branch-cat"
                      d={pathD}
                      fill="none"
                      stroke="rgba(242, 183, 5, 0.16)"
                      strokeWidth="1.6"
                    />
                    {/* Glowing fiber optic flow path */}
                    <path 
                      className="neural-branch neural-branch-cat fiber-optic-flow"
                      d={pathD}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="1.8"
                      style={{ animationDelay: (idx * 0.45) + "s" }}
                    />
                  </g>
                );
              })}

              {/* Tier 2 paths (Categories -> Sub-services) */}
              {coords.subLines.map((line, idx) => {
                const pathD = getPathD(line);
                const isActive = hoveredIndex === line.cardIdx;
                
                // Decorative node coordinates
                const midX = (line.startX + line.endX) * 0.45;
                const midY = line.startY + (line.endY - line.startY) * 0.45;

                return (
                  <g key={"sub-" + idx} className="services-ambient-constellation" style={{ animationDelay: (idx * 0.25) + "s" }}>
                    {/* Static background path */}
                    <path 
                      className={"neural-branch neural-branch-sub " + (isActive ? "active-neon-line" : "")}
                      d={pathD}
                      fill="none"
                      stroke="rgba(242, 183, 5, 0.12)"
                      strokeWidth="1.3"
                    />
                    {/* Glowing fiber optic flow path */}
                    <path 
                      className={"neural-branch neural-branch-sub fiber-optic-flow " + (isActive ? "active-neon-line" : "")}
                      d={pathD}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="1.5"
                      style={{ animationDelay: (idx * 0.35) + "s" }}
                    />

                    {/* Sparkling node points */}
                    <circle 
                      className="glowing-node-pulse" 
                      cx={midX} 
                      cy={midY} 
                      r="3.2" 
                      fill="var(--accent)" 
                      style={{ animationDelay: (idx * 0.35) + "s" }}
                    />

                    {/* Lightning-fast Laser packet flying back to core on hover */}
                    {isActive && pathD && (
                      <circle
                        className="laser-packet"
                        r="4.5"
                        fill="#ffffff"
                        style={{
                          offsetPath: "path('" + pathD + "')",
                          animation: "laser-packet-flow-anim 0.58s cubic-bezier(0.15, 0.85, 0.15, 1) infinite"
                        }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          )}

          {/* Double-Tiered Layout Container */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: isMobileView ? 'column' : 'row', 
              alignItems: isMobileView ? 'center' : 'stretch', 
              gap: '2.5rem',
              position: 'relative', 
              zIndex: 3 
            }}
          >
            {/* Column 1: PULSE Core Node (Breath animation & double ripples) */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                width: isMobileView ? '100%' : '140px',
                marginBottom: isMobileView ? '2.5rem' : '0',
                position: 'relative'
              }}
            >
              {/* Expanding Ripple Rings (Always active when Core is revealed) */}
              {isCoreActive && (
                <>
                  <div className="core-node-ripple core-node-ripple-1" />
                  <div className="core-node-ripple core-node-ripple-2" />
                </>
              )}

              <div 
                ref={coreRef}
                className="core-node-outer"
                style={{
                  width: '90px',
                  height: '90px',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.4s ease',
                  backgroundColor: 'rgba(242, 183, 5, 0.04)',
                  zIndex: 5
                }}
              >
                <div 
                  className="core-node-inner"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em',
                    fontFamily: 'var(--font-heading)',
                    textShadow: '0 0 10px rgba(255,255,255,0.8)'
                  }}
                >
                  PULSE
                </div>
              </div>
            </div>

            {/* Columns 2 & 3 Combined: Categories and Sub-service columns */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3.5rem', width: '100%' }}>
              
              {/* Category 1 Group: DIGITAL MARKETING & CONTENT */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: isMobileView ? 'column' : 'row', 
                  alignItems: isMobileView ? 'center' : 'center', 
                  gap: isMobileView ? '1.2rem' : '3.2rem' 
                }}
              >
                <div 
                  ref={el => catRefs.current[0] = el} 
                  className="category-header-node"
                  style={{ 
                    width: isMobileView ? '100%' : '240px',
                    height: isMobileView ? 'auto' : '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isMobileView && (
                    <span 
                      className="glowing-node-pulse" 
                      style={{ 
                        display: 'inline-block', 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--accent)', 
                        marginRight: '12px',
                        boxShadow: '0 0 8px var(--accent)'
                      }} 
                    />
                  )}
                  DIGITAL MARKETING & CONTENT
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, width: '100%' }}>
                  <ServiceCard 
                    ref={el => cardRefs.current[0] = el}
                    service={services[0]}
                    index={0}
                    setHoveredIndex={setHoveredIndex}
                    isMobileView={isMobileView}
                  />
                  <ServiceCard 
                    ref={el => cardRefs.current[1] = el}
                    service={services[1]}
                    index={1}
                    setHoveredIndex={setHoveredIndex}
                    isMobileView={isMobileView}
                  />
                  <ServiceCard 
                    ref={el => cardRefs.current[2] = el}
                    service={services[2]}
                    index={2}
                    setHoveredIndex={setHoveredIndex}
                    isMobileView={isMobileView}
                  />
                </div>
              </div>

              {/* Category 2 Group: BRANDING & DESIGN */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: isMobileView ? 'column' : 'row', 
                  alignItems: isMobileView ? 'center' : 'center', 
                  gap: isMobileView ? '1.2rem' : '3.2rem' 
                }}
              >
                <div 
                  ref={el => catRefs.current[1] = el} 
                  className="category-header-node"
                  style={{ 
                    width: isMobileView ? '100%' : '240px',
                    height: isMobileView ? 'auto' : '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isMobileView && (
                    <span 
                      className="glowing-node-pulse" 
                      style={{ 
                        display: 'inline-block', 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--accent)', 
                        marginRight: '12px',
                        boxShadow: '0 0 8px var(--accent)'
                      }} 
                    />
                  )}
                  BRANDING & DESIGN
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, width: '100%' }}>
                  <ServiceCard 
                    ref={el => cardRefs.current[3] = el}
                    service={services[3]}
                    index={3}
                    setHoveredIndex={setHoveredIndex}
                    isMobileView={isMobileView}
                  />
                  <ServiceCard 
                    ref={el => cardRefs.current[4] = el}
                    service={services[4]}
                    index={4}
                    setHoveredIndex={setHoveredIndex}
                    isMobileView={isMobileView}
                  />
                  <ServiceCard 
                    ref={el => cardRefs.current[5] = el}
                    service={services[5]}
                    index={5}
                    setHoveredIndex={setHoveredIndex}
                    isMobileView={isMobileView}
                  />
                </div>
              </div>

              {/* Category 3 Group: WEB & PRODUCTION */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: isMobileView ? 'column' : 'row', 
                  alignItems: isMobileView ? 'center' : 'center', 
                  gap: isMobileView ? '1.2rem' : '3.2rem' 
                }}
              >
                <div 
                  ref={el => catRefs.current[2] = el} 
                  className="category-header-node"
                  style={{ 
                    width: isMobileView ? '100%' : '240px',
                    height: isMobileView ? 'auto' : '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isMobileView && (
                    <span 
                      className="glowing-node-pulse" 
                      style={{ 
                        display: 'inline-block', 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--accent)', 
                        marginRight: '12px',
                        boxShadow: '0 0 8px var(--accent)'
                      }} 
                    />
                  )}
                  WEB & PRODUCTION
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, width: '100%' }}>
                  <ServiceCard 
                    ref={el => cardRefs.current[6] = el}
                    service={services[6]}
                    index={6}
                    setHoveredIndex={setHoveredIndex}
                    isMobileView={isMobileView}
                  />
                  <ServiceCard 
                    ref={el => cardRefs.current[7] = el}
                    service={services[7]}
                    index={7}
                    setHoveredIndex={setHoveredIndex}
                    isMobileView={isMobileView}
                  />
                  <ServiceCard 
                    ref={el => cardRefs.current[8] = el}
                    service={services[8]}
                    index={8}
                    setHoveredIndex={setHoveredIndex}
                    isMobileView={isMobileView}
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

const ServiceCard = React.forwardRef(({ service, index, setHoveredIndex, isMobileView }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const [timeOffset] = useState(Math.random() * Math.PI * 2);

  // Gemstone ambient micro-floating tilts
  useEffect(() => {
    if (isHovered) return;

    let animFrame;
    const loop = (t) => {
      const time = t * 0.0012 + timeOffset;
      const rx = Math.sin(time) * 1.5;
      const ry = Math.cos(time * 0.85) * 1.5;
      const tz = Math.sin(time * 1.1) * 2;

      setTiltStyle({
        transform: "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translate3d(0, 0, " + tz + "px)"
      });
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [isHovered]);

  const handleMouseMove = (e) => {
    if (isMobileView) return; // skip mouse tilt calculations on mobile device
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const is3D = service.originalIndex === 6;
    const mult = is3D ? 1.7 : 1.0;

    const rotateX = -y * 0.055 * mult;
    const rotateY = x * 0.055 * mult;
    const mx = x * 0.12 * mult;
    const my = y * 0.12 * mult;

    setTiltStyle({
      transform: "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(" + (is3D ? 1.06 : 1.03) + ") translate3d(" + mx + "px, " + my + "px, 20px) translateY(-8px)",
      borderColor: 'var(--accent)',
      boxShadow: is3D 
        ? '0 25px 45px rgba(242, 183, 5, 0.22)' 
        : '0 15px 35px rgba(242, 183, 5, 0.15)'
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoveredIndex(null);
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1) translate3d(0, 0, 0) translateY(0px)'
    });
  };

  const isSMM = service.originalIndex === 0;
  const isTargeting = service.originalIndex === 1;
  const isBranding = service.originalIndex === 2;

  return (
    <div
      ref={ref}
      className="service-card-snap"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '1.2rem 1.6rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        cursor: 'default',
        opacity: 0,
        position: 'relative',
        overflow: 'hidden',
        ...tiltStyle
      }}
    >
      {/* Glare Sheen sweep */}
      <span className="service-card-sheen" />

      {/* SMM Backdrop Pulse */}
      {isHovered && isSMM && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'pulse-bg-glow 1.2s infinite ease-in-out'
          }}
        />
      )}

      {/* Targeting Backdrop Radar */}
      {isHovered && isTargeting && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(242,183,5,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1,
            transform: 'translate(-50%, -50%)',
            animation: 'radar-sweep-anim 2.5s linear infinite'
          }}
        />
      )}

      {/* Branding Backdrop Liquid */}
      {isBranding && (
        <span 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: isHovered ? '100%' : '0%',
            backgroundColor: 'rgba(242, 183, 5, 0.06)',
            transition: 'height 0.5s cubic-bezier(0.25, 1, 0.3, 1)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}

      {/* Floating Icon Wrapper (Pop & Spin 360deg rotation on hover) */}
      <div 
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-secondary)',
          color: isHovered ? 'var(--accent)' : 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), color 0.3s, box-shadow 0.3s',
          transform: isHovered ? 'translateZ(25px) scale(1.22) rotate(360deg)' : 'translateZ(0) scale(1) rotate(0)',
          boxShadow: isHovered ? '0 8px 18px rgba(242, 183, 5, 0.18)' : 'none',
          willChange: 'transform',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2
        }}
      >
        {service.icon}
      </div>

      {/* Title & Short Description */}
      <div style={{ transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)', transition: 'transform 0.4s', position: 'relative', zIndex: 2 }}>
        <h3 style={{ 
          fontSize: '1.05rem', 
          color: 'var(--text-primary)', 
          fontWeight: 800,
          margin: '0 0 0.15rem 0',
          display: 'flex',
          alignItems: 'center'
        }}>
          {isMobileView && (
            <span 
              className="glowing-node-pulse" 
              style={{ 
                display: 'inline-block', 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--accent)', 
                marginRight: '8px',
                boxShadow: '0 0 6px var(--accent)'
              }} 
            />
          )}
          {service.title}
        </h3>
        
        <div className="full-text">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.4', margin: 0 }}>
            {service.desc}
          </p>
        </div>
        <div className="short-text">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.35', margin: 0 }}>
            {service.shortDesc}
          </p>
        </div>
      </div>
    </div>
  );
});
