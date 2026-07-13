import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { ArrowLeft, Award, Users, ShieldCheck, Heart } from 'lucide-react';

// Bio-Interactive Card Component with EKG Trace Canvas
function BioCard({ name, role, bio, image, delay }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const canvasRef = useRef(null);

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

    let animFrame;
    let x = 0;
    const speed = 2.5;
    const points = [];

    // Prepopulate flatline points
    for (let i = 0; i < canvas.width; i += speed) {
      points.push({ x: i, y: canvas.height * 0.75 });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hovered) {
        // EKG waveform generation
        x += speed;
        if (x > canvas.width) {
          x = 0;
        }

        // Calculate EKG wave height at current position
        let y = canvas.height * 0.75;
        const cycle = x % 160;

        if (cycle > 40 && cycle < 46) {
          // Downward dip
          y += 12;
        } else if (cycle >= 46 && cycle < 54) {
          // Sharp QRS peak
          y -= 48;
        } else if (cycle >= 54 && cycle < 62) {
          // Deep S dip
          y += 32;
        } else if (cycle >= 62 && cycle < 72) {
          // Small recovery bump
          y -= 10;
        }

        points.push({ x, y });
        if (points.length > canvas.width / speed) {
          points.shift();
        }

        // Draw glowing EKG path
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(217, 61, 61, 0.6)'; // Red pulse line
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(217, 61, 61, 0.8)';

        points.forEach((p, idx) => {
          if (idx === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            // Smooth connection
            ctx.lineTo(p.x, p.y);
          }
        });
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow
      }

      animFrame = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, [hovered]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const cx = e.clientX - rect.left - w / 2;
    const cy = e.clientY - rect.top - h / 2;

    const rx = -(cy / (h / 2)) * 10;
    const ry = (cx / (w / 2)) * 10;

    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: hovered ? '1px solid var(--pulse-red)' : '1px solid rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.02 : 1})`,
        transition: hovered ? 'transform 0.1s ease-out, border-color 0.3s' : 'transform 0.5s ease, border-color 0.5s',
        display: 'flex',
        flexDirection: 'column',
        height: '380px',
        boxShadow: hovered ? '0 20px 40px rgba(217, 61, 61, 0.06)' : 'none',
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`
      }}
    >
      {/* Background image / overlay */}
      <div 
        style={{
          height: '62%',
          backgroundImage: `linear-gradient(to bottom, transparent, rgba(30,32,34,0.95)), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'all 0.5s ease',
          transform: hovered ? 'scale(1.08)' : 'scale(1)'
        }}
      />

      {/* EKG pulse wave overlay */}
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

      <div style={{ padding: '1.5rem', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'flex-end' }}>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FDFCF7', marginBottom: '0.2rem' }}>{name}</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', display: 'block' }}>
          {role}
        </span>
        <p style={{ fontSize: '0.85rem', color: '#A0A5AA', lineHeight: '1.5', margin: 0 }}>
          {bio}
        </p>
      </div>
    </div>
  );
}

export default function DetailedAbout({ onGoBack }) {
  const { language, t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const localTexts = {
    hy: {
      back: 'ՀԵՏ ԴԵՊԻ ԳԼԽԱՎՈՐ',
      sub: 'ՄԵՐ ՊԱՏՄՈՒԹՅՈՒՆՆ ՈՒ ԹԻՄԸ',
      main: 'ՄԵՐ ՄԱՍԻՆ',
      team: 'ՍՏԵՂԾԱԳՈՐԾԱԿԱՆ ԶԱՐԿԵՐԱԿԸ',
      history: 'ՄԵՐ ԶԱՐԳԱՑՄԱՆ ՈՒՂԻՆ'
    },
    en: {
      back: 'BACK TO HOME',
      sub: 'OUR STORY AND TEAM',
      main: 'ABOUT US',
      team: 'CREATIVE PULSE',
      history: 'OUR DEVELOPMENT PATH'
    },
    ru: {
      back: 'НАЗАД НА ГЛАВНУЮ',
      sub: 'НАША ИСТОРИЯ И КОМАНДА',
      main: 'О НАС',
      team: 'ТВОРЧЕСКИЙ ПУЛЬС',
      history: 'НАШ ПУТЬ РАЗВИТИЯ'
    }
  }[language] || {
    back: 'BACK TO HOME',
    sub: 'OUR STORY AND TEAM',
    main: 'ABOUT US',
    team: 'CREATIVE PULSE',
    history: 'OUR DEVELOPMENT PATH'
  };

  const timelineEvents = {
    hy: [
      { year: '2021', title: 'Հիմնադրում', desc: 'Pulse Marketing-ի ծնունդը՝ նպատակ ունենալով բերել նոր շունչ և զարկերակ հայկական թվային շուկայում:' },
      { year: '2022', title: 'Առաջին հաջողությունները', desc: 'SMM և SEO առաջին խոշոր պրոյեկտների իրականացում, 50+ գոհ հաճախորդներ:' },
      { year: '2023', title: 'Թիմի ընդլայնում', desc: 'Տեխնոլոգիական վեբ մշակման բաժնի հիմնում և ինտեգրում մարքեթինգային ռազմավարությունների մեջ:' },
      { year: '2024', title: 'Միջազգային համագործակցություններ', desc: 'Արտասահմանյան առաջին հաճախորդները և AI գովազդային գործիքների լիարժեք ներդրում:' },
      { year: '2025', title: 'Շուկայի առաջատարներից մեկը', desc: '200+ ակտիվ բիզնեսների թվային զարգացման գործընկեր և կայուն աճի ապահովող:' }
    ],
    en: [
      { year: '2021', title: 'Founding', desc: 'The birth of Pulse Marketing, aiming to bring new breath and heartbeat to the Armenian digital market.' },
      { year: '2022', title: 'First Successes', desc: 'Implementation of the first major SMM and SEO projects, 50+ satisfied clients.' },
      { year: '2023', title: 'Team Expansion', desc: 'Establishment of the technological web development division and integration into marketing strategies.' },
      { year: '2024', title: 'International Collaborations', desc: 'First foreign clients and full integration of AI advertising tools.' },
      { year: '2025', title: 'One of the Market Leaders', desc: 'Digital development partner for 200+ active businesses and provider of sustainable growth.' }
    ],
    ru: [
      { year: '2021', title: 'Основание', desc: 'Рождение Pulse Marketing с целью вдохнуть новую жизнь и пульс в армянский цифровой рынок.' },
      { year: '2022', title: 'Первые Успехи', desc: 'Реализация первых крупных проектов по SMM и SEO, более 50 довольных клиентов.' },
      { year: '2023', title: 'Расширение Команды', desc: 'Основание отдела технологической веб-разработки и его интеграция в маркетинговые стратегии.' },
      { year: '2024', title: 'Международное Сотрудничество', desc: 'Первые зарубежные клиенты и полное внедрение рекламных инструментов ИИ.' },
      { year: '2025', title: 'Один из Лидеров Рынка', desc: 'Партнер по цифровому развитию для более 200 активных компаний и обеспечение устойчивого роста.' }
    ]
  }[language] || [];

  const teamMembers = {
    hy: [
      { name: 'Արամ Պողոսյան', role: 'CEO & Founder', bio: 'Մարքեթինգային ռազմավարությունների ճարտարապետ, 10+ տարվա փորձ:', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
      { name: 'Աննա Սարգսյան', role: 'Marketing Lead', bio: 'Կորպորատիվ բրենդինգի և ստեղծագործական արշավների պատասխանատու:', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
      { name: 'Դավիթ Կարապետյան', role: 'Art Director', bio: 'Վիզուալ հաղորդակցության և UI/UX լուծումների վարպետ:', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop' },
      { name: 'Լիլիթ Հարությունյան', role: 'SEO Specialist', bio: 'Որոնողական օպտիմալացման և տրաֆիկի աճի առաջատար մասնագետ:', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop' }
    ],
    en: [
      { name: 'Aram Poghosyan', role: 'CEO & Founder', bio: 'Marketing strategies architect, 10+ years of experience.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
      { name: 'Anna Sargsyan', role: 'Marketing Lead', bio: 'Responsible for corporate branding and creative campaigns.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
      { name: 'David Karapetyan', role: 'Art Director', bio: 'Master of visual communication and UI/UX solutions.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop' },
      { name: 'Lilit Harutyunyan', role: 'SEO Specialist', bio: 'Leading specialist in search optimization and traffic growth.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop' }
    ],
    ru: [
      { name: 'Арам Погосян', role: 'CEO & Founder', bio: 'Архитектор маркетинговых стратегий, более 10 лет опыта.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
      { name: 'Анна Саргсян', role: 'Marketing Lead', bio: 'Ответственная за корпоративный брендинг и креативные кампании.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
      { name: 'Давид Карапетян', role: 'Art Director', bio: 'Мастер визуальной коммуникации и решений UI/UX.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop' },
      { name: 'Лилит Арутюнян', role: 'SEO Specialist', bio: 'Ведущий специалист по поисковой оптимизации и росту трафика.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop' }
    ]
  }[language] || [];

  // Calculate EKG timeline growth height percentage
  const timelineHeight = containerRef.current ? containerRef.current.offsetHeight : 600;
  const growthProgress = Math.min(100, Math.max(0, (scrollY / timelineHeight) * 220));

  return (
    <div
      style={{
        backgroundColor: '#1E2022',
        color: '#FDFCF7',
        minHeight: '100vh',
        padding: '8rem 2rem 6rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          opacity: 0.8,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Back navigation */}
        <button
          onClick={(e) => onGoBack(e)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginBottom: '2.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0.4rem 0'
          }}
        >
          <ArrowLeft size={16} /> {localTexts.back}
        </button>

        {/* Title */}
        <div style={{ marginBottom: '5rem' }}>
          <span
            style={{
              color: 'var(--accent)',
              fontWeight: 800,
              letterSpacing: '0.2em',
              fontSize: '0.85rem',
              display: 'inline-block',
              marginBottom: '0.8rem',
              textTransform: 'uppercase'
            }}
          >
            {localTexts.sub}
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
              lineHeight: '1.2',
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: '#FDFCF7'
            }}
          >
            {localTexts.main}
          </h1>
          {/* EKG line */}
          <div style={{ width: '180px', height: '10px', marginTop: '1rem' }}>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <path d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <path className="partners-flatline-pulse active" d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="var(--accent)" strokeWidth="1.8" />
            </svg>
          </div>
        </div>

        {/* 1. Bio-Interactive Team Grid */}
        <div style={{ marginBottom: '8rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '3rem', fontFamily: 'var(--font-heading)' }}>
            {localTexts.team}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2.5rem'
            }}
          >
            {teamMembers.map((member, idx) => (
              <BioCard
                key={member.name}
                name={member.name}
                role={member.role}
                bio={member.bio}
                image={member.image}
                delay={idx * 120}
              />
            ))}
          </div>
        </div>

        {/* 2. Interactive History Path (Vertical Timeline) */}
        <div ref={containerRef} style={{ position: 'relative', paddingLeft: '3.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4rem', fontFamily: 'var(--font-heading)', marginLeft: '-3.5rem' }}>
            {localTexts.history}
          </h2>

          {/* Vertical EKG Growth Path Line */}
          <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '15px',
              width: '2px',
              height: 'calc(100% - 140px)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              zIndex: 0
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '15px',
              width: '2px',
              height: `${growthProgress}%`,
              maxHeight: 'calc(100% - 140px)',
              backgroundColor: 'var(--pulse-red)',
              boxShadow: '0 0 10px var(--pulse-red)',
              zIndex: 1,
              transition: 'height 0.1s ease-out'
            }}
          />

          {timelineEvents.map((ev, idx) => {
            // Determine active events based on scroll offset
            const activeThreshold = 80 + idx * 160;
            const isActive = scrollY > activeThreshold || idx === 0;

            return (
              <div
                key={ev.year}
                style={{
                  position: 'relative',
                  marginBottom: '4.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  zIndex: 2,
                  transition: 'opacity 0.6s ease',
                  opacity: isActive ? 1 : 0.35
                }}
              >
                {/* Timeline node bullet */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-48px',
                    top: '6px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: isActive ? 'var(--pulse-red)' : 'rgba(255, 255, 255, 0.15)',
                    backgroundColor: isActive ? 'var(--bg-primary)' : '#1E2022',
                    boxShadow: isActive ? '0 0 12px var(--pulse-red)' : 'none',
                    transition: 'all 0.4s ease'
                  }}
                />

                <span
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: isActive ? 'var(--accent)' : '#A0A5AA',
                    fontFamily: 'var(--font-heading)',
                    transition: 'color 0.4s ease'
                  }}
                >
                  {ev.year}
                </span>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FDFCF7', margin: 0 }}>
                  {ev.title}
                </h4>

                <p style={{ color: '#A0A5AA', fontSize: '0.92rem', lineHeight: '1.6', maxWidth: '600px', margin: 0 }}>
                  {ev.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
