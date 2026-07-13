import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { ArrowLeft, Landmark, Heart, Shield, Layers, HelpCircle, Briefcase } from 'lucide-react';

export default function DetailedPartners({ onGoBack }) {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const categories = ['ALL', 'TECH', 'RETAIL', 'HEALTH', 'FINANCE'];

  const localTexts = {
    hy: {
      back: 'ՀԵՏ ԴԵՊԻ ԳԼԽԱՎՈՐ',
      sub: 'ՀԱՄԱԳՈՐԾԱԿՑՈՒԹՅԱՆ ԼԱԲՈՐԱՏՈՐԻԱ',
      main: 'ԳՈՐԾԸՆԿԵՐՆԵՐ'
    },
    en: {
      back: 'BACK TO HOME',
      sub: 'PARTNERSHIP LABORATORY',
      main: 'PARTNERS'
    },
    ru: {
      back: 'НАЗАД НА ГЛАВНУЮ',
      sub: 'ЛАБОРАТОРИЯ ПАРТНЕРСТВА',
      main: 'ПАРТНЕРЫ'
    }
  }[language] || {
    back: 'BACK TO HOME',
    sub: 'PARTNERSHIP LABORATORY',
    main: 'PARTNERS'
  };

  const partnersData = {
    hy: [
      { name: 'Digitronik', desc: 'Համատեղ IoT և ամպային մարքեթինգային լուծումներ տեխնոլոգիական ստարտափների համար:', cat: 'TECH', logo: Briefcase },
      { name: 'Nova Pharma', desc: 'Առողջապահական բրենդների թվային առաջխաղացում և թիրախային արշավների մշակում:', cat: 'HEALTH', logo: Heart },
      { name: 'Armen Finance', desc: 'Ֆինանսական գրագիտության արշավներ և կորպորատիվ հաճախորդների ներգրավում:', cat: 'FINANCE', logo: Landmark },
      { name: 'Retail Hub', desc: 'Էլեկտրոնային առևտրի (E-commerce) ռազմավարությունների մշակում և վաճառքների ավտոմատացում:', cat: 'RETAIL', logo: Layers },
      { name: 'Aura Tech', desc: 'Արհեստական բանականության (AI) վրա հիմնված գովազդային արշավների ինտեգրում:', cat: 'TECH', logo: Shield },
      { name: 'Medica Center', desc: 'Կլինիկաների վեբ-ներկայացվածության և լոկալ SEO օպտիմալացման ապահովում:', cat: 'HEALTH', logo: Heart }
    ],
    en: [
      { name: 'Digitronik', desc: 'Joint IoT and cloud marketing solutions for tech startups.', cat: 'TECH', logo: Briefcase },
      { name: 'Nova Pharma', desc: 'Digital promotion and target campaign development for healthcare brands.', cat: 'HEALTH', logo: Heart },
      { name: 'Armen Finance', desc: 'Financial literacy campaigns and corporate client acquisition.', cat: 'FINANCE', logo: Landmark },
      { name: 'Retail Hub', desc: 'E-commerce strategy development and sales automation.', cat: 'RETAIL', logo: Layers },
      { name: 'Aura Tech', desc: 'Integration of advertising campaigns based on Artificial Intelligence (AI).', cat: 'TECH', logo: Shield },
      { name: 'Medica Center', desc: 'Ensuring clinic web presence and local SEO optimization.', cat: 'HEALTH', logo: Heart }
    ],
    ru: [
      { name: 'Digitronik', desc: 'Совместные IoT и облачные маркетинговые решения для технологических стартапов.', cat: 'TECH', logo: Briefcase },
      { name: 'Nova Pharma', desc: 'Цифровое продвижение и разработка целевых кампаний для брендов здравоохранения.', cat: 'HEALTH', logo: Heart },
      { name: 'Armen Finance', desc: 'Кампании по финансовой грамотности и привлечение корпоративных клиентов.', cat: 'FINANCE', logo: Landmark },
      { name: 'Retail Hub', desc: 'Разработка стратегий электронной коммерции и автоматизация продаж.', cat: 'RETAIL', logo: Layers },
      { name: 'Aura Tech', desc: 'Интеграция рекламных кампаний на базе искусственного интеллекта (ИИ).', cat: 'TECH', logo: Shield },
      { name: 'Medica Center', desc: 'Обеспечение веб-присутствия клиник и локальная поисковая оптимизация.', cat: 'HEALTH', logo: Heart }
    ]
  }[language] || [];

  const filteredPartners = activeFilter === 'ALL'
    ? partnersData
    : partnersData.filter(p => p.cat === activeFilter);

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
          backgroundSize: '28px 28px',
          opacity: 0.85,
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

        {/* Header Title */}
        <div style={{ marginBottom: '4rem' }}>
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
          {/* EKG flatline separator */}
          <div style={{ width: '180px', height: '10px', marginTop: '1rem' }}>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <path d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <path className="partners-flatline-pulse active" d="M 0 5 H 45 L 48 1 L 52 9 L 55 5 H 100" fill="none" stroke="var(--accent)" strokeWidth="1.8" />
            </svg>
          </div>
        </div>

        {/* Category Filters row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '3.5rem' }}>
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  border: isActive ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: isActive ? 'rgba(242, 183, 5, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? 'var(--accent)' : '#A0A5AA',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '30px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Laboratory Grid layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {filteredPartners.map((p, idx) => {
            const Icon = p.logo;
            return (
              <div
                key={p.name}
                className="partner-lab-card"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `fadeInUp 0.5s ease-out ${idx * 80}ms both`
                }}
              >
                {/* Brand watermark element */}
                <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.03, color: 'var(--accent)' }}>
                  <Icon size={120} />
                </div>

                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    marginBottom: '1.2rem'
                  }}
                >
                  <Icon size={22} />
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent)',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontFamily: 'var(--font-heading)'
                  }}
                >
                  {p.cat}
                </span>

                <h3
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: '#FDFCF7',
                    fontFamily: 'var(--font-heading)',
                    marginBottom: '0.8rem'
                  }}
                >
                  {p.name}
                </h3>

                <p style={{ color: '#A0A5AA', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .partner-lab-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent) !important;
          box-shadow: 0 15px 35px rgba(242, 183, 5, 0.08);
          background-color: rgba(255, 255, 255, 0.01) !important;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
