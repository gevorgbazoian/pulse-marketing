import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function AIChatbot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize or update the chatbot greeting when language context changes
  useEffect(() => {
    setMessages([
      { sender: 'bot', text: t('chatbot.greeting') || 'Բարև Ձեզ։ Ես Pulse AI-ն եմ։ Ինչո՞վ կարող եմ օգնել Ձեզ։' }
    ]);
  }, [language]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');

    // Trigger typing simulation
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'bot', 
          text: t('chatbot.reply') || 'Շնորհակալություն հաղորդագրության համար։ Մեր մասնագետը շուտով կապ կհաստատի Ձեզ հետ։' 
        }
      ]);
    }, 1500); // 1.5s typing delay for realism
  };

  return (
    <div className="chatbot-toggle-btn-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999 }}>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-toggle-btn"
        >
          <span className="chat-ripple" style={{ animationDuration: '6s' }} />
          <MessageSquare size={24} className="chat-widget-icon" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            width: '360px',
            maxWidth: '90vw',
            height: '450px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.2rem',
              backgroundColor: '#212224',
              color: '#FDFCF7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#212224'
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-heading)' }}>Pulse Assistant</div>
                <div style={{ fontSize: '0.7rem', color: '#A0A5AA', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#38A169', borderRadius: '50%' }} />
                  {t('chatbot.status')}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#A0A5AA', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages body */}
          <div
            style={{
              flex: 1,
              padding: '1.2rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: 'var(--bg-primary)'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}
              >
                {msg.sender === 'bot' && (
                  <div 
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--accent)', 
                      fontSize: '0.65rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold',
                      marginTop: '4px'
                    }}
                  >
                    P
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '0.8rem 1rem',
                    borderRadius: msg.sender === 'user' ? '14px 14px 0 14px' : '0 14px 14px 14px',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-sans)',
                    backgroundColor: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--bg-card)',
                    color: msg.sender === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    border: msg.sender === 'bot' ? '1px solid var(--border)' : 'none'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent)', 
                    fontSize: '0.65rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold'
                  }}
                >
                  P
                </div>
                <div 
                  style={{ 
                    padding: '0.6rem 1rem', 
                    backgroundColor: 'var(--bg-card)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '0 14px 14px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span className="dot-typing" />
                  <span className="dot-typing" />
                  <span className="dot-typing" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '0.8rem',
              backgroundColor: 'var(--bg-card)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('chatbot.placeholder')}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--text-primary)'}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        .chatbot-toggle-btn {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background-color: #212224;
          color: #FDFCF7;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          position: relative;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          padding: 0;
        }

        /* Thinner outer ring / ripple */
        .chatbot-toggle-btn::after {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 50%;
          border: 1px solid rgba(242, 183, 5, 0.45);
          pointer-events: none;
          animation: chatbot-ring-pulse 3.5s infinite ease-in-out;
          transition: all 0.5s ease;
        }

        @keyframes chatbot-ring-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.35;
            border-color: rgba(217, 61, 61, 0.6);
          }
        }

        .chatbot-toggle-btn:hover {
          transform: scale(1.06) translateY(-4px);
          background-color: var(--accent) !important;
          color: #212224 !important;
        }

        .chatbot-toggle-btn:hover .chat-widget-icon {
          transform: rotate(15deg) scale(1.1);
        }

        .chatbot-toggle-btn .chat-widget-icon {
          transition: transform 0.4s ease;
        }

        @media (max-width: 820px) {
          .chatbot-toggle-btn {
            width: 64px !important;
            height: 64px !important;
          }
          .chatbot-toggle-btn-container {
            bottom: 1.5rem !important;
            right: 1.5rem !important;
          }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dot-typing {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--text-secondary);
          display: inline-block;
          animation: dotPulse 1.2s infinite ease-in-out;
        }
        .dot-typing:nth-child(2) { animation-delay: 0.2s; }
        .dot-typing:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotPulse {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
