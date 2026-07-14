import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Briefcase, ExternalLink, Calendar, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const InstagramIcon = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// High-End Typewriter / Scramble reveal component with neon glow
function TypewriterText({ text, active, delay = 0 }) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (active) {
      let currentText = '';
      let charIndex = 0;
      setDisplayText('');
      
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          if (charIndex < text.length) {
            currentText += text[charIndex];
            setDisplayText(currentText);
            charIndex++;
          } else {
            clearInterval(interval);
          }
        }, 35); // rapid typewriter reveal speed
        
        return () => clearInterval(interval);
      }, delay);
      
      return () => clearTimeout(timeout);
    } else {
      setDisplayText('');
    }
  }, [active, text, delay]);

  return (
    <span className="typewriter-glow">
      {displayText}
      {displayText.length < text.length && <span className="typewriter-cursor">|</span>}
    </span>
  );
}

export default function Blog() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const videoRef = useRef(null);
  
  // States
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reelHover, setReelHover] = useState(false);
  const [reelTilt, setReelTilt] = useState({});
  const [phoneTilt, setPhoneTilt] = useState({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const categories = ['ALL', 'SMM', 'MARKETING', 'DESIGN'];

  // Window Resize Listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        } else {
          setIsRevealed(false);
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Heartbeat Synchronization loop for Video PlaybackRate
  useEffect(() => {
    let beatInterval;
    if (isRevealed) {
      beatInterval = setInterval(() => {
        if (videoRef.current) {
          // Heartbeat thump speed sequence: speed up, slow down, normalize
          videoRef.current.playbackRate = 2.4;
          setTimeout(() => {
            if (videoRef.current) videoRef.current.playbackRate = 0.55;
          }, 120);
          setTimeout(() => {
            if (videoRef.current) videoRef.current.playbackRate = 1.0;
          }, 450);
        }
      }, 1600); // 1.6s cardiac pulse frequency
    }
    return () => clearInterval(beatInterval);
  }, [isRevealed]);

  const postsListTranslated = t('blog.posts') || [];
  const postLinks = ['info@pulsemarketing.am', 'https://www.instagram.com/p/C3ktVUptYeo/', 'info@pulsemarketing.am'];
  const postTypes = ['HIRING', 'COLLABORATION', 'HIRING'];
  const postImages = [
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'
  ];
  const postCategories = ['SMM', 'DESIGN', 'MARKETING'];

  const posts = postsListTranslated.map((post, index) => ({
    ...post,
    link: postLinks[index],
    type: postTypes[index],
    image: postImages[index],
    category: postCategories[index]
  }));

  const filteredPosts = activeIndex === 0 
    ? posts 
    : posts.filter(post => post.category === categories[activeIndex]);

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.blog-card-wrapper');
      gsap.fromTo(cards,
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [activeIndex]);

  // Dynamic sliding indicator for categories
  const getIndicatorStyle = () => {
    const tabWidth = windowWidth < 480 ? 76 : 110;
    return {
      position: 'absolute',
      top: '4px',
      left: 4 + activeIndex * tabWidth + 'px',
      width: tabWidth - 8 + 'px',
      height: 'calc(100% - 8px)',
      borderRadius: '9999px',
      backgroundColor: 'var(--accent)',
      transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
      zIndex: 1
    };
  };

  // 3D Perspective Tilt on Featured Reel container
  const handleReelMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateX = -y * 0.025; // Gentler tilt for big cards
    const rotateY = x * 0.025;
    
    // Dynamic holographic sheen angle sweep
    const sheen = e.currentTarget.querySelector('.reel-card-sheen');
    if (sheen) {
      const px = (e.clientX - rect.left) / rect.width * 100;
      sheen.style.background = `linear-gradient(${135 + px}deg, transparent 35%, rgba(242, 183, 5, 0.15) 50%, transparent 65%)`;
    }

    setReelTilt({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`,
      boxShadow: '0 20px 40px rgba(242, 183, 5, 0.12), 0 0 35px rgba(217, 61, 61, 0.15)' // Ambient dominant color glow (yellow/red)
    });

    // Independent phone container tilt (4-5 degrees max at edges)
    const phoneRotateX = -y * 0.045;
    const phoneRotateY = x * 0.045;
    const shadowX = -x * 0.08;
    const shadowY = -y * 0.08;

    setPhoneTilt({
      transform: `perspective(1000px) rotateX(${phoneRotateX}deg) rotateY(${phoneRotateY}deg) scale(1.035)`,
      boxShadow: `${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.35)`
    });
  };

  const handleReelMouseLeave = (e) => {
    setReelHover(false);
    setReelTilt({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      boxShadow: 'none'
    });
    setPhoneTilt({
      transform: 'none',
      boxShadow: 'var(--shadow-lg)'
    });
  };

  const handleWatchClick = (e) => {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.position = 'absolute';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.background = 'rgba(255, 255, 255, 0.4)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.left = `${x - 50}px`;
    ripple.style.top = `${y - 50}px`;
    ripple.style.transform = 'scale(0)';
    ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
    ripple.style.opacity = '1';
    
    btn.appendChild(ripple);
    
    // Force reflow
    void ripple.offsetWidth;
    
    ripple.style.transform = 'scale(3)';
    ripple.style.opacity = '0';
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <section 
      ref={sectionRef}
      id="blog" 
      style={{
        position: 'relative',
        padding: windowWidth < 480 ? '5rem 1rem' : '8rem 2rem',
        backgroundColor: '#1E2022',
        color: '#FDFCF7',
        overflow: 'hidden'
      }}
    >
      {/* Background blobs */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.12,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '55%',
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            top: '-200px',
            right: '-100px',
            animation: 'floatGlow 15s infinite alternate ease-in-out'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #D93D3D 0%, transparent 70%)',
            bottom: '-150px',
            left: '-150px',
            animation: 'floatGlow 20s infinite alternate-reverse ease-in-out'
          }}
        />
      </div>

      <div className="container-pad" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Section Header - flex column to prevent line-wrapping overlaps */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent)',
              fontWeight: 800,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1rem'
            }}
          >
            {/* Reactive Heart Icon - pulses continuously */}
            <Heart className="heart-icon-pulse" size={16} style={{ display: 'inline-block' }} />
            <span>{t('blog.badge')}</span>
          </div>
          
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', margin: 0, fontFamily: 'var(--font-heading)', lineHeight: '1.3', textAlign: 'center' }}>
            <TypewriterText text={t('blog.title')} active={isRevealed} delay={100} />
          </h2>
          
          {/* Cardiac flatline underline */}
          <div style={{ position: 'relative', width: '180px', height: '12px', overflow: 'visible', margin: '0.6rem 0 1.4rem 0' }}>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <path d="M 0 5 H 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              <path 
                className={"blog-header-divider " + (isRevealed ? "active" : "")}
                d="M 0 5 H 100"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div className="full-text">
              <p style={{ color: '#A0A5AA', fontSize: '1.05rem', lineHeight: '1.6' }}>
                {t('blog.descFull')}
              </p>
            </div>
            <div className="short-text">
              <p style={{ color: '#A0A5AA', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {t('blog.descShort')}
              </p>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
          <div 
            style={{ 
              position: 'relative', 
              display: 'inline-flex', 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '4px',
              height: '46px',
              alignItems: 'center'
            }}
          >
            <div style={getIndicatorStyle()} />
             {categories.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: windowWidth < 480 ? '76px' : '110px',
                  height: '100%',
                  border: 'none',
                  background: 'none',
                  color: activeIndex === idx ? '#1E2022' : '#A0A5AA',
                  fontWeight: 900,
                  fontSize: windowWidth < 480 ? '0.68rem' : '0.8rem',
                  letterSpacing: windowWidth < 480 ? '0.04em' : '0.08em',
                  cursor: 'pointer',
                  zIndex: 2,
                  position: 'relative',
                  transition: 'color 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  fontFamily: 'var(--font-heading)',
                  outline: 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Reel container block (with 3D tilt & holographic sheen) */}
        <div 
          onMouseMove={handleReelMouseMove}
          onMouseEnter={() => setReelHover(true)}
          onMouseLeave={handleReelMouseLeave}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '24px',
            padding: windowWidth < 480 ? '1.5rem' : '3rem',
            marginBottom: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: windowWidth < 480 ? '1.8rem' : '3rem',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.1s ease, border-color 0.3s, box-shadow 0.3s',
            borderColor: reelHover ? 'var(--accent)' : 'rgba(255, 255, 255, 0.06)',
            ...reelTilt
          }}
        >
          {/* Holographic glossy sweep line */}
          <span className="reel-card-sheen" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span 
              style={{
                backgroundColor: 'var(--accent)',
                color: '#1E2022',
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                display: 'inline-block',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {t('blog.reelBadge')}
            </span>
            
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#FDFCF7', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
              <TypewriterText text={t('blog.reelTitle')} active={isRevealed} delay={600} />
            </h3>
            
            <div className="full-text">
              <p style={{ color: '#A0A5AA', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {t('blog.reelDescFull')}
              </p>
            </div>
            <div className="short-text">
              <p style={{ color: '#A0A5AA', lineHeight: '1.5', marginBottom: '1.2rem' }}>
                {t('blog.reelDescShort')}
              </p>
            </div>
            
            <a 
              href="https://www.instagram.com/p/DX_it9uA_fo/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary btn-watch-reel" 
              onClick={handleWatchClick}
              style={{ 
                backgroundColor: 'var(--accent)', 
                color: '#1E2022', 
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(242, 183, 5, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {t('blog.btnWatch')} <InstagramIcon size={18} />
            </a>
          </div>

          {/* High-End Vector Masked Video Container */}
          <div 
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              aspectRatio: '9/16',
              maxWidth: '300px',
              width: '100%',
              margin: '0 auto',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: '#2A2D30',
              clipPath: 'inset(0% 0% 0% 0% round 30px)',
              zIndex: 2,
              transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.15s',
              ...phoneTilt
            }}
          >
            {/* The Heartbeat Synced Video */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                clipPath: 'inset(4% 4% 4% 4% round 120px)', // high-end vector capsule mask
                border: '2px solid var(--accent)', // visualize the video outline borders
                borderRadius: '120px'
              }}
            >
              {/* Fallback chain: first tries local downloaded reel, then abstract pulse stock video */}
              <source src="/reel_video.mp4" type="video/mp4" />
              <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-glow-41865-large.mp4" type="video/mp4" />
            </video>

            {/* Video overlay profile header */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.72) 100%)', // slightly darker gradient for better readability
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.5rem 1.5rem 4.5rem 2.8rem', // inset left and bottom padding to avoid curved capsule corners
                pointerEvents: 'none',
                clipPath: 'inset(4% 4% 4% 4% round 120px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: '#212224', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>P</div>
                <div style={{ fontSize: '0.8rem', color: '#FDFCF7', fontWeight: 700 }}>pulse__marketing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Post cards list */}
        <div 
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {filteredPosts.map((post, idx) => (
            <BlogCard 
              key={post.originalIndex || idx}
              post={post}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post, t }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    setIsHovered(true);
    const img = e.currentTarget.querySelector('.blog-card-image');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Rotate cards on the GPU (3D Tilt)
    const rotateX = -y * 0.08;
    const rotateY = x * 0.08;

    if (img) {
      const imgX = (e.clientX - rect.left) / rect.width - 0.5;
      const imgY = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = 'scale(1.08) translate3d(' + (imgX * 12) + 'px, ' + (imgY * 12) + 'px, 0)';
    }

    // Holographic gloss sheen position sweep based on mouse coordinates
    const sheen = e.currentTarget.querySelector('.blog-card-sheen');
    if (sheen) {
      const px = (e.clientX - rect.left) / rect.width * 100;
      sheen.style.background = `linear-gradient(${135 + px}deg, transparent 35%, rgba(242, 183, 5, 0.15) 50%, transparent 65%)`;
    }

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`,
      boxShadow: '0 20px 40px rgba(242, 183, 5, 0.12), var(--shadow-lg)',
      borderColor: 'var(--accent)',
      backgroundColor: 'rgba(255, 255, 255, 0.04)'
    });
  };

  const handleMouseLeave = (e) => {
    setIsHovered(false);
    const img = e.currentTarget.querySelector('.blog-card-image');
    if (img) {
      img.style.transform = 'scale(1) translate3d(0, 0, 0)';
    }
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      boxShadow: 'none',
      borderColor: 'rgba(255, 255, 255, 0.06)',
      backgroundColor: 'rgba(255, 255, 255, 0.02)'
    });
  };

  return (
    <div
      className="blog-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.1s ease, border-color 0.3s, box-shadow 0.3s, background-color 0.3s',
        overflow: 'hidden',
        position: 'relative',
        ...tiltStyle
      }}
    >
      {/* Holographic sweep gloss line */}
      <span className="blog-card-sheen" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div 
          style={{ 
            position: 'relative', 
            height: '180px', 
            borderRadius: '14px', 
            overflow: 'hidden', 
            marginBottom: '1.4rem' 
          }}
        >
          <img 
            className="blog-card-image"
            src={post.image}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
          <span 
            className={isHovered ? 'category-tag-pulse' : ''}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontSize: '0.7rem',
              fontWeight: 900,
              backgroundColor: post.type === 'HIRING' ? 'var(--pulse-red)' : 'var(--accent)',
              color: post.type === 'HIRING' ? '#FDFCF7' : '#1E2022',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.04em'
            }}
          >
            {post.type === 'HIRING' ? t('blog.hiring') : t('blog.collab')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#A0A5AA', marginBottom: '0.6rem' }}>
          <Calendar size={12} />
          {post.date}
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem', color: '#FDFCF7', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
          {post.title}
        </h3>
        <div className="full-text">
          <p style={{ color: '#A0A5AA', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {post.desc}
          </p>
        </div>
        <div className="short-text">
          <p style={{ color: '#A0A5AA', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.2rem' }}>
            {post.shortDesc}
          </p>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.2rem', marginTop: '0.6rem', position: 'relative', zIndex: 2 }}>
        {post.type === 'HIRING' ? (
          <a 
            href={'mailto:' + post.link + '?subject=Applying for SMM / Marketing Specialist'}
            style={{
              fontSize: '0.85rem',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-heading)'
            }}
          >
            {t('blog.btnApply')}{' '}
            <span 
              style={{
                transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                display: 'inline-block'
              }}
            >
              <ArrowRight size={15} />
            </span>
          </a>
        ) : (
          <a 
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.85rem',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-heading)'
            }}
          >
            {t('blog.btnWatch')}{' '}
            <span 
              style={{
                transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                display: 'inline-block'
              }}
            >
              <ExternalLink size={14} />
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
