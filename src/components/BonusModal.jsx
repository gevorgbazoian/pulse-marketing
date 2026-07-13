import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../LanguageContext';

export default function BonusModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Welcome, 2: Q1, 3: Q2, 4: Q3, 5: Score
  const [answers, setAnswers] = useState({ smm: '', design: '', ads: '' });
  const [emailInput, setEmailInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F2B705', '#212224', '#D93D3D']
    });
  };

  const calculateScore = () => {
    let score = 0;
    
    if (answers.smm === 'none') score += 10;
    else if (answers.smm === 'sometimes') score += 20;
    else if (answers.smm === 'pro') score += 35;

    if (answers.design === 'urgent') score += 10;
    else if (answers.design === 'ok') score += 20;
    else if (answers.design === 'love') score += 30;

    if (answers.ads === 'none') score += 10;
    else if (answers.ads === 'poor') score += 20;
    else if (answers.ads === 'good') score += 35;

    return score;
  };

  const handleNextStep = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    const nextStep = step + 1;
    setStep(nextStep);
    
    if (nextStep === 5) {
      setTimeout(() => {
        triggerConfetti();
      }, 300);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmitted(true);
    triggerConfetti();
  };

  const score = calculateScore();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(33, 34, 36, 0.45)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={22} />
        </button>

        {/* Modal Content */}
        <div style={{ padding: '2.5rem 2rem' }}>
          
          {/* STEP 1: WELCOME SCREEN */}
          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 8px 20px rgba(242, 183, 5, 0.3)'
                }}
              >
                <Sparkles size={32} color="#212224" />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{t('audit.welcomeTitle')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                {t('audit.welcomeDesc')}
              </p>
              <button 
                onClick={() => setStep(2)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {t('audit.btnStart')} <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: SMM QUESTION */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{t('audit.step1')}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('audit.q1Title')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button 
                  onClick={() => handleNextStep('smm', 'none')}
                  style={optionStyle}
                >
                  🔴 {t('audit.q1o1')}
                </button>
                <button 
                  onClick={() => handleNextStep('smm', 'sometimes')}
                  style={optionStyle}
                >
                  🟡 {t('audit.q1o2')}
                </button>
                <button 
                  onClick={() => handleNextStep('smm', 'pro')}
                  style={optionStyle}
                >
                  🟢 {t('audit.q1o3')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DESIGN QUESTION */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{t('audit.step2')}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('audit.q2Title')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button 
                  onClick={() => handleNextStep('design', 'urgent')}
                  style={optionStyle}
                >
                  🔴 {t('audit.q2o1')}
                </button>
                <button 
                  onClick={() => handleNextStep('design', 'ok')}
                  style={optionStyle}
                >
                  🟡 {t('audit.q2o2')}
                </button>
                <button 
                  onClick={() => handleNextStep('design', 'love')}
                  style={optionStyle}
                >
                  🟢 {t('audit.q2o3')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ADS QUESTION */}
          {step === 4 && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{t('audit.step3')}</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t('audit.q3Title')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button 
                  onClick={() => handleNextStep('ads', 'none')}
                  style={optionStyle}
                >
                  🔴 {t('audit.q3o1')}
                </button>
                <button 
                  onClick={() => handleNextStep('ads', 'poor')}
                  style={optionStyle}
                >
                  🟡 {t('audit.q3o2')}
                </button>
                <button 
                  onClick={() => handleNextStep('ads', 'good')}
                  style={optionStyle}
                >
                  🟢 {t('audit.q3o3')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SCORE & ACTION */}
          {step === 5 && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{t('audit.scoreTitle')}</h3>
              
              {/* Score circle */}
              <div 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '6px solid var(--border)',
                  borderTopColor: score > 70 ? '#38A169' : score > 40 ? 'var(--accent)' : 'var(--pulse-red)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '1.5rem auto',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>{score}</div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>{t('audit.scoreOutOf')}</div>
              </div>

              {/* Status Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                {score <= 45 ? (
                  <div style={{ color: 'var(--pulse-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700 }}>
                    <AlertCircle size={18} /> {t('audit.statusWeak')}
                  </div>
                ) : score <= 75 ? (
                  <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700 }}>
                    <AlertCircle size={18} /> {t('audit.statusStable')}
                  </div>
                ) : (
                  <div style={{ color: '#38A169', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700 }}>
                    <CheckCircle size={18} /> {t('audit.statusStrong')}
                  </div>
                )}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {score <= 45 
                    ? t('audit.descWeak')
                    : score <= 75
                    ? t('audit.descStable')
                    : t('audit.descStrong')
                  }
                </p>
              </div>

              {/* Contact Lead Form for Free Consultation */}
              {!submitted ? (
                <form onSubmit={handleContactSubmit} style={{ marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem', textAlign: 'left' }}>
                    {t('audit.leadMsg')}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={t('audit.placeholder')}
                      style={{
                        flex: 1,
                        padding: '0.8rem 1rem',
                        borderRadius: '30px',
                        border: '1px solid var(--border)',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                    />
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ padding: '0.8rem 1.2rem' }}
                    >
                      {t('audit.btnSend')}
                    </button>
                  </div>
                </form>
              ) : (
                <div 
                  style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    backgroundColor: 'rgba(56, 161, 105, 0.1)', 
                    borderRadius: '12px',
                    color: '#38A169',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}
                >
                  {t('audit.successMsg')}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

const optionStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  textAlign: 'left',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)'
};
