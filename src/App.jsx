import React, { useState, useEffect, useRef } from 'react';
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Partners from './components/Partners';
import Results from './components/Results';
import Services from './components/Services';
import AboutUs from './components/AboutUs';
import Blog from './components/Blog';
import ContactUs from './components/ContactUs';
import AIChatbot from './components/AIChatbot';
import BonusModal from './components/BonusModal';
import DetailedServices from './components/DetailedServices';
import DetailedResults from './components/DetailedResults';
import DetailedPartners from './components/DetailedPartners';
import DetailedAbout from './components/DetailedAbout';
import DetailedBlog from './components/DetailedBlog';
import DetailedContact from './components/DetailedContact';
import gsap from 'gsap';

const getPageFromPath = (path) => {
  if (path === '/services') return 'services';
  if (path === '/results') return 'results';
  if (path === '/partners') return 'partners';
  if (path === '/about') return 'about';
  if (path === '/blog') return 'blog';
  if (path === '/contact') return 'contact';
  return 'home';
};

// The "Pulse Tunnel Transition" Overlay (Liquid Capsule Mask / GSAP Loader)
function PulseTunnelTransition({ target, coords, onComplete, changePage }) {
  const overlayRef = useRef(null);
  const ekgPathRef = useRef(null);
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const shockwaveRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    // 1. EKG Laser Pass: animate stroke-dashoffset of EKG line
    tl.fromTo(ekgPathRef.current,
      { strokeDasharray: 1000, strokeDashoffset: 1000 },
      { strokeDashoffset: 0, duration: 0.4, ease: "power2.inOut" }
    );

    // 2. "Lub-Dub" Double Beat:
    tl.to(dotRef.current, {
      scale: 1.15,
      duration: 0.1,
      ease: "sine.out"
    })
    .to(dotRef.current, {
      scale: 0.95,
      duration: 0.05,
      ease: "sine.inOut"
    })
    .to(dotRef.current, {
      scale: 1.35,
      duration: 0.15,
      ease: "back.out(2)" // physical recoil bounce
    });

    // Simultaneously animate the background glow with neon blend screen
    tl.to(glowRef.current, {
      opacity: 0.9,
      scale: 1.5,
      duration: 0.15,
      yoyo: true,
      repeat: 1
    }, "-=0.3");

    // 3. Shockwave Ripple:
    tl.fromTo(shockwaveRef.current,
      { scale: 0.8, opacity: 0.8 },
      { scale: 3, opacity: 0, duration: 0.5, ease: "power2.out" },
      "-=0.15"
    );

    // 4. Portal Expansion / Liquid Reveal:
    tl.to(dotRef.current, {
      scale: 90,
      duration: 0.4,
      ease: "power4.in",
      onStart: () => {
        // Change page state in the middle of transition blackout
        if (target === '#services') {
          changePage('services', '/services');
        } else if (target === '#results') {
          changePage('results', '/results');
        } else if (target === '#partners-lab') {
          changePage('partners', '/partners');
        } else if (target === '#about') {
          changePage('about', '/about');
        } else if (target === '#blog') {
          changePage('blog', '/blog');
        } else if (target === '#contact') {
          changePage('contact', '/contact');
        } else if (target.startsWith('home:')) {
          changePage('home', '/');
          const anchor = target.split(':')[1];
          setTimeout(() => {
            const element = document.querySelector(anchor);
            if (element) {
              element.scrollIntoView({ behavior: 'auto' });
            } else {
              window.scrollTo({ top: 0, behavior: 'auto' });
            }
          }, 50);
        }
      }
    });

    // Fade out overlay simultaneously
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power4.in"
    }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, [target, onComplete, changePage]);

  return (
    <div 
      ref={overlayRef}
      className="pulse-transition-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1E2022',
        zIndex: 999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'all'
      }}
    >
      {/* Glow Backing with Screen Blend Mode */}
      <div 
        ref={glowRef}
        className="radial-glow-back"
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242,183,5,0.45) 0%, transparent 70%)',
          mixBlendMode: 'screen',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Shockwave Ring */}
      <div 
        ref={shockwaveRef}
        className="shockwave-ring"
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '2.5px solid var(--accent)',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {/* SVG EKG Laser Pass Line */}
      <div style={{ position: 'absolute', width: '380px', height: '80px', zIndex: 3 }}>
        <svg viewBox="0 0 300 80" style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
          {/* Static subtle background path */}
          <path d="M 0 40 H 120 L 130 15 L 140 65 L 150 40 H 300" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="2.5" />
          
          {/* Neon animated laser path */}
          <path 
            ref={ekgPathRef}
            d="M 0 40 H 120 L 130 15 L 140 65 L 150 40 H 300" 
            fill="none" 
            stroke="#FF3333" 
            strokeWidth="3.2" 
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 8px #FF3333)'
            }}
          />
        </svg>
      </div>

      {/* Yellow Center Dot */}
      <div 
        ref={dotRef}
        className="yellow-center-dot"
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'var(--accent)',
          borderRadius: '50%',
          boxShadow: '0 0 25px var(--accent)',
          position: 'relative',
          zIndex: 4,
          transform: 'scale(1)',
          filter: 'blur(0.2px)'
        }}
      />
    </div>
  );
}

function App() {
  const [renderSite, setRenderSite] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [bonusOpen, setBonusOpen] = useState(false);
  
  // Custom SPA Router States synced with browser History API
  const [page, setPage] = useState(getPageFromPath(typeof window !== 'undefined' ? window.location.pathname : '/'));
  const [isLogoCollapsing, setIsLogoCollapsing] = useState(false);
  const [isLogoExpanding, setIsLogoExpanding] = useState(false);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Tunnel Transition State
  const [transitionTarget, setTransitionTarget] = useState(null);
  const [clickCoords, setClickCoords] = useState({ x: 0, y: 0 });

  const handleNavigate = (targetHref, coords) => {
    // If target is results, services, partners, about, blog or contact page
    if (targetHref === '#services' || targetHref === '#results' || targetHref === '#partners-lab' || targetHref === '#about' || targetHref === '#blog' || targetHref === '#contact') {
      setClickCoords(coords);
      setTransitionTarget(targetHref);
    } else {
      // It's a standard home anchor link
      if (page === 'home') {
        const element = document.querySelector(targetHref);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (targetHref === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // We are on a subpage, route back to home and scroll to section via transition
        setClickCoords(coords);
        setTransitionTarget(`home:${targetHref}`);
      }
    }
  };

  const handlePageChange = (nextPage, path) => {
    window.history.pushState(null, '', path);
    setPage(nextPage);
  };

  // Special "Heart Reverse Collapse" transition for clicking Logo / Back
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Step 1: Trigger collapse
    setIsLogoCollapsing(true);
    
    // Step 2: Switch pages in collapsed blackout
    setTimeout(() => {
      setPage('home');
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'auto' });
      setIsLogoCollapsing(false);
      setIsLogoExpanding(true);
      
      // Step 3: Expand back
      setTimeout(() => {
        setIsLogoExpanding(false);
      }, 500);
    }, 350);
  };

  return (
    <>
      {/* 1. Intro Heartbeat Animation */}
      {!introFinished && (
        <IntroAnimation 
          onRenderSite={() => setRenderSite(true)} 
          onComplete={() => setIntroFinished(true)} 
        />
      )}

      {/* 2. Main Site content - Render only after intro completes for clean scroll performance */}
      {renderSite && (
        <div 
          id="main-app-content"
          className={`${isLogoCollapsing ? 'logo-collapse-active' : ''} ${isLogoExpanding ? 'logo-expand-active' : ''}`}
        >
          
          {/* Navigation Bar */}
          <Navbar 
            onOpenBonus={() => setBonusOpen(true)} 
            onNavigate={handleNavigate}
            onLogoClick={handleLogoClick}
            currentPage={page}
          />

          {page === 'home' && (
            <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
              {/* Hero Section */}
              <HeroSection onOpenBonus={() => setBonusOpen(true)} />

              {/* Partners Marquee (Համագործակիցներ) */}
              <Partners onNavigate={handleNavigate} />

              {/* Results Dashboard & Cases (Արդյունքներ) */}
              <Results />

              {/* Services Cards Grid (Ծառայություններ) */}
              <Services />

              {/* About us & Our Team (Մեր մասին / Թիմ) */}
              <AboutUs />

              {/* SMM & Hiring Feed (Բլոգ) */}
              <Blog />

              {/* Inquiries & Social links (Կապ) */}
              <ContactUs />
            </div>
          )}

          {page === 'services' && (
            <DetailedServices onGoBack={handleLogoClick} />
          )}

          {page === 'results' && (
            <DetailedResults onGoBack={handleLogoClick} />
          )}

          {page === 'partners' && (
            <DetailedPartners onGoBack={handleLogoClick} />
          )}

          {page === 'about' && (
            <DetailedAbout onGoBack={handleLogoClick} />
          )}

          {page === 'blog' && (
            <DetailedBlog onGoBack={handleLogoClick} />
          )}

          {page === 'contact' && (
            <DetailedContact onGoBack={handleLogoClick} />
          )}

          {/* AI Helper chatbot */}
          <AIChatbot />

          {/* Interactive Quiz / Audit Lead capture modal */}
          <BonusModal isOpen={bonusOpen} onClose={() => setBonusOpen(false)} />
        </div>
      )}

      {/* 3. Pulse Tunnel Transition Wipe Portal */}
      {transitionTarget && (
        <PulseTunnelTransition 
          target={transitionTarget}
          coords={clickCoords}
          changePage={handlePageChange}
          onComplete={() => setTransitionTarget(null)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default App;

