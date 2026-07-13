import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { ArrowLeft, Cpu, Target, Globe, PenTool, BarChart3, Settings } from 'lucide-react';

// X-Ray Scan Canvas Card Component
function XRayCard({ title, desc, icon: Icon, delay }) {
  const [hovered, setHovered] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
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

    // Initial 40 particles for scanner field
    const particles = [];
    const colors = ['rgba(242, 183, 5, 0.45)', 'rgba(217, 61, 61, 0.4)']; // gold and red

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2.5 + 1.2,
        color: colors[i % 2]
      });
    }

    let animFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hovered) {
        // Draw grid scan line helper overlay
        ctx.strokeStyle = 'rgba(242, 183, 5, 0.05)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        particles.forEach((p) => {
          // Physics: Attract to cursor slightly
          const dx = mouseCoords.x - p.x;
          const dy = mouseCoords.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            p.vx += (dx / dist) * force * 0.15;
            p.vy += (dy / dist) * force * 0.15;
          }

          p.vx *= 0.92;
          p.vy *= 0.92;

          p.x += p.vx;
          p.y += p.vy;

          // Wrap boundaries
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          // Draw particles
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby particles with thin lines
          particles.forEach((p2) => {
            const cdx = p.x - p2.x;
            const cdy = p.y - p2.y;
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cdist < 45) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(242, 183, 5, ${0.12 * (1 - cdist / 45)})`;
              ctx.lineWidth = 0.3;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          });
        });
      }

      animFrame = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, [hovered, mouseCoords]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        backgroundColor: hovered ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.03)',
        border: hovered ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 15px 35px rgba(242, 183, 5, 0.08)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`
      }}
    >
      {/* Background X-Ray Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon box with glowing base */}
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            backgroundColor: hovered ? 'rgba(242, 183, 5, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            border: hovered ? '1.5px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hovered ? 'var(--accent)' : '#A0A5AA',
            marginBottom: '0.8rem',
            transition: 'all 0.3s ease'
          }}
        >
          <Icon size={26} />
        </div>

        <h3
          style={{
            fontSize: '1.35rem',
            color: hovered ? 'var(--accent)' : '#FDFCF7',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            marginBottom: '0.6rem',
            transition: 'color 0.3s ease'
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '0.92rem',
            color: '#A0A5AA',
            lineHeight: '1.6'
          }}
        >
          {desc}
        </p>

        {/* Blueprint Scanning grid border */}
        {hovered && (
          <span 
            className="xray-grid-scanner-line"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              animation: 'xray-scan-loop 2s linear infinite'
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function DetailedServices({ onGoBack }) {
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const localTexts = {
    hy: {
      back: 'ՀԵՏ ԴԵՊԻ ԳԼԽԱՎՈՐ',
      sub: 'ՄԵՐ ՄԱՍՆԱԳԻՏԱՑՈՒՄԸ',
      main: 'ԾԱՌԱՅՈՒԹՅՈՒՆՆԵՐ'
    },
    en: {
      back: 'BACK TO HOME',
      sub: 'OUR SPECIALIZATION',
      main: 'SERVICES'
    },
    ru: {
      back: 'НАЗАД НА ГЛАВНУЮ',
      sub: 'НАША СПЕЦИАЛИЗАЦИЯ',
      main: 'УСЛУГИ'
    }
  }[language] || {
    back: 'BACK TO HOME',
    sub: 'OUR SPECIALIZATION',
    main: 'SERVICES'
  };

  const servicesData = {
    hy: [
      { title: 'Թվային Ռազմավարություն', desc: 'Համակողմանի մարքեթինգային ռազմավարությունների մշակում՝ ուղղված բիզնեսի աճին և ճանաչելիության բարձրացմանը:', icon: Target },
      { title: 'Սոցիալական Մեդիա Մարքեթինգ (SMM)', desc: 'Բրենդի ստեղծագործական ներկայացում սոցիալական հարթակներում, թարգեթավորված գովազդներ և լսարանի ներգրավում:', icon: Cpu },
      { title: 'Որոնողական Օպտիմալացում (SEO)', desc: 'Կայքի տեսանելիության բարձրացում Google որոնողական համակարգում, որակյալ տրաֆիկի ապահովում և առաջատար դիրքեր:', icon: Globe },
      { title: 'Բրենդինգ և Դիզայն', desc: 'Լոգոների, կորպորատիվ ոճի ստեղծում, վիզուալ հաղորդակցություն և UI/UX լուծումներ:', icon: PenTool },
      { title: 'Կոնտեքստային Գովազդ (PPC)', desc: 'Google Ads, Yandex Direct արդյունավետ գովազդային արշավների ստեղծում և կոնվերսիաների աճ:', icon: BarChart3 },
      { title: 'Վեբ Մշակում', desc: 'Ժամանակակից, արագագործ և ադապտիվ վեբ կայքերի ստեղծում՝ բիզնեսի լիարժեք ներկայացման համար:', icon: Settings }
    ],
    en: [
      { title: 'Digital Strategy', desc: 'Development of comprehensive marketing strategies aimed at business growth and brand awareness.', icon: Target },
      { title: 'Social Media Marketing (SMM)', desc: 'Creative brand representation on social platforms, targeted advertising, and audience engagement.', icon: Cpu },
      { title: 'Search Engine Optimization (SEO)', desc: 'Increasing website visibility in Google search engine, providing quality traffic, and top positions.', icon: Globe },
      { title: 'Branding & Design', desc: 'Creation of logos, corporate style, visual communication, and UI/UX solutions.', icon: PenTool },
      { title: 'Contextual Advertising (PPC)', desc: 'Creation of effective advertising campaigns on Google Ads, Yandex Direct, and conversion growth.', icon: BarChart3 },
      { title: 'Web Development', desc: 'Creation of modern, fast, and responsive websites for full business representation.', icon: Settings }
    ],
    ru: [
      { title: 'Цифровая Стратегия', desc: 'Разработка комплексных маркетинговых стратегий, направленных на рост бизнеса и узнаваемость бренда.', icon: Target },
      { title: 'Маркетинг в Соцсетях (SMM)', desc: 'Креативное представление бренда на социальных платформах, таргетированная реклама и вовлечение аудитории.', icon: Cpu },
      { title: 'Поисковая Оптимизация (SEO)', desc: 'Повышение видимости сайта в поисковой системе Google, обеспечение качественного трафика и лидирующих позиций.', icon: Globe },
      { title: 'Брендинг и Дизайн', desc: 'Создание логотипов, фирменного стиля, визуальных коммуникаций и решений UI/UX.', icon: PenTool },
      { title: 'Контекстная Реклама (PPC)', desc: 'Создание эффективных рекламных кампаний в Google Ads, Яндекс Директ и рост конверсий.', icon: BarChart3 },
      { title: 'Веб-Разработка', desc: 'Создание современных, быстрых и адаптивных веб-сайтов для полноценного представления бизнеса.', icon: Settings }
    ]
  }[language] || [];

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
      {/* Background blueprint grid styling */}
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
        {/* Back navigation handle */}
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

        {/* Header Title with scanning blueprint overlay */}
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
          {/* EKG line under header */}
          <div style={{ width: '180px', height: '10px', marginTop: '1rem' }}>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <path d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <path className="partners-flatline-pulse active" d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="var(--accent)" strokeWidth="1.8" />
            </svg>
          </div>
        </div>

        {/* Blueprint Grid layout */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.2rem',
            position: 'relative'
          }}
        >
          {servicesData.map((service, idx) => (
            <XRayCard
              key={idx}
              title={service.title}
              desc={service.desc}
              icon={service.icon}
              delay={idx * 100}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes xray-scan-loop {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
