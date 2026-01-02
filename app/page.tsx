"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string | null;
  website: string | null;
  order: number;
  isActive: boolean;
  comingSoon: boolean;
}

interface Settings {
  siteName: string;
  siteTagline: string;
  siteSubtagline: string;
  aboutTitle: string;
  aboutDescription: string;
  emailPlaceholder: string;
  emailButtonText: string;
  emailSuccessMsg: string;
  emailPromptMsg: string;
  portfolioTitle: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  footerText: string;
}

// Generate floating particles with varied sizes
const particles = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 31 + 7) % 100}%`,
  top: `${(i * 47 + 23) % 100}%`,
  animationDelay: `${(i % 10) * 0.5}s`,
  animationDuration: `${8 + (i % 6)}s`,
  size: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1,
}));

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<Settings>({
    siteName: "KMG Investment",
    siteTagline: "Investment Excellence",
    siteSubtagline: "Building Tomorrow's Leaders",
    aboutTitle: "About KMG Group",
    aboutDescription: "KMG Group is a leading investment firm dedicated to building and nurturing exceptional businesses. With a portfolio spanning diverse industries, we bring strategic vision, operational excellence, and sustainable growth to every venture we undertake.",
    emailPlaceholder: "Enter your email address",
    emailButtonText: "Notify Me",
    emailSuccessMsg: "Thank you! We'll notify you when we launch.",
    emailPromptMsg: "Be the first to experience the extraordinary",
    portfolioTitle: "Our Portfolio",
    contactTitle: "Contact Us",
    contactEmail: "info@kmggroup.com",
    contactPhone: "+1 (555) 123-4567",
    contactAddress: "123 Business District, City, Country",
    footerText: "© 2024 · All Rights Reserved",
  });

  useEffect(() => {
    // Fetch companies
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error('Error fetching companies:', err));

    // Fetch settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error fetching settings:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center relative overflow-hidden font-[family-name:var(--font-outfit)]">
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(196, 160, 82, 0.5) 40px,
              rgba(196, 160, 82, 0.5) 41px
            )`,
          }}
        />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Ambient light orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[300px] -left-[200px] w-[800px] h-[800px] bg-[#c4a052]/10 rounded-full animate-[glow_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-[200px] -right-[300px] w-[700px] h-[700px] bg-[#c4a052]/8 rounded-full animate-[glow_10s_ease-in-out_infinite_2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c4a052]/5 rounded-full animate-[glow_12s_ease-in-out_infinite_1s]" />
      </div>

      {/* Decorative corner frames */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-[#c4a052]/20 animate-[fadeIn_1.5s_ease-out]" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t border-r border-[#c4a052]/20 animate-[fadeIn_1.5s_ease-out_0.1s_both]" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b border-l border-[#c4a052]/20 animate-[fadeIn_1.5s_ease-out_0.2s_both]" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-[#c4a052]/20 animate-[fadeIn_1.5s_ease-out_0.3s_both]" />

      {/* Additional corner accents */}
      <div className="absolute top-8 left-8 w-3 h-3 bg-[#c4a052]/40 animate-[fadeIn_1.5s_ease-out_0.5s_both]" />
      <div className="absolute top-8 right-8 w-3 h-3 bg-[#c4a052]/40 animate-[fadeIn_1.5s_ease-out_0.6s_both]" />
      <div className="absolute bottom-8 left-8 w-3 h-3 bg-[#c4a052]/40 animate-[fadeIn_1.5s_ease-out_0.7s_both]" />
      <div className="absolute bottom-8 right-8 w-3 h-3 bg-[#c4a052]/40 animate-[fadeIn_1.5s_ease-out_0.8s_both]" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl w-full py-12">
        {/* Hero Section with Logo */}
        <div className="relative mx-auto max-w-3xl mb-20">
          {/* Rotating border glow */}
          <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-r from-transparent via-[#c4a052]/30 to-transparent animate-[borderGlow_4s_ease-in-out_infinite] blur-sm" />
          
          <div className="relative rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-2xl p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-[#c4a052]/[0.03] to-transparent pointer-events-none" />
            
            {/* Logo with refined glow */}
            <div className="mb-10 relative mx-auto w-72 h-36 md:w-[420px] md:h-[200px] animate-[fadeIn_1.2s_ease-out]">
              <div className="absolute inset-0 bg-[#c4a052]/20 blur-[60px] rounded-full animate-[pulse-slow_4s_ease-in-out_infinite]" />
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain relative z-10 drop-shadow-[0_0_30px_rgba(196,160,82,0.3)]"
                priority
              />
            </div>

            {/* Tagline */}
            <p className="font-[family-name:var(--font-cormorant)] text-3xl md:text-5xl lg:text-6xl text-[#f8f6f0]/90 mb-4 tracking-wide font-light animate-[fadeInUp_1s_ease-out_0.2s_both]">
              {settings.siteTagline}
            </p>
            <p className="text-base md:text-lg text-[#c4a052]/70 mb-14 tracking-[0.2em] font-light animate-[fadeInUp_1s_ease-out_0.4s_both]">
              {settings.siteSubtagline}
            </p>

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="animate-[fadeInUp_1s_ease-out_0.7s_both]">
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto mb-6">
                <div className="relative flex-1 group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={settings.emailPlaceholder}
                    disabled={isSubmitted}
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#c4a052]/50 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(196,160,82,0.15)] transition-all duration-500 disabled:opacity-50"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-[#c4a052]/0 to-transparent group-focus-within:via-[#c4a052]/10 transition-all duration-500 pointer-events-none" />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="relative px-8 py-4 overflow-hidden rounded-xl font-medium tracking-wider uppercase text-sm transition-all duration-500 disabled:opacity-70 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c4a052] to-[#8b7235]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#e8d5a3] to-[#c4a052] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_40px_rgba(196,160,82,0.5)]" />
                  <span className="relative z-10 text-[#030303] font-semibold">
                    {isSubmitting ? "Sending..." : isSubmitted ? "Subscribed ✓" : settings.emailButtonText}
                  </span>
                </button>
              </div>
              <p className="text-xs text-white/30 tracking-wide">
                {isSubmitted 
                  ? settings.emailSuccessMsg
                  : settings.emailPromptMsg
                }
              </p>
            </form>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-20 animate-[fadeInUp_1s_ease-out_0.9s_both]">
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mb-8">{settings.aboutTitle}</p>
          
          <div className="relative mx-auto max-w-4xl">
            {/* Subtle border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-[#c4a052]/20 to-transparent blur-sm" />
            
            <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl p-8 md:p-12">
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#c4a052]/[0.02] to-transparent pointer-events-none" />
              
              <p className="text-base md:text-lg text-white/70 leading-relaxed tracking-wide font-light max-w-3xl mx-auto">
                {settings.aboutDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Companies Section */}
        <div className="mb-20 animate-[fadeInUp_1s_ease-out_1.1s_both]">
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mb-8">{settings.portfolioTitle}</p>
          
          <div className="relative mx-auto max-w-4xl">
            {/* Subtle border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-[#c4a052]/20 to-transparent blur-sm" />
            
            <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl p-8 md:p-10">
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#c4a052]/[0.02] to-transparent pointer-events-none" />
              
              {/* Logos Grid */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {companies.length > 0 ? companies.map((company, idx) => (
                  <div
                    key={company.id}
                    className="relative aspect-square flex items-center justify-center"
                    style={{ 
                      animationDelay: `${1.2 + idx * 0.05}s`,
                      perspective: '1000px'
                    }}
                    onMouseEnter={() => setFlippedCards(prev => new Set(prev).add(company.id))}
                    onMouseLeave={() => setFlippedCards(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(company.id);
                      return newSet;
                    })}
                  >
                    {/* Hover effect border */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#c4a052]/0 to-[#c4a052]/0 transition-all duration-700" style={{
                      background: flippedCards.has(company.id) ? 'linear-gradient(to bottom right, rgba(196, 160, 82, 0.1), transparent)' : undefined
                    }} />
                    
                    {/* Flip container */}
                    <div 
                      className="relative w-full h-full transition-all duration-700 ease-in-out" 
                      style={{ 
                        transformStyle: 'preserve-3d', 
                        transform: flippedCards.has(company.id) ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* Front side - Logo */}
                      <div 
                        className="absolute inset-0 rounded-xl border border-white/[0.04] bg-white/[0.02] backdrop-blur-sm p-8 flex items-center justify-center transition-all duration-700 overflow-hidden"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(0deg)',
                          borderColor: flippedCards.has(company.id) ? 'rgba(196, 160, 82, 0.2)' : undefined,
                          backgroundColor: flippedCards.has(company.id) ? 'rgba(255, 255, 255, 0.04)' : undefined
                        }}
                      >
                        <div className="relative w-full h-full opacity-80 transition-opacity duration-300">
                          <Image
                            src={company.logo}
                            alt={company.name}
                            fill
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-text')) {
                                const fallback = document.createElement('div');
                                fallback.className = 'fallback-text text-[#c4a052]/30 text-xs font-light tracking-widest text-center';
                                fallback.textContent = company.name;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Back side - Description */}
                      {(company.description || company.comingSoon) && (
                        <div 
                          className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#030303]/98 via-[#1a1410]/95 to-[#030303]/98 backdrop-blur-md border border-[#c4a052]/20 flex items-center justify-center p-6 transition-opacity duration-700"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          <div className="text-center space-y-4">
                            {company.description && (
                              <p className="text-sm md:text-base text-white/90 leading-relaxed font-light">
                                {company.description}
                              </p>
                            )}
                            {company.comingSoon && (
                              <p className="font-[family-name:var(--font-cormorant)] text-base md:text-lg font-light tracking-[0.3em] bg-gradient-to-r from-[#8b7235] via-[#e8d5a3] to-[#8b7235] bg-clip-text text-transparent">
                                COMING SOON
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  // Placeholder when no companies
                  <div className="col-span-full text-center py-12">
                    <p className="text-white/30 text-sm tracking-wide">No companies yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="mb-12 animate-[fadeInUp_1s_ease-out_1.3s_both]">
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mb-8">{settings.contactTitle}</p>
          
          <div className="relative mx-auto max-w-4xl">
            {/* Subtle border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-[#c4a052]/20 to-transparent blur-sm" />
            
            <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl p-8 md:p-12">
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#c4a052]/[0.02] to-transparent pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* Email */}
                <div className="group text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#c4a052]/10 border border-[#c4a052]/20 group-hover:bg-[#c4a052]/20 transition-all duration-500">
                    <svg className="w-6 h-6 text-[#c4a052]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-2">Email</p>
                  <a href={`mailto:${settings.contactEmail}`} className="text-sm md:text-base text-white/70 hover:text-[#c4a052] transition-colors duration-300">
                    {settings.contactEmail}
                  </a>
                </div>

                {/* Phone */}
                <div className="group text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#c4a052]/10 border border-[#c4a052]/20 group-hover:bg-[#c4a052]/20 transition-all duration-500">
                    <svg className="w-6 h-6 text-[#c4a052]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-2">Phone</p>
                  <a href={`tel:${settings.contactPhone}`} className="text-sm md:text-base text-white/70 hover:text-[#c4a052] transition-colors duration-300">
                    {settings.contactPhone}
                  </a>
                </div>

                {/* Address */}
                <div className="group text-center">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#c4a052]/10 border border-[#c4a052]/20 group-hover:bg-[#c4a052]/20 transition-all duration-500">
                    <svg className="w-6 h-6 text-[#c4a052]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-2">Address</p>
                  <p className="text-sm md:text-base text-white/70">
                    {settings.contactAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-16 mb-6 text-center text-xs text-white/20 tracking-[0.15em] animate-[fadeIn_1s_ease-out_1.2s_both]">
        <p>{settings.footerText}</p>
      </footer>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#c4a052] animate-float"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.15,
            }}
          />
        ))}
      </div>
    </main>
  );
}
