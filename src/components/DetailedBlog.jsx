import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { ArrowLeft, Calendar, ArrowRight, Eye } from 'lucide-react';

// Hologram Grid Card component with Liquid Particle Canvas on hover
function HologramCard({ title, date, views, desc, image, delay }) {
  const { language } = useLanguage();
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

    const particles = [];
    const colors = ['rgba(242, 183, 5, 0.4)', 'rgba(217, 61, 61, 0.3)'];

    for (let i = 0; i < 24; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 3 + 1,
        color: colors[i % 2],
        orbit: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.01
      });
    }

    let animFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hovered) {
        particles.forEach((p) => {
          p.orbit += p.speed;
          p.vx += Math.cos(p.orbit) * 0.08;
          p.vy += Math.sin(p.orbit) * 0.08;

          // Mouse push repulsion
          const dx = mouseCoords.x - p.x;
          const dy = mouseCoords.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const force = (80 - dist) / 80;
            p.vx -= (dx / dist) * force * 0.25; // repel from cursor
            p.vy -= (dy / dist) * force * 0.25;
          }

          p.vx *= 0.9;
          p.vy *= 0.9;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
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
        border: hovered ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 15px 35px rgba(242, 183, 5, 0.06)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '400px',
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`
      }}
    >
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

      <div 
        style={{ 
          height: '50%', 
          backgroundImage: `url(${image})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          transition: 'transform 0.5s ease',
          transform: hovered ? 'scale(1.05)' : 'scale(1)'
        }} 
      />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#A0A5AA', marginBottom: '0.6rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={12} /> {date}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Eye size={12} /> {views}
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: hovered ? 'var(--accent)' : '#FDFCF7',
            fontFamily: 'var(--font-heading)',
            lineHeight: '1.4',
            marginBottom: '0.6rem',
            transition: 'color 0.3s ease'
          }}
        >
          {title}
        </h3>

        <p style={{ fontSize: '0.85rem', color: '#A0A5AA', lineHeight: '1.5', margin: 0, flexGrow: 1 }}>
          {desc}
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginTop: '1rem', letterSpacing: '0.05em' }}>
          {language === 'hy' ? 'ԿԱՐԴԱԼ ԱՎԵԼԻՆ' : language === 'ru' ? 'Читать далее' : 'Read More'} <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}

export default function DetailedBlog({ onGoBack }) {
  const { language, t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const localTexts = {
    hy: {
      back: 'ՀԵՏ ԴԵՊԻ ԳԼԽԱՎՈՐ',
      sub: 'ՄԱՐՔԵԹԻՆԳԱՅԻՆ ԲԼՈԳ',
      main: 'ԲԼՈԳ'
    },
    en: {
      back: 'BACK TO HOME',
      sub: 'MARKETING BLOG',
      main: 'BLOG'
    },
    ru: {
      back: 'НАЗАД НА ГЛАВНУЮ',
      sub: 'МАРКЕТИНГОВЫЙ БЛОГ',
      main: 'БЛОГ'
    }
  }[language] || {
    back: 'BACK TO HOME',
    sub: 'MARKETING BLOG',
    main: 'BLOG'
  };

  const blogPosts = {
    hy: [
      { title: 'SMM առաջխաղացման 5 գաղտնիքներ 2026 թվականին', date: '10.05.2026', views: '1.2k', desc: 'Իմացեք թե ինչպես բարձրացնել օրգանիկ ներգրավվածությունը սոցիալական հարթակներում:', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop' },
      { title: 'Ինչպես SEO-ն կարող է փրկել ձեր բիզնեսը գովազդային ծախսերից', date: '04.04.2026', views: '980', desc: 'Օրգանիկ որոնման առավելություններն ու առաջին հորիզոնականներին հասնելու քայլերը:', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop' },
      { title: 'UI/UX դիզայնի ազդեցությունը առցանց խանութների կոնվերսիայի վրա', date: '18.03.2026', views: '2.4k', desc: 'Ինչպես ճիշտ վիզուալ կառուցվածքը կարող է 3 անգամ մեծացնել վաճառքների ծավալը:', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop' },
      { title: 'AI գործիքների կիրառումը մարքեթինգային արշավների ավտոմատացման մեջ', date: '22.02.2026', views: '1.5k', desc: 'Ինչպես ստեղծել անհատականացված արշավներ ավելի քիչ ռեսուրսներով:', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop' }
    ],
    en: [
      { title: '5 Secrets of SMM Promotion in 2026', date: '10.05.2026', views: '1.2k', desc: 'Learn how to increase organic engagement on social media platforms.', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop' },
      { title: 'How SEO Can Save Your Business from Advertising Costs', date: '04.04.2026', views: '980', desc: 'Benefits of organic search and steps to reach the first positions.', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop' },
      { title: 'Impact of UI/UX Design on E-commerce Store Conversion', date: '18.03.2026', views: '2.4k', desc: 'How the right visual structure can triple your sales volume.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop' },
      { title: 'Application of AI Tools in Marketing Campaign Automation', date: '22.02.2026', views: '1.5k', desc: 'How to create personalized campaigns with fewer resources.', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop' }
    ],
    ru: [
      { title: '5 Секретов Продвижения SMM в 2026 Году', date: '10.05.2026', views: '1.2k', desc: 'Узнайте, как повысить органическую вовлеченность в социальных сетях.', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop' },
      { title: 'Как SEO Может Спасти Ваш Бизнес от Затрат на Рекламу', date: '04.04.2026', views: '980', desc: 'Преимущества органического поиска и шаги для выхода на первые позиции.', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop' },
      { title: 'Влияние Дизайна UI/UX на Конверсию Интернет-Магазинов', date: '18.03.2026', views: '2.4k', desc: 'Как правильная визуальная структура может увеличить продажи в 3 раза.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop' },
      { title: 'Применение Инструментов ИИ в Автоматизации Маркетинговых Кампаний', date: '22.02.2026', views: '1.5k', desc: 'Как создавать персонализированные кампании с меньшим количеством ресурсов.', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop' }
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
      {/* 1. Reading Progress Bar (EKG theme) */}
      <div
        style={{
          position: 'fixed',
          top: '68px', // just below scrolled header
          left: 0,
          width: '100%',
          height: '3px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1001,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${scrollProgress}%`,
            backgroundColor: 'var(--accent)',
            boxShadow: '0 0 10px var(--accent), 0 0 20px var(--accent)',
            transition: 'width 0.1s ease-out'
          }}
        />
      </div>

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
          {/* EKG Divider line */}
          <div style={{ width: '180px', height: '10px', marginTop: '1rem' }}>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <path d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <path className="partners-flatline-pulse active" d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="var(--accent)" strokeWidth="1.8" />
            </svg>
          </div>
        </div>

        {/* Hologram Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}
        >
          {blogPosts.map((post, idx) => (
            <HologramCard
              key={post.title}
              title={post.title}
              date={post.date}
              views={post.views}
              desc={post.desc}
              image={post.image}
              delay={idx * 120}
            />
          ))}
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
