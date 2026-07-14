import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { ArrowLeft, TrendingUp, Users, ShoppingCart, Award, ExternalLink } from 'lucide-react';

// Heartbeat count-up counter component
function VitalCounter({ targetValue, suffix = '', label, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Elastic overshoot and settle ease curve
      let easedProgress;
      if (progress < 1) {
        // overshoot up to ~1.12, then settle back to 1.0
        const p = progress;
        easedProgress = p < 0.7 
          ? (p / 0.7) * 1.12 
          : 1.12 - ((p - 0.7) / 0.3) * 0.12;
      } else {
        easedProgress = 1;
      }
      
      const val = Math.floor(easedProgress * targetValue);
      setCount(val);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(targetValue);
        // Trigger heartbeat thump
        setPulse(true);
      }
    };
    window.requestAnimationFrame(step);
  }, [targetValue, duration]);

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* Heartbeat pulse rings that pop when counting completes */}
      {pulse && (
        <>
          <span className="vital-pulse-ring ring-1" />
          <span className="vital-pulse-ring ring-2" />
        </>
      )}

      <div
        className={pulse ? 'vital-number-thump' : ''}
        style={{
          fontSize: '3rem',
          fontWeight: 900,
          color: 'var(--accent)',
          fontFamily: 'var(--font-heading)',
          lineHeight: '1',
          marginBottom: '0.6rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        {suffix === '+' ? `${count.toLocaleString()}+` : `${suffix}${count.toLocaleString()}`}
      </div>

      <div
        style={{
          fontSize: '0.9rem',
          color: '#A0A5AA',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1
        }}
      >
        {label}
      </div>
    </div>
  );
}

// Kinetic 3D Depth Parallax Case Card Component
function KineticCard({ title, client, category, image, stats, delay }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 0, py: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const x = e.clientX - rect.left - w / 2;
    const y = e.clientY - rect.top - h / 2;

    // 3D rotation angles
    const rx = -(y / (h / 2)) * 14;
    const ry = (x / (w / 2)) * 14;

    // Inner layer translation (opposite offsets for depth)
    const px = (x / (w / 2)) * 12;
    const py = (y / (h / 2)) * 12;

    setTilt({ rx, ry, px, py });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0, px: 0, py: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: '24px',
        height: '420px',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.02 : 1})`,
        boxShadow: hovered ? '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(242, 183, 5, 0.1)' : '0 10px 30px rgba(0,0,0,0.2)',
        transition: hovered ? 'transform 0.1s ease-out, box-shadow 0.3s' : 'transform 0.5s ease, box-shadow 0.5s',
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`
      }}
    >
      {/* Background Parallax Image Layer */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '120%',
          height: '120%',
          backgroundImage: `linear-gradient(to bottom, rgba(30, 32, 34, 0.1) 40%, rgba(30, 32, 34, 0.95) 90%), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate3d(${-tilt.px}px, ${-tilt.py}px, 0)`,
          transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.6s ease'
        }}
      />

      {/* Glossy sheen reflection sweep */}
      {hovered && (
        <span 
          className="sheen-sweep"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.12) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'sheen-sweep-loop 1.2s infinite'
          }}
        />
      )}

      {/* Content Layer (translated in opposite direction to create massive depth separation) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '2.5rem',
          zIndex: 2,
          transform: `translate3d(${tilt.px * 0.8}px, ${tilt.py * 0.8}px, 0)`,
          transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.6s ease'
        }}
      >
        <span
          style={{
            backgroundColor: 'var(--accent)',
            color: '#1E2022',
            padding: '0.3rem 0.8rem',
            borderRadius: '50px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-heading)',
            display: 'inline-block',
            marginBottom: '0.8rem'
          }}
        >
          {category}
        </span>

        <span style={{ display: 'block', fontSize: '0.85rem', color: '#A0A5AA', fontWeight: 600, marginBottom: '0.3rem' }}>
          {client}
        </span>

        <h3
          style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            color: '#FDFCF7',
            fontFamily: 'var(--font-heading)',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}
        >
          {title}
        </h3>

        {/* Dynamic highlights / results stats */}
        <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          {stats.map((stat, sIdx) => (
            <div key={sIdx}>
              <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '1.1rem' }}>{stat.val}</div>
              <div style={{ color: '#A0A5AA', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DetailedResults({ onGoBack }) {
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const localTexts = {
    hy: {
      back: 'ՀԵՏ ԴԵՊԻ ԳԼԽԱՎՈՐ',
      sub: 'ԱՐԴՅՈՒՆԱՎԵՏՈՒԹՅԱՆ ՑՈՒՑԱՆԻՇՆԵՐ',
      main: 'ՄԵՐ ԱՇԽԱՏԱՆՔՆԵՐԸ',
      showroom: 'Performance Showroom'
    },
    en: {
      back: 'BACK TO HOME',
      sub: 'PERFORMANCE INDICATORS',
      main: 'OUR WORKS',
      showroom: 'Performance Showroom'
    },
    ru: {
      back: 'НАЗАД НА ГЛАВНУЮ',
      sub: 'ПОКАЗАТЕЛИ ЭФФЕКТИВНОСТИ',
      main: 'НАШИ РАБОТЫ',
      showroom: 'Performance Showroom'
    }
  }[language] || {
    back: 'BACK TO HOME',
    sub: 'PERFORMANCE INDICATORS',
    main: 'OUR WORKS',
    showroom: 'Performance Showroom'
  };

  const counters = {
    hy: [
      { targetValue: 380, suffix: '+', label: 'Օգտատերերի Աճ' },
      { targetValue: 2400000, suffix: '', label: 'Ընդհանուր Դիտումներ' },
      { targetValue: 145, suffix: '+', label: 'Վաճառքների Աճ' },
      { targetValue: 1200, suffix: '+', label: 'Գեներացված Լիդեր' }
    ],
    en: [
      { targetValue: 380, suffix: '+', label: 'User Growth' },
      { targetValue: 2400000, suffix: '', label: 'Total Views' },
      { targetValue: 145, suffix: '+', label: 'Sales Growth' },
      { targetValue: 1200, suffix: '+', label: 'Generated Leads' }
    ],
    ru: [
      { targetValue: 380, suffix: '+', label: 'Рост Пользователей' },
      { targetValue: 2400000, suffix: '', label: 'Всего Просмотров' },
      { targetValue: 145, suffix: '+', label: 'Рост Продаж' },
      { targetValue: 1200, suffix: '+', label: 'Генерированные Лиды' }
    ]
  }[language] || [];

  const casesData = {
    hy: [
      {
        title: 'Առցանց Խանութի Վաճառքների 4x Աճ SMM-ի միջոցով',
        client: 'Boutique Armenia',
        category: 'SMM & Targeting',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '+380%', label: 'Վաճառքներ' },
          { val: '2.4M', label: 'Դիտումներ' }
        ]
      },
      {
        title: 'Google որոնման առաջին հորիզոնականներ SEO օպտիմալացմամբ',
        client: 'DentCare Clinic',
        category: 'SEO Optimization',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '#1 Position', label: 'Google Որոնում' },
          { val: '+145%', label: 'Լիդեր' }
        ]
      },
      {
        title: 'Բրենդի ճանաչելիության բարձրացում և կորպորատիվ ոճի մշակում',
        client: 'EcoFuel Armenia',
        category: 'Branding & Design',
        image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '100%', label: 'Վիզուալ Ռեդիզայն' },
          { val: '150k+', label: 'Օրգանիկ Տիրույթ' }
        ]
      },
      {
        title: 'Lead Generation արշավներ ռեալթորական ընկերության համար',
        client: 'Elite Home',
        category: 'PPC Advertising',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '1,200+', label: 'Որակավորված Լիդեր' },
          { val: '-30%', label: 'Արժեքը մեկ լիդի համար' }
        ]
      }
    ],
    en: [
      {
        title: '4x Growth in E-commerce Store Sales via SMM',
        client: 'Boutique Armenia',
        category: 'SMM & Targeting',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '+380%', label: 'Sales' },
          { val: '2.4M', label: 'Impressions' }
        ]
      },
      {
        title: 'Top Google Search Positions via SEO Optimization',
        client: 'DentCare Clinic',
        category: 'SEO Optimization',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '#1 Position', label: 'Google Search' },
          { val: '+145%', label: 'Leads' }
        ]
      },
      {
        title: 'Increasing Brand Awareness and Corporate Identity Development',
        client: 'EcoFuel Armenia',
        category: 'Branding & Design',
        image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '100%', label: 'Visual Redesign' },
          { val: '150k+', label: 'Organic Reach' }
        ]
      },
      {
        title: 'Lead Generation Campaigns for Real Estate Company',
        client: 'Elite Home',
        category: 'PPC Advertising',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '1,200+', label: 'Qualified Leads' },
          { val: '-30%', label: 'Cost Per Lead' }
        ]
      }
    ],
    ru: [
      {
        title: 'Четырехкратный рост продаж интернет-магазина с помощью SMM',
        client: 'Boutique Armenia',
        category: 'SMM & Targeting',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '+380%', label: 'Продажи' },
          { val: '2.4M', label: 'Показы' }
        ]
      },
      {
        title: 'Первые позиции в поиске Google благодаря SEO-оптимизации',
        client: 'DentCare Clinic',
        category: 'SEO Optimization',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '#1 Position', label: 'Поиск Google' },
          { val: '#145%', label: 'Лиды' }
        ]
      },
      {
        title: 'Повышение узнаваемости бренда и разработка фирменного стиля',
        client: 'EcoFuel Armenia',
        category: 'Branding & Design',
        image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '100%', label: 'Визуальный Редизайн' },
          { val: '150k+', label: 'Органический Охват' }
        ]
      },
      {
        title: 'Кампании лидогенерации для риелторской компании',
        client: 'Elite Home',
        category: 'PPC Advertising',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
        stats: [
          { val: '1,200+', label: 'Качественные лиды' },
          { val: '-30%', label: 'Стоимость за лид' }
        ]
      }
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
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          opacity: 0.7,
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
        <div style={{ marginBottom: '4.5rem' }}>
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

        {/* 1. Vitality Counters Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '6rem'
          }}
        >
          {counters.map((cnt, idx) => (
            <VitalCounter
              key={idx}
              targetValue={cnt.targetValue}
              suffix={cnt.suffix}
              label={cnt.label}
            />
          ))}
        </div>

        {/* 2. Kinetic Showroom Grid */}
        <div style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '1.75rem',
              color: '#FDFCF7',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '2.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              paddingBottom: '1rem'
            }}
          >
            {localTexts.showroom}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '2.5rem'
            }}
          >
            {casesData.map((c, idx) => (
              <KineticCard
                key={idx}
                title={c.title}
                client={c.client}
                category={c.category}
                image={c.image}
                stats={c.stats}
                delay={idx * 150}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .vital-pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1.5px solid var(--accent);
          pointer-events: none;
          z-index: 0;
          opacity: 0;
        }
        .vital-pulse-ring.ring-1 {
          animation: vital-ring-ripple 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .vital-pulse-ring.ring-2 {
          animation: vital-ring-ripple 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
        }
        @keyframes vital-ring-ripple {
          0% { width: 80px; height: 80px; opacity: 0.6; }
          100% { width: 220px; height: 220px; opacity: 0; }
        }
        .vital-number-thump {
          animation: vital-number-scale 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
        }
        @keyframes vital-number-scale {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); text-shadow: 0 0 15px var(--accent); }
          100% { transform: scale(1); }
        }
        @keyframes sheen-sweep-loop {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
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
        @media(max-width: 480px) {
          div[style*="gridTemplateColumns: repeat(auto-fit, minmax(360px, 1fr))"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
