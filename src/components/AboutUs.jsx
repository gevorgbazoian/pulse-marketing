import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Users, BookOpen, Clock, Heart } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function AboutUs() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  // States for scroll reveal & rhythmic counter countup
  const [isRevealed, setIsRevealed] = useState(false);
  const [pulseBeat, setPulseBeat] = useState(0);
  const [counterValues, setCounterValues] = useState(['0', '0-0', '0+', '0+']);

  const teamListTranslated = t('aboutUs.team') || [];
  const teamAvatars = ['KH', 'EB', 'LD', 'AM'];
  const team = teamListTranslated.map((member, index) => ({
    ...member,
    avatar: teamAvatars[index]
  }));

  // IntersectionObserver to trigger and reset reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        } else {
          setIsRevealed(false);
          setPulseBeat(0);
          setCounterValues(['0', '0-0', '0+', '0+']);
        }
      });
    }, { threshold: 0.15 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // GSAP animations for cards
  useEffect(() => {
    if (sectionRef.current) {
      const statsCards = sectionRef.current.querySelectorAll('.stat-card-float');
      const teamCards = sectionRef.current.querySelectorAll('.team-card-snap');

      if (isRevealed) {
        // Centrifugal staggered reveal for stats cards
        gsap.fromTo(statsCards,
          { scale: 0.1, opacity: 0, y: 80 },
          { scale: 1, opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'back.out(2.2)', delay: 0.2 }
        );

        // Sequential stagger reveal for team cards
        gsap.fromTo(teamCards,
          { scale: 0.1, opacity: 0, y: 100 },
          { scale: 1, opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'back.out(1.8)', delay: 0.4 }
        );
      } else {
        gsap.killTweensOf([statsCards, teamCards]);
        gsap.set([statsCards, teamCards], { scale: 0.1, opacity: 0 });
      }
    }
  }, [isRevealed, language]);

  // Rhythmic heartbeat pulse counter countup
  useEffect(() => {
    if (isRevealed && pulseBeat === 0) {
      let step = 0;
      const maxSteps = 5;
      const interval = setInterval(() => {
        step += 1;
        setPulseBeat(step);

        // Rhythmic jump ratios
        const ratios = [0, 0.2, 0.48, 0.75, 0.91, 1.0];
        const ratio = ratios[step] || 1.0;

        setCounterValues([
          Math.floor(2024 * ratio).toString(),
          `${Math.floor(11 * ratio)}-${Math.floor(50 * ratio)}`,
          `${Math.floor(100 * ratio)}+`,
          `${Math.floor(13 * ratio)}+`
        ]);

        if (step >= maxSteps) {
          clearInterval(interval);
        }
      }, 380); // Rhythmic ~160 bpm heartbeat countup steps

      return () => clearInterval(interval);
    }
  }, [isRevealed, pulseBeat]);

  const hasPulse = pulseBeat > 0 && pulseBeat < 5;

  return (
    <section 
      ref={sectionRef} 
      id="about-us" 
      data-theme="light" 
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        padding: '8rem 0'
      }}
    >
      <div className="container-pad" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Core Layout: History on Left/Top, Team on Right/Bottom */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5rem',
            marginBottom: '6rem'
          }}
        >
          {/* History Section */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center'
            }}
          >
            {/* Left Side: Vertical Lifeline Growth + Narrative */}
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'stretch' }}>
              
              {/* Vertical Lifeline Line (Scroll-triggered Cardiac Path) */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: '30px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center' 
                }}
              >
                <svg 
                  viewBox="0 0 30 350" 
                  preserveAspectRatio="none" 
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                >
                  <path 
                    d="M 15 0 V 120 L 5 130 L 25 145 L 0 155 L 30 170 L 10 180 L 15 195 V 350" 
                    fill="none" 
                    stroke="var(--border)" 
                    strokeWidth="1.5" 
                    opacity="0.3"
                  />
                  <path 
                    className={`lifeline-active-pulse ${isRevealed ? 'active' : ''}`}
                    d="M 15 0 V 120 L 5 130 L 25 145 L 0 155 L 30 170 L 10 180 L 15 195 V 350" 
                    fill="none" 
                    stroke="var(--pulse-red)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Narrative Content */}
              <div style={{ flex: 1 }}>
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
                  <BookOpen size={16} />
                  <span>{t('aboutUs.badgeHistory')}</span>
                </div>
                
                <h2 
                  ref={titleRef}
                  style={{ 
                    fontSize: 'clamp(1.8rem, 4.5vw, 2.5rem)', 
                    marginBottom: '1.5rem', 
                    fontFamily: 'var(--font-heading)', 
                    lineHeight: '1.2' 
                  }}
                >
                  {t('aboutUs.titleHistory')}
                </h2>
                
                {/* Responsive Text with Radar Scanning Sweep Reveal */}
                <div className="full-text" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <p 
                      className={`radar-scan-text ${isRevealed ? 'scanned' : ''}`}
                      style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '1.05rem', 
                        lineHeight: '1.7',
                        margin: 0
                      }}
                    >
                      {t('aboutUs.descHistoryFull1')}
                    </p>
                    <div className={`radar-scan-bar ${isRevealed ? 'active' : ''}`} style={{ animationDelay: '0.2s' }} />
                  </div>
                  
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <p 
                      className={`radar-scan-text ${isRevealed ? 'scanned' : ''}`}
                      style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '1.05rem', 
                        lineHeight: '1.7',
                        margin: 0,
                        transitionDelay: '0.4s'
                      }}
                    >
                      {t('aboutUs.descHistoryFull2')}
                    </p>
                    <div className={`radar-scan-bar ${isRevealed ? 'active' : ''}`} style={{ animationDelay: '0.6s' }} />
                  </div>
                </div>

                <div className="short-text" style={{ position: 'relative', overflow: 'hidden' }}>
                  <p 
                    className={`radar-scan-text ${isRevealed ? 'scanned' : ''}`}
                    style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}
                  >
                    {t('aboutUs.descHistoryShort')}
                  </p>
                  <div className={`radar-scan-bar ${isRevealed ? 'active' : ''}`} style={{ animationDelay: '0.3s' }} />
                </div>
              </div>

            </div>

            {/* Right Side: Quick Achievements Grid (Floating loop + hover halo glow) */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}
            >
              <div className={`stat-card-float ${hasPulse ? 'stat-card-pulse-active' : ''}`} style={statCardStyle}>
                <Clock className="stat-card-icon" size={24} color="var(--accent)" style={{ transition: 'transform 0.3s ease' }} />
                <div style={statNumberStyle}>{counterValues[0]}</div>
                <div style={statLabelStyle}>{t('aboutUs.statGrowth')}</div>
              </div>
              <div className={`stat-card-float ${hasPulse ? 'stat-card-pulse-active' : ''}`} style={statCardStyle}>
                <Users className="stat-card-icon" size={24} color="var(--accent)" style={{ transition: 'transform 0.3s ease' }} />
                <div style={statNumberStyle}>{counterValues[1]}</div>
                <div style={statLabelStyle}>{t('aboutUs.statTeam')}</div>
              </div>
              <div className={`stat-card-float ${hasPulse ? 'stat-card-pulse-active' : ''}`} style={statCardStyle}>
                <Heart className="stat-card-icon" size={24} color="var(--accent)" style={{ transition: 'transform 0.3s ease' }} />
                <div style={statNumberStyle}>{counterValues[2]}</div>
                <div style={statLabelStyle}>{t('aboutUs.statClients')}</div>
              </div>
              <div className={`stat-card-float ${hasPulse ? 'stat-card-pulse-active' : ''}`} style={statCardStyle}>
                <Users className="stat-card-icon" size={24} color="var(--accent)" style={{ transition: 'transform 0.3s ease' }} />
                <div style={statNumberStyle}>{counterValues[3]}</div>
                <div style={statLabelStyle}>{t('aboutUs.statInt')}</div>
              </div>
            </div>
          </div>

          {/* Team Section (Neural connection web + hover effects) */}
          <div style={{ position: 'relative', marginTop: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 2 }}>
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
                <Users size={16} />
                <span>{t('aboutUs.badgeTeam')}</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>
                {t('aboutUs.titleTeam')}
              </h2>
            </div>

            {/* Background Synergy Connection Web (Desktop Only) */}
            <div 
              className="desktop-only-connection-web"
              style={{ 
                position: 'absolute', 
                top: '32%', 
                left: 0, 
                width: '100%', 
                height: '180px', 
                zIndex: 0, 
                pointerEvents: 'none',
                overflow: 'visible'
              }}
            >
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <path
                  d="M 125 50 Q 250 10 375 50 Q 500 90 625 50 Q 750 10 875 50"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="1.2"
                  opacity="0.25"
                />
                <path
                  className={`team-connection-path ${isRevealed ? 'active' : ''}`}
                  d="M 125 50 Q 250 10 375 50 Q 500 90 625 50 Q 750 10 875 50"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Team grid */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '2rem',
                position: 'relative',
                zIndex: 2
              }}
            >
              {team.map((member, idx) => (
                <div 
                  key={idx}
                  className="team-card-snap"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '2.5rem 1.8rem',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    opacity: 0, // Animated Centrifugally
                    transition: 'border-color 0.4s, box-shadow 0.4s, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                >
                  {/* Visual avatar initials (spins smoothly on card hover) */}
                  <div 
                    className="team-avatar-wrapper"
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      fontFamily: 'var(--font-heading)',
                      border: '3px solid var(--accent)'
                    }}
                  >
                    {member.avatar}
                  </div>
                  
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {member.name}
                  </h3>
                  
                  <div 
                    style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      color: 'var(--accent)', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em'
                    }}
                  >
                    {member.role}
                  </div>

                  {/* Dynamic Cardiogram Heartbeat Diagram (Draws on hover) */}
                  <div style={{ height: '14px', width: '100px', margin: '0.4rem auto 1rem', position: 'relative', overflow: 'visible' }}>
                    <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <path d="M 0 10 H 40 L 45 2 L 55 18 L 60 10 H 100" fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.35" />
                      <path 
                        className="team-role-flatline"
                        d="M 0 10 H 40 L 45 2 L 55 18 L 60 10 H 100" 
                        fill="none" 
                        stroke="var(--accent)" 
                        strokeWidth="1.8" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  
                  {/* Responsive text */}
                  <div className="full-text">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

const statCardStyle = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '1.8rem clamp(0.5rem, 1.8vw, 1.2rem)',
  boxShadow: 'var(--shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  opacity: 0, // Animated Centrifugally
  transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
};

const statNumberStyle = {
  fontSize: 'clamp(1.35rem, 4.8vw, 1.8rem)',
  fontWeight: 900,
  marginTop: '0.5rem',
  fontFamily: 'var(--font-heading)',
  color: 'var(--text-primary)'
};

const statLabelStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  fontWeight: 600,
  marginTop: '0.2rem'
};
