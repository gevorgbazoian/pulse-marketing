import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { ArrowLeft, Send, CheckCircle, Database, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DetailedContact({ onGoBack }) {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const localTexts = {
    hy: {
      back: 'ՀԵՏ ԴԵՊԻ ԳԼԽԱՎՈՐ',
      sub: 'ՀԱՐՑՈՒՄ ՈՒՂԱՐԿԵԼ',
      main: 'ԿԱՊ',
      name: 'Անուն',
      namePlaceholder: 'Մուտքագրեք Ձեր անունը',
      email: 'Էլ. հասցե',
      emailPlaceholder: 'Մուտքագրեք Ձեր էլ. հասցեն',
      message: 'Հաղորդագրություն',
      messagePlaceholder: 'Նկարագրեք Ձեր նախագիծը...',
      submit: 'ՈՒՂԱՐԿԵԼ ՀԱՐՑՈՒՄ',
      injecting: 'ՏՎՅԱԼՆԵՐԻ ՆԵՐԱՐԿՈՒՄ (INJECTING DATA...)',
      success: 'ՀԱՐՑՈՒՄԸ ՀԱՋՈՂՈՒԹՅԱՄԲ ՈՒՂԱՐԿՎԵԼ Է',
      successDesc: 'Շնորհակալություն մեզ հետ կապ հաստատելու համար։ Մեր թիմի մասնագետները կվերլուծեն Ձեր հարցումը և կպատասխանեն 24 ժամվա ընթացքում:',
      newSubmit: 'ՈՒՂԱՐԿԵԼ ՆՈՐ ՀԱՐՑՈՒՄ'
    },
    en: {
      back: 'BACK TO HOME',
      sub: 'SEND AN INQUIRY',
      main: 'CONTACT',
      name: 'Name',
      namePlaceholder: 'Enter your name',
      email: 'Email address',
      emailPlaceholder: 'Enter your email address',
      message: 'Message',
      messagePlaceholder: 'Describe your project...',
      submit: 'SUBMIT INQUIRY',
      injecting: 'INJECTING DATA...',
      success: 'INQUIRY SENT SUCCESSFULLY',
      successDesc: 'Thank you for contacting us. Our specialists will analyze your request and respond within 24 hours.',
      newSubmit: 'SEND NEW INQUIRY'
    },
    ru: {
      back: 'НАЗАД НА ГЛАВНУЮ',
      sub: 'ОТПРАВИТЬ ЗАПРОС',
      main: 'КОНТАКТЫ',
      name: 'Имя',
      namePlaceholder: 'Введите ваше имя',
      email: 'Эл. почта',
      emailPlaceholder: 'Введите ваш адрес эл. почты',
      message: 'Сообщение',
      messagePlaceholder: 'Опишите ваш проект...',
      submit: 'ОТПРАВИТЬ ЗАПРОС',
      injecting: 'ВНЕДРЕНИЕ ДАННЫХ (INJECTING DATA...)',
      success: 'ЗАПРОС УСПЕШНО ОТПРАВЛЕН',
      successDesc: 'Спасибо, что связались с нами. Наши специалисты проанализируют ваш запрос и ответят в течение 24 часов.',
      newSubmit: 'ОТПРАВИТЬ НОВЫЙ ЗАПРОС'
    }
  }[language] || {
    back: 'BACK TO HOME',
    sub: 'SEND AN INQUIRY',
    main: 'CONTACT',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    email: 'Email address',
    emailPlaceholder: 'Enter your email address',
    message: 'Message',
    messagePlaceholder: 'Describe your project...',
    submit: 'SUBMIT INQUIRY',
    injecting: 'INJECTING DATA...',
    success: 'INQUIRY SENT SUCCESSFULLY',
    successDesc: 'Thank you for contacting us. Our specialists will analyze your request and respond within 24 hours.',
    newSubmit: 'SEND NEW INQUIRY'
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Start EKG data injection animation
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Launch confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F2B705', '#D93D3D', '#FDFCF7']
      });
    }, 1800); // 1.8s for the data packet EKG trip
  };

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

      <div style={{ maxWidth: '650px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
        <div style={{ marginBottom: '3.5rem' }}>
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

        {/* Contact Form State Machine */}
        {!isSubmitting && !isSubmitted && (
          <form 
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.8rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              animation: 'fadeInUp 0.6s ease-out'
            }}
          >
            {/* Name Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#A0A5AA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {localTexts.name}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="pulse-glow-input"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '0.9rem 1.2rem',
                  color: '#FDFCF7',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.3s ease'
                }}
                placeholder={localTexts.namePlaceholder}
              />
            </div>

            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#A0A5AA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {localTexts.email}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pulse-glow-input"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '0.9rem 1.2rem',
                  color: '#FDFCF7',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.3s ease'
                }}
                placeholder={localTexts.emailPlaceholder}
              />
            </div>

            {/* Message Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#A0A5AA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {localTexts.message}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="pulse-glow-input"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '0.9rem 1.2rem',
                  color: '#FDFCF7',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)',
                  resize: 'none',
                  transition: 'all 0.3s ease'
                }}
                placeholder={localTexts.messagePlaceholder}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#1E2022',
                border: 'none',
                padding: '1rem',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 15px rgba(242, 183, 5, 0.25)',
                transition: 'all 0.3s ease'
              }}
            >
              {localTexts.submit} <Send size={16} />
            </button>
          </form>
        )}

        {/* EKG Data Injection Submit Animation */}
        {isSubmitting && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--accent)',
              borderRadius: '24px',
              padding: '4rem 2rem',
              gap: '2.5rem',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', maxWidth: '380px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#A0A5AA' }}>
                <FileText size={32} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>DATA PACKETS</span>
              </div>

              {/* Data Path SVG with animated Motion circles */}
              <div style={{ flexGrow: 1, height: '40px', overflow: 'visible', position: 'relative' }}>
                <svg viewBox="0 0 200 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
                  <path d="M 0 20 H 80 L 88 5 L 96 35 L 104 20 H 200" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2.5" />
                  
                  {/* Glowing gold dots injected into the EKG */}
                  <circle r="4.5" fill="var(--accent)">
                    <animateMotion dur="1s" repeatCount="indefinite" path="M 0 20 H 80 L 88 5 L 96 35 L 104 20 H 200" />
                  </circle>
                  <circle r="4.5" fill="var(--accent)">
                    <animateMotion dur="1s" begin="0.32s" repeatCount="indefinite" path="M 0 20 H 80 L 88 5 L 96 35 L 104 20 H 200" />
                  </circle>
                  <circle r="4.5" fill="var(--accent)">
                    <animateMotion dur="1s" begin="0.64s" repeatCount="indefinite" path="M 0 20 H 80 L 88 5 L 96 35 L 104 20 H 200" />
                  </circle>
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                <Database size={32} style={{ filter: 'drop-shadow(0 0 10px var(--accent))' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PULSE SERVER</span>
              </div>
            </div>

            <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.9rem', textTransform: 'uppercase', animation: 'blink 1.2s infinite' }}>
              {localTexts.injecting}
            </span>
          </div>
        )}

        {/* Success Confirmation state */}
        {isSubmitted && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '24px',
              padding: '4rem 2rem',
              gap: '1.2rem',
              textAlign: 'center',
              animation: 'fadeInUp 0.6s ease-out'
            }}
          >
            <CheckCircle size={56} color="#2ECC71" style={{ filter: 'drop-shadow(0 0 12px #2ECC71)' }} />
            
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2ECC71', fontFamily: 'var(--font-heading)' }}>
              {localTexts.success}
            </h3>
            
            <p style={{ color: '#A0A5AA', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              {localTexts.successDesc}
            </p>

            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-secondary"
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '30px',
                border: '1.5px solid var(--accent)',
                backgroundColor: 'transparent',
                color: '#FAF6F1',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {localTexts.newSubmit}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .pulse-glow-input:focus {
          outline: none;
          border-color: var(--accent) !important;
          animation: input-pulse-ripple-glow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }
        @keyframes input-pulse-ripple-glow {
          0% { box-shadow: 0 0 0 0 rgba(242, 183, 5, 0.75); }
          100% { box-shadow: 0 0 0 14px rgba(242, 183, 5, 0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
