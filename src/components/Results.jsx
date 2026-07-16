import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Results() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Refs for high-performance canvas loops
  const cursorPosRef = useRef({ x: -1000, y: -1000 });
  const activeShockwavesRef = useRef([]);

  // States
  const [isRevealed, setIsRevealed] = useState(false);
  const [pulseBeat, setPulseBeat] = useState(0);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [activeShockwaves, setActiveShockwaves] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [counterCompleted, setCounterCompleted] = useState(false);
  
  // Magnetic Behance Button State
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  // Scroll Reveal Observer (re-triggers every time section enters/leaves viewport)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        } else {
          // Reset states when scrolled out of view to allow clean re-triggers!
          setIsRevealed(false);
          setPulseBeat(0);
          setCounterValues([0, 0, 0, 0]);
          setCounterCompleted(false);
        }
      });
    }, { threshold: 0.12 });
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // GSAP Entrance reveals for cards & title characters
  useEffect(() => {
    if (sectionRef.current) {
      const statsCards = sectionRef.current.querySelectorAll('.stat-card-snap');
      const caseCards = sectionRef.current.querySelectorAll('.case-card-snap');
      const chars = titleRef.current ? titleRef.current.querySelectorAll('.char-reveal') : [];

      if (isRevealed) {
        // Staggered title character reveal
        if (chars.length > 0) {
          gsap.fromTo(chars,
            { y: 30, rotate: '3.5deg', opacity: 0 },
            { y: 0, rotate: '0deg', opacity: 1, duration: 0.75, stagger: 0.02, ease: 'back.out(1.8)' }
          );
        }

        // Centrifugal shoot-in stats cards
        gsap.fromTo(statsCards,
          { scale: 0.1, opacity: 0, y: 120 },
          { scale: 1, opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'back.out(2.2)', delay: 0.25 }
        );

        // Centrifugal shoot-in case cards
        gsap.fromTo(caseCards,
          { scale: 0.1, opacity: 0, y: 180 },
          { scale: 1, opacity: 1, y: 0, duration: 1.3, stagger: 0.1, ease: 'back.out(2.4)', delay: 0.45 }
        );
      } else {
        // Immediately reset styles when out of view so there are no visual glitches next time
        if (chars.length > 0) {
          gsap.killTweensOf(chars);
          gsap.set(chars, { y: 30, opacity: 0 });
        }
        gsap.killTweensOf([statsCards, caseCards]);
        gsap.set([statsCards, caseCards], { scale: 0.1, opacity: 0 });
      }
    }
  }, [isRevealed, language]);

  // Rhythmic Heartbeat pulse counter logic
  useEffect(() => {
    if (isRevealed && pulseBeat === 0) {
      let step = 0;
      const maxSteps = 5;
      const interval = setInterval(() => {
        step += 1;
        setPulseBeat(step);
        
        // Rhythmic jump ratios with overshoot at step 4 (1.12) and settle at step 5 (1.0)
        const ratios = [0, 0.22, 0.55, 0.88, 1.12, 1.0];
        const ratio = ratios[step] || 1.0;
        
        setCounterValues([
          (5.5 * ratio).toFixed(1),
          Math.floor(1200 * ratio),
          Math.floor(100 * ratio),
          Math.floor(1000000 * ratio)
        ]);

        if (step >= maxSteps) {
          clearInterval(interval);
          setCounterCompleted(true);
        }
      }, 380); // ~160 bpm heartbeat rhythm!
      
      return () => clearInterval(interval);
    }
  }, [isRevealed]);

  // Canvas background with distorted grid lines and repelled particles
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

    const particles = [];
    const count = window.innerWidth < 768 ? 20 : 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.5 + 1.2,
        color: Math.random() > 0.45 ? 'rgba(33, 34, 36, 0.18)' : 'rgba(242, 183, 5, 0.4)',
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005
      });
    }

    let time = 0;
    let animFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.015;

      const cursor = cursorPosRef.current;
      const shockwaves = activeShockwavesRef.current;

      // Update shockwaves in high-performance loop
      shockwaves.forEach(sw => {
        sw.radius += 18;
        sw.opacity = Math.max(0, 1 - sw.radius / 1500);
      });

      // Filter out completed shockwaves
      const liveShockwaves = shockwaves.filter(sw => sw.radius < 1500);
      if (liveShockwaves.length !== shockwaves.length) {
        activeShockwavesRef.current = liveShockwaves;
      }

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1;

      // Draw horizontal distorted lines ("Live Water" Visualizer)
      const gridStep = 55;
      const sampleStep = 25;

      for (let y = 0; y < canvas.height; y += gridStep) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width + sampleStep; x += sampleStep) {
          const dx = x - cursor.x;
          const dy = y - cursor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let ox = 0;
          let oy = 0;

          // Mouse proximity grid wave ripple
          if (dist < 180) {
            const force = (180 - dist) / 180;
            const wave = Math.sin(dist * 0.04 - time * 6) * 12 * force;
            const angle = Math.atan2(dy, dx);
            ox = Math.cos(angle) * wave;
            oy = Math.sin(angle) * wave;
          }

          // Shockwave grid ripple push
          liveShockwaves.forEach(sw => {
            const sdx = x - sw.x;
            const sdy = y - sw.y;
            const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
            const diff = Math.abs(sdist - sw.radius);
            if (diff < 90) {
              const swForce = ((90 - diff) / 90) * sw.opacity;
              const swAngle = Math.atan2(sdy, sdx);
              ox += Math.cos(swAngle) * 45 * swForce;
              oy += Math.sin(swAngle) * 45 * swForce;
            }
          });

          if (x === 0) {
            ctx.moveTo(x + ox, y + oy);
          } else {
            ctx.lineTo(x + ox, y + oy);
          }
        }
        ctx.stroke();
      }

      // Draw vertical distorted lines
      for (let x = 0; x < canvas.width; x += gridStep) {
        ctx.beginPath();
        for (let y = 0; y <= canvas.height + sampleStep; y += sampleStep) {
          const dx = x - cursor.x;
          const dy = y - cursor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let ox = 0;
          let oy = 0;

          // Mouse proximity grid wave ripple
          if (dist < 180) {
            const force = (180 - dist) / 180;
            const wave = Math.sin(dist * 0.04 - time * 6) * 12 * force;
            const angle = Math.atan2(dy, dx);
            ox = Math.cos(angle) * wave;
            oy = Math.sin(angle) * wave;
          }

          // Shockwave grid ripple push
          liveShockwaves.forEach(sw => {
            const sdx = x - sw.x;
            const sdy = y - sw.y;
            const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
            const diff = Math.abs(sdist - sw.radius);
            if (diff < 90) {
              const swForce = ((90 - diff) / 90) * sw.opacity;
              const swAngle = Math.atan2(sdy, sdx);
              ox += Math.cos(swAngle) * 45 * swForce;
              oy += Math.sin(swAngle) * 45 * swForce;
            }
          });

          if (y === 0) {
            ctx.moveTo(x + ox, y + oy);
          } else {
            ctx.lineTo(x + ox, y + oy);
          }
        }
        ctx.stroke();
      }

      // Draw ambient particles repelled by shockwaves
      particles.forEach(p => {
        p.angle += p.speed;
        p.x += Math.sin(p.angle) * 0.3;
        p.y += Math.cos(p.angle) * 0.3;

        // Shockwave particle push
        liveShockwaves.forEach(sw => {
          const dx = p.x - sw.x;
          const dy = p.y - sw.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < sw.radius && dist > sw.radius - 80) {
            const force = ((80 - (sw.radius - dist)) / 80) * sw.opacity;
            p.vx += (dx / dist) * force * 16;
            p.vy += (dy / dist) * force * 16;
          }
        });

        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [isRevealed]);

  const handleMouseMoveSection = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cursorPosRef.current = { x, y };
  };

  // Trigger Shockwave ripple starting from stat card center
  const triggerHoverShockwave = (e, index) => {
    if (!canvasRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const cx = rect.left - canvasRect.left + rect.width / 2;
    const cy = rect.top - canvasRect.top + rect.height / 2;

    const colors = ['#2ECC71', '#FF3333', '#FFCC00', '#0077B6'];
    const color = colors[index] || '#FFCC00';

    const newShockwave = {
      id: Date.now() + Math.random(),
      x: cx,
      y: cy,
      radius: 10,
      opacity: 1,
      color: color
    };

    activeShockwavesRef.current.push(newShockwave);
    setActiveShockwaves([...activeShockwavesRef.current]);

    // Briefly shake the case cards underneath!
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  // Magnetic gravity pull on the Behance button
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      
      // Rest center coordinates of the button
      const bx = rect.left + rect.width / 2 - btnOffset.x;
      const by = rect.top + rect.height / 2 - btnOffset.y;
      
      const dx = e.clientX - bx;
      const dy = e.clientY - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 120) {
        // Gravity attraction! Pull button to cursor
        setBtnOffset({ x: dx * 0.65, y: dy * 0.65 });
      } else {
        // Released! Return smoothly
        setBtnOffset({ x: 0, y: 0 });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [btnOffset]);

  // Translate countup values back into translation text format
  const getDisplayValue = (originalValue, idx) => {
    const currentNum = counterValues[idx];
    if (originalValue.includes('5.5')) {
      return originalValue.replace('5.5', currentNum);
    }
    if (originalValue.includes('1,200')) {
      return originalValue.replace('1,200', currentNum.toLocaleString());
    }
    if (originalValue.includes('100')) {
      return originalValue.replace('100', currentNum);
    }
    if (originalValue.includes('1,000,000')) {
      return originalValue.replace('1,000,000', currentNum.toLocaleString());
    }
    return originalValue;
  };

  const stats = t('results.stats') || [];
  const cases = t('results.cases') || [];
  const titleText = t('results.title') || '';
  const titleChars = titleText.split('');

  return (
    <section 
      ref={sectionRef}
      id="results" 
      data-theme="light"
      className="heartbeat-grid-bg"
      onMouseMove={handleMouseMoveSection}
      style={{
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 0'
      }}
    >
      {/* Background Canvas Particles and Liquid Grid */}
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

      {/* Render active shockwave expanding ring lines */}
      {activeShockwaves.map(sw => (
        <span 
          key={sw.id} 
          className="results-shockwave-ring" 
          style={{ 
            left: sw.x, 
            top: sw.y, 
            borderColor: sw.color,
            boxShadow: `0 0 15px ${sw.color}`,
            filter: `drop-shadow(0 0 10px ${sw.color})`
          }} 
        />
      ))}

      <div className="container-pad" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          {/* Cardiac Character Reveal */}
          <h2 
            ref={titleRef}
            style={{ 
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
              marginBottom: '0.4rem', 
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.3'
            }}
          >
            {titleText.split(' ').map((word, wordIdx, wordsArr) => (
              <span 
                key={wordIdx} 
                style={{ 
                  display: 'inline-block', 
                  whiteSpace: 'nowrap',
                  verticalAlign: 'bottom'
                }}
              >
                {word.split('').map((char, charIdx) => (
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
                {wordIdx < wordsArr.length - 1 && (
                  <span style={{ display: 'inline-block' }}>&nbsp;</span>
                )}
              </span>
            ))}
          </h2>

          {/* SVG Flatline Line underneath header */}
          <div style={{ position: 'relative', width: '220px', height: '12px', margin: '0.6rem auto 1.4rem', overflow: 'visible' }}>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <path d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="rgba(33,34,36,0.06)" strokeWidth="1" />
              <path className={"partners-flatline-pulse " + (isRevealed ? "active" : "")} d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div className="full-text">
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                {t('results.descFull')}
              </p>
            </div>
            <div className="short-text">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {t('results.descShort')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '6rem'
          }}
        >
          {stats.map((stat, i) => {
            const hasPulse = pulseBeat > 0 && pulseBeat < 5;
            const cardClass = ['card-green', 'card-red', 'card-yellow', 'card-blue'][i] || '';
            return (
              <StatCard 
                key={i}
                value={getDisplayValue(stat.value, i)}
                label={stat.label}
                hasPulse={hasPulse}
                counterCompleted={counterCompleted}
                cardClass={cardClass}
                onMouseEnter={(e) => triggerHoverShockwave(e, i)}
              />
            );
          })}
        </div>

        {/* Cases Showcase */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem'
          }}
        >
          {cases.map((cs, i) => (
            <CaseCard
              key={i}
              cs={cs}
              index={i}
              isShaking={isShaking}
            />
          ))}
        </div>

        {/* Portfolio Behance CTA (Magnetic Gravity Pull & Infinite Glow) */}
        <div style={{ textAlign: 'center', marginTop: '4.5rem', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            ref={buttonRef}
            style={{
              transform: `translate3d(${btnOffset.x}px, ${btnOffset.y}px, 0)`,
              transition: btnOffset.x === 0 && btnOffset.y === 0 ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
              willChange: 'transform'
            }}
          >
            <a
              href="https://www.behance.net/pulsemarketing1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-liquid-fill"
              style={{ textDecoration: 'none', position: 'relative', overflow: 'hidden' }}
            >
              <span className="liquid-bg" />
              <span className="btn-text-content" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                {t('results.behance')}{' '}
                <span className="behance-glow-pulse" style={{ display: 'inline-flex' }}>
                  <ExternalLink size={17} />
                </span>
              </span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

function StatCard({ value, label, hasPulse, counterCompleted, cardClass, onMouseEnter }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`stat-card-snap ${cardClass} ${hasPulse ? 'stat-card-heartbeat' : ''}`}
      onMouseEnter={(e) => {
        setIsHovered(true);
        onMouseEnter(e);
      }}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '2.5rem clamp(0.6rem, 2vw, 1.8rem)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        opacity: 0, // GSAP reveals this Centrifugally
        transform: isHovered ? 'scale(0.96)' : 'scale(1)',
        willChange: 'transform',
        transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic completed glow sweep wave */}
      {counterCompleted && (
        <span 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(242, 183, 5, 0.22), transparent)',
            transform: 'translateX(-100%)',
            animation: 'glow-sweep-anim 1s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}
      <div 
        className="stat-value"
        style={{ 
          fontFamily: 'var(--font-heading)', 
          fontWeight: 900, 
          fontSize: 'clamp(1.35rem, 4.8vw, 2.4rem)', 
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
          lineHeight: '1.1',
          transition: 'color 0.3s ease',
          position: 'relative',
          zIndex: 2
        }}
      >
        {value}
      </div>
      <div 
        className="stat-label"
        style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)', 
          fontWeight: 600, 
          position: 'relative', 
          zIndex: 2,
          transition: 'color 0.3s ease'
        }}
      >
        {label}
      </div>
    </div>
  );
}

function CaseCard({ cs, index, isShaking }) {
  const [isHovered, setIsHovered] = useState(false);
  const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 });
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Rotate cards on the GPU
    const rotateX = -y * 0.05;
    const rotateY = x * 0.05;
    
    // Magnetic attraction content pull
    const mx = x * 0.14;
    const my = y * 0.14;

    setLocalMouse({ x: mx, y: my });
    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02) translate3d(${mx}px, ${my}px, 15px)`,
      boxShadow: 'var(--shadow-md)',
      borderColor: 'var(--accent)'
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setLocalMouse({ x: 0, y: 0 });
    setTiltStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1) translate3d(0, 0, 0)',
      boxShadow: 'var(--shadow-sm)',
      borderColor: 'var(--border)'
    });
  };

  return (
    <div
      className={`case-card-snap ${isShaking ? 'partners-card-shake' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: 0, // GSAP reveals this Centrifugally
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
        animationDelay: isShaking ? `${index * 0.05}s` : '0s', // Staggered shockwave shake!
        transition: 'transform 0.1s ease, box-shadow 0.3s, border-color 0.3s, opacity 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
        ...tiltStyle
      }}
    >
      {/* Accent growth line running across the bottom */}
      <span className="results-neon-line" />

      <div>
        <span 
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            padding: '0.3rem 0.8rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            marginBottom: '1.2rem',
            fontFamily: 'var(--font-heading)',
            transform: 'translateZ(10px)'
          }}
        >
          {cs.tag}
        </span>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)', transform: 'translateZ(15px)' }}>
          {cs.title}
        </h3>
        
        <div className="full-text" style={{ transform: 'translateZ(10px)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {cs.desc}
          </p>
        </div>
        <div className="short-text" style={{ transform: 'translateZ(10px)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.2rem' }}>
            {cs.shortDesc}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div 
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          transform: 'translateZ(18px)'
        }}
      >
        {cs.metrics.map((metric, idx) => (
          <div 
            key={idx} 
            className="results-growth-indicator"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 700,
              color: isHovered ? '#2ECC71' : 'var(--text-primary)',
              transition: 'color 0.3s ease'
            }}
          >
            <TrendingUp size={16} />
            <span>{metric}</span>
          </div>
        ))}
      </div>
    </div>
  );
}