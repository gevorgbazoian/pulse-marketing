import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function IntroAnimation({ onRenderSite, onComplete }) {
  const containerRef = useRef(null);
  const whitePanelRef = useRef(null);
  const charcoalPanelRef = useRef(null);
  const yellowPanelRef = useRef(null);
  
  const pathRef = useRef(null);
  const flyingDotRef = useRef(null);
  const innerDotRef = useRef(null);
  const logoGroupRef = useRef(null);
  const logoFrameRef = useRef(null);
  const letterPRef = useRef(null);
  const remainingLettersGroupRef = useRef(null);
  const remainingLettersRef = useRef([]);
  const flashOverlayRef = useRef(null);

  const onRenderSiteRef = useRef(onRenderSite);
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onRenderSiteRef.current = onRenderSite;
    onCompleteRef.current = onComplete;
  }, [onRenderSite, onComplete]);
  
  useEffect(() => {
    const path = pathRef.current;
    const flyingDot = flyingDotRef.current;
    const innerDot = innerDotRef.current;
    const logoGroup = logoGroupRef.current;
    const logoFrame = logoFrameRef.current;
    const letterP = letterPRef.current;
    const remainingLettersGroup = remainingLettersGroupRef.current;
    const remainingLetters = remainingLettersRef.current;
    
    const flashOverlay = flashOverlayRef.current;
    const whitePanel = whitePanelRef.current;
    const charcoalPanel = charcoalPanelRef.current;
    const yellowPanel = yellowPanelRef.current;

    // Clean up letters array to prevent any null-element GSAP animation crashes
    const activeLetters = remainingLetters.filter(Boolean);

    // Get ECG path length
    const pathLength = path.getTotalLength();
    
    // Set initial ECG line state
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      opacity: 1
    });

    // Set initial logo frame state (hidden, circle shape)
    // Circle path length: 2 * PI * 27 = 169.64
    gsap.set(logoFrame, {
      strokeDasharray: 170,
      strokeDashoffset: 170,
      opacity: 0
    });

    // Set initial styles for other elements
    gsap.set(flyingDot, { opacity: 0, attr: { r: 12 } });
    gsap.set(innerDot, { opacity: 0 }); // nested dot has native r="3.5", starts hidden
    gsap.set(letterP, { opacity: 0 });
    gsap.set(activeLetters, { 
      opacity: 0, 
      scale: 0.4, 
      y: -15,
      transformOrigin: 'center center' 
    });

    const tl = gsap.timeline({
      onComplete: () => {
        onCompleteRef.current();
      }
    });

      // Helper function to trigger heartbeat flash
      const triggerFlash = (intensity = 0.08) => {
        gsap.fromTo(flashOverlay, 
          { opacity: intensity }, 
          { opacity: 0, duration: 0.35, ease: 'power2.out' }
        );
      };

      // 1. ECG Heartbeat drawing loop with physical thump beats
      
      // Stage 1: Flatline (0.0s - 0.6s)
      tl.to(path, {
        strokeDashoffset: pathLength * 0.748,
        duration: 0.6,
        ease: 'none'
      });
      
      // Stage 2: First beat spike (0.6s - 0.9s)
      tl.to(path, {
        strokeDashoffset: pathLength * 0.656,
        duration: 0.1,
        ease: 'power2.out',
        onStart: () => triggerFlash(0.04) // Very light screen flash
      });
      
      tl.to(path, {
        strokeDashoffset: pathLength * 0.475,
        duration: 0.1,
        ease: 'power2.inOut'
      });
      
      tl.to(path, {
        strokeDashoffset: pathLength * 0.382,
        duration: 0.1,
        ease: 'power2.out'
      });
      
      // Stage 3: Flat baseline to spike start (0.9s - 1.3s)
      tl.to(path, {
        strokeDashoffset: pathLength * 0.137,
        duration: 0.4,
        ease: 'none'
      });
      
      // Stage 4: Apex spike (1.3s - 1.4s)
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 0.1,
        ease: 'power4.out',
        onStart: () => triggerFlash(0.06)
      });

      // 2. Yellow flying dot emerges at the Apex (1.4s)
      tl.to(flyingDot, {
        x: 400,
        y: 10,
        duration: 0
      });
      
      tl.to(flyingDot, {
        opacity: 1,
        duration: 0.1,
        ease: 'power2.out'
      });

      // 3. Typography Reveal Sweep (1.5s - 2.3s)
      tl.to(flyingDot, {
        x: 780,
        y: 18,
        duration: 0.8,
        ease: 'power2.inOut'
      }, 'sweep');

      // Staggered typewriter reveal for letters
      tl.to(letterP, {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out'
      }, 'sweep');

      tl.to(activeLetters, {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.35,
        ease: 'back.out(1.5)'
      }, 'sweep+=0.05');

      // 4. Dot Return (2.3s - 2.6s)
      tl.to(flyingDot, {
        x: 430.9,
        y: 31.5,
        attr: { r: 3.5 },
        duration: 0.3,
        ease: 'power3.inOut'
      }, 'climax');

      // Fade out remaining letters and red ECG path
      tl.to([remainingLettersGroup, path], {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out'
      }, 'climax');

      // 5. Perform the Flip/Logo lock (2.6s)
      tl.to(flyingDot, {
        opacity: 0,
        duration: 0
      }, 'lock');

      tl.to(innerDot, {
        opacity: 1,
        duration: 0
      }, 'lock');

      // Draw the Rounded Gradient Circle Frame
      tl.to(logoFrame, {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 'lock');

      // 6. Preloader Grand Exit: Dissolve to hero
      tl.to(logoGroup, {
        scale: 3.5,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut'
      }, 'lock+=0.4');

      // Render main site underneath
      tl.call(() => onRenderSiteRef.current(), null, 'lock+=0.6');

      // Slide up the stacked curtains
      tl.to(whitePanel, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power3.inOut'
      }, 'lock+=0.6');

      tl.to(charcoalPanel, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power3.inOut'
      }, 'lock+=0.75');

      tl.to(yellowPanel, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power3.inOut'
      }, 'lock+=0.9');
    return () => {
      tl.kill();
    };
  }, []);

  const brandLetters = "PULSE MARKETING".split("");

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      {/* Red Thump Flash Overlay */}
      <div 
        ref={flashOverlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(217, 61, 61, 0.05)',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 4
        }}
      />

      {/* Panel 1: Main Ivory Canvas Panel */}
      <div
        ref={whitePanelRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#FDFCF7',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3,
          pointerEvents: 'auto'
        }}
      >
        <div style={{ position: 'relative', width: '90%', maxWidth: '850px' }}>
          <svg 
            viewBox="0 -20 850 220" 
            width="100%" 
            height="100%" 
            style={{ overflow: 'visible' }}
          >
            {/* Defs for Logo Gradient */}
            <defs>
              <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D93D3D" />
                <stop offset="100%" stopColor="#F2B705" />
              </linearGradient>
            </defs>

            {/* Heartbeat ECG path */}
            <path
              ref={pathRef}
              d="M 50 100 L 200 100 L 220 100 L 235 40 L 255 160 L 275 100 L 295 100 L 310 125 L 325 75 L 340 100 L 375 100 L 400 10"
              fill="none"
              stroke="#D93D3D"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Group representing the final logo (P + Dot + Gradient border) */}
            <g ref={logoGroupRef} style={{ transformOrigin: '440px 14px' }}>
              {/* Rounded circle gradient frame enclosing P */}
              <rect
                ref={logoFrameRef}
                x="413"
                y="-13"
                width="54"
                height="54"
                rx="27"
                ry="27"
                fill="none"
                stroke="url(#brand-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* The letter P in official logo geometry path scaled to match */}
              <g ref={letterPRef} style={{ transformOrigin: '440px 28px' }}>
                <path
                  d="M 72.5 137.5 V 75 A 25 25 0 1 0 72.5 74.99"
                  transform="translate(410.6, -7) scale(0.28)"
                  fill="none"
                  stroke="#212224"
                  strokeWidth="25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Inner yellow circle (Logo P's dot) - Nested behind text group by order */}
              <circle
                ref={innerDotRef}
                cx="430.9"
                cy="31.5"
                r="3.5"
                fill="#F2B705"
                style={{ 
                  filter: 'drop-shadow(0px 2px 8px rgba(242, 183, 5, 0.6))',
                  mixBlendMode: 'multiply'
                }}
              />

              {/* Yellow flying dot - Moved inside logoGroupRef to share the exact same rendering coordinate space */}
              <circle
                ref={flyingDotRef}
                cx="0"
                cy="0"
                r="12"
                fill="#F2B705"
                style={{ filter: 'drop-shadow(0px 2px 8px rgba(242, 183, 5, 0.6))', mixBlendMode: 'multiply' }}
              />
            </g>

            {/* Remaining letters group "U L S E M A R K E T I N G" */}
            <g ref={remainingLettersGroupRef}>
              {brandLetters.map((char, index) => {
                if (index === 0) return null; // skip P (already handled in logo group)
                
                let xPos = 440 + index * 24;
                if (index >= 5) xPos += 4; // add space between words

                return (
                  <g
                    key={index}
                    ref={el => remainingLettersRef.current[index - 1] = el}
                    style={{ transformOrigin: `${xPos}px 18px` }}
                  >
                    <text
                      x={xPos}
                      y="28"
                      fontFamily="'Outfit', sans-serif"
                      fontWeight="900"
                      fontSize="28"
                      letterSpacing="1"
                      textAnchor="middle"
                      fill={index >= 6 ? '#F2B705' : '#212224'}
                    >
                      {char}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Subtle Tagline */}
          <div 
            style={{ 
              textAlign: 'center', 
              marginTop: '2rem', 
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.9rem',
              color: '#6A6E73',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}
          >
            Empowering Your Brand's Pulse
          </div>
        </div>
      </div>

      {/* Layered Wave Panel 2 (Charcoal) */}
      <div
        ref={charcoalPanelRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#212224',
          zIndex: 2
        }}
      />

      {/* Layered Wave Panel 3 (Yellow Accent) */}
      <div
        ref={yellowPanelRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#F2B705',
          zIndex: 1
        }}
      />
    </div>
  );
}
