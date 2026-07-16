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

  const playHeartbeat = (frequency = 60, intensity = 0.5) => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();

      // Lub Beat
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      gain1.gain.setValueAtTime(intensity, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.15);

      // Dub Beat
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(frequency * 1.2, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
        gain2.gain.setValueAtTime(intensity * 0.8, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.18);
      }, 150);
    } catch (e) {
      console.warn('Audio contexts not supported/allowed yet by browser security limits.');
    }
  };

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

  const handleMouseMoveSMM = (e) => {
    if (Math.random() > 0.85) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const symbols = ['❤️', '👍', '🔥', '✨', '💛', '⚡'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      const bubble = document.createElement('span');
      bubble.innerText = symbol;
      bubble.style.position = 'absolute';
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;
      bubble.style.fontSize = '18px';
      bubble.style.pointerEvents = 'none';
      bubble.style.zIndex = '10';
      bubble.style.transition = 'all 1s cubic-bezier(0.1, 0.8, 0.3, 1)';
      bubble.style.transform = 'translate(-50%, -50%) scale(0.5)';
      bubble.style.opacity = '1';

      card.appendChild(bubble);

      setTimeout(() => {
        bubble.style.transform = 'translate(-50%, -100px) scale(1.6) rotate(' + (Math.random() * 40 - 20) + 'deg)';
        bubble.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        bubble.remove();
      }, 1050);
    }
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
            color: Math.random() > 0.4 ? 'rgba(253, 252, 247, 0.28)' : 'rgba(242, 183, 5, 0.65)',
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

      // Draw EKG Bio-Mesh Grid
      const gridSpacing = 40;
      const gridAmp = 18;
      const gridSpeed = 0.08;
      const waveOffset = time * 8 * gridSpeed;

      // Draw horizontal lines with active EKG distortion
      ctx.strokeStyle = 'rgba(255, 204, 0, 0.05)';
      ctx.lineWidth = 1;

      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          // Create mouse distention gravity well
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = mouse.active ? Math.max(0, (200 - dist) / 200) : 0;

          // Standard sine wave coupled with EKG spikes
          let wave = Math.sin(x * 0.005 + waveOffset) * gridAmp;
          if (Math.abs(x - (waveOffset * 100) % canvas.width) < 150) {
            wave += Math.sin(x * 0.05) * gridAmp * 1.5; // Simulate ECG spike passing through
          }

          // Distort with mouse movement
          const yOffset = wave + (dy * force * 0.4);

          if (x === 0) ctx.moveTo(x, y + yOffset);
          else ctx.lineTo(x, y + yOffset);
        }
        ctx.stroke();
      }

      // Draw vertical grid lines
      ctx.strokeStyle = 'rgba(255, 204, 0, 0.025)';
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

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
    // 3. Description & buttons fade-in
    gsap.fromTo('.hero-left-column p, .hero-left-column a, .hero-left-column button',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.6
      }
    );
  }, [t]);

  useEffect(() => {
    const serviceCards = document.querySelectorAll('.hero-service-card');
    
    // Function to reset cards to exploded states
    const resetCards = () => {
      serviceCards.forEach((card) => {
        gsap.set(card, { backgroundColor: 'transparent', borderColor: 'transparent', scale: 0.95 });
        
        const brackets = card.querySelectorAll('.card-corner-bracket');
        brackets.forEach((bracket) => {
          let startX = '0px', startY = '0px', startRot = 0;
          if (bracket.classList.contains('top-left')) {
            startX = '-15vw'; startY = '-15vh'; startRot = -90;
          } else if (bracket.classList.contains('top-right')) {
            startX = '15vw'; startY = '-15vh'; startRot = 90;
          } else if (bracket.classList.contains('bottom-left')) {
            startX = '-15vw'; startY = '15vh'; startRot = -180;
          } else if (bracket.classList.contains('bottom-right')) {
            startX = '15vw'; startY = '15vh'; startRot = 180;
          }
          gsap.set(bracket, { x: startX, y: startY, rotation: startRot, opacity: 0 });
        });

        const visual = card.querySelector('.card-visual-wrapper');
        if (visual) {
          gsap.set(visual, { scale: 0.3, opacity: 0, rotateY: 180, y: 40 });
        }

        const info = card.querySelector('.card-info');
        if (info) {
          gsap.set(info, { y: 35, opacity: 0 });
        }
      });
    };

    // Function to run Cardiac Assembly
    const assembleCards = () => {
      serviceCards.forEach((card, cardIdx) => {
        const delay = 0.1 + cardIdx * 0.18;
        
        gsap.to(card,
          { 
            backgroundColor: 'rgba(255, 255, 255, 0.02)', 
            borderColor: 'rgba(255, 255, 255, 0.06)', 
            scale: 1, 
            duration: 0.8, 
            delay: delay, 
            ease: 'power3.out',
            onStart: () => {
              playHeartbeat(55 + cardIdx * 5, 0.2);
            }
          }
        );

        const brackets = card.querySelectorAll('.card-corner-bracket');
        brackets.forEach((bracket) => {
          gsap.to(bracket,
            { x: '0px', y: '0px', rotation: 0, opacity: 1, duration: 0.85, delay: delay, ease: 'back.out(2)' }
          );
        });

        const visual = card.querySelector('.card-visual-wrapper');
        if (visual) {
          gsap.to(visual,
            { scale: 1, opacity: 1, rotateY: 0, y: 0, duration: 0.95, delay: delay + 0.1, ease: 'power4.out' }
          );
        }

        const info = card.querySelector('.card-info');
        if (info) {
          gsap.to(info,
            { y: 0, opacity: 1, duration: 0.75, delay: delay + 0.25, ease: 'power2.out' }
          );
        }
      });
    };

    // Initial reset
    resetCards();

    // IntersectionObserver scroll tracker
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          assembleCards();
        } else {
          resetCards();
        }
      });
    }, {
      threshold: 0.15
    });

    const gridEl = document.querySelector('.hero-services-grid');
    if (gridEl) {
      observer.observe(gridEl);
    }

    return () => {
      if (gridEl) {
        observer.unobserve(gridEl);
      }
    };
  }, [t]);

  useEffect(() => {
    const cards = document.querySelectorAll('.hero-service-card');
    
    const handleMouseMoveCard = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      
      gsap.to(card, {
        rotateX: -y / 12,
        rotateY: x / 12,
        transformPerspective: 800,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeaveCard = (e) => {
      const card = e.currentTarget;
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power4.out"
      });
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMoveCard);
      card.addEventListener('mouseleave', handleMouseLeaveCard);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMoveCard);
        card.removeEventListener('mouseleave', handleMouseLeaveCard);
      });
    };
  }, []);

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
      data-theme="dark"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '6rem 2rem 2.5rem',
        position: 'relative',
        backgroundColor: '#000000'
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

      <style>{`
        #hero {
          height: 100vh;
          min-height: 750px;
          overflow: hidden;
          box-sizing: border-box;
        }
        @media (max-width: 1024px), (max-height: 760px) {
          #hero {
            height: auto !important;
            min-height: 100vh !important;
            overflow: visible !important;
            padding-top: 6.5rem !important;
            padding-bottom: 3.5rem !important;
          }
          .hero-inner-container {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding-top: 1rem !important;
            gap: 2.5rem !important;
          }
          .hero-left-column {
            align-items: center !important;
            text-align: center !important;
            max-width: 100% !important;
          }
          .hero-left-column h1 {
            font-size: clamp(30px, 5.5vw, 44px) !important;
          }
          .hero-right-column {
            width: 100% !important;
          }
          .hero-services-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
            gap: 1.5rem !important;
            margin: 0 auto !important;
          }
        }
      `}</style>

      <div 
        className="hero-inner-container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '3rem',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          zIndex: 2,
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        {/* LEFT COLUMN: Compact Headline & Description */}
        <div 
          className="hero-left-column"
          style={{
            flex: '1',
            maxWidth: '520px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            alignItems: 'flex-start'
          }}
        >
          {/* Slogan Badge with Breathing Aura Ring */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: '#212224',
              padding: '0.5rem 1.2rem',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
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
                color: '#FAF6F1',
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
              fontSize: 'clamp(36px, 4vw, 52px)',
              lineHeight: '1.15',
              fontFamily: 'var(--font-heading)',
              color: '#FAF6F1',
              margin: 0
            }}
          >
            {renderTitle()}
          </h1>

          {/* Description Paragraph */}
          <div style={{ width: '100%' }}>
            <div className="full-text">
              <p 
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.05rem',
                  color: '#A0A5AA',
                  lineHeight: '1.6',
                  margin: 0
                }}
              >
                {t('hero.descFull1')}
              </p>
              <p 
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  color: '#A0A5AA',
                  marginTop: '0.6rem',
                  fontStyle: 'italic',
                  margin: '0.6rem 0 0'
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
                  color: '#A0A5AA',
                  lineHeight: '1.5',
                  margin: 0
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
              marginTop: '0.5rem',
              flexWrap: 'wrap'
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

            {/* Free Audit: Sleek Glassmorphic Outline Button */}
            <button 
              onClick={onOpenBonus} 
              className="btn-free-audit"
            >
              <span>{t('hero.btnAudit')}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 3-Column Services Interactive Grid */}
        <div 
          className="hero-right-column"
          style={{
            flex: '1.2',
            width: '100%'
          }}
        >
          <div 
            className="hero-services-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Card 1: SMM */}
            <div className="hero-service-card card-smm" onMouseMove={handleMouseMoveSMM}>
              <div className="card-corner-bracket top-left" style={{ borderColor: '#FF3333' }}></div>
              <div className="card-corner-bracket top-right" style={{ borderColor: '#FF3333' }}></div>
              <div className="card-corner-bracket bottom-left" style={{ borderColor: '#FF3333' }}></div>
              <div className="card-corner-bracket bottom-right" style={{ borderColor: '#FF3333' }}></div>
              <div className="card-visual-wrapper">
                <img src="/smm_card.png" alt="SMM" className="card-visual-img" />
                <span className="floating-heart fh1">❤️</span>
                <span className="floating-like fl1">👍</span>
                <span className="floating-heart fh2">❤️</span>
                <span className="floating-like fl2">🔥</span>
                <span className="floating-pulse fp1">💛</span>
                <span className="floating-pulse fp2">⚡</span>
              </div>
              <div className="card-info" style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                  {t('hero.grid.smmTitle')}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#A0A5AA', lineHeight: '1.4', margin: 0, fontFamily: 'var(--font-sans)', transition: 'color 0.3s ease' }}>
                  {t('hero.grid.smmDesc')}
                </p>
              </div>
            </div>

            {/* Card 2: Branding */}
            <div className="hero-service-card card-branding">
              <div className="card-corner-bracket top-left" style={{ borderColor: '#FFCC00' }}></div>
              <div className="card-corner-bracket top-right" style={{ borderColor: '#FFCC00' }}></div>
              <div className="card-corner-bracket bottom-left" style={{ borderColor: '#FFCC00' }}></div>
              <div className="card-corner-bracket bottom-right" style={{ borderColor: '#FFCC00' }}></div>
              <div className="card-visual-wrapper">
                <img src="/branding_card.png" alt="Branding" className="card-visual-img" />
                <div className="branding-laser-line" />
              </div>
              <div className="card-info" style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                  {t('hero.grid.brandingTitle')}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#A0A5AA', lineHeight: '1.4', margin: 0, fontFamily: 'var(--font-sans)', transition: 'color 0.3s ease' }}>
                  {t('hero.grid.brandingDesc')}
                </p>
              </div>
            </div>

            {/* Card 3: CGI */}
            <div className="hero-service-card card-cgi">
              <div className="card-corner-bracket top-left" style={{ borderColor: '#2ECC71' }}></div>
              <div className="card-corner-bracket top-right" style={{ borderColor: '#2ECC71' }}></div>
              <div className="card-corner-bracket bottom-left" style={{ borderColor: '#2ECC71' }}></div>
              <div className="card-corner-bracket bottom-right" style={{ borderColor: '#2ECC71' }}></div>
              <div className="card-visual-wrapper">
                <img src="/cgi_card.png" alt="CGI" className="card-visual-img" />
                <div className="orbiting-ring or1" />
                <div className="orbiting-ring or2" />
              </div>
              <div className="card-info" style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                  {t('hero.grid.cgiTitle')}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#A0A5AA', lineHeight: '1.4', margin: 0, fontFamily: 'var(--font-sans)', transition: 'color 0.3s ease' }}>
                  {t('hero.grid.cgiDesc')}
                </p>
              </div>
            </div>
          </div>
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
