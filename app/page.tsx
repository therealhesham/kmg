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
  emailPlaceholder: string;
  emailButtonText: string;
  emailSuccessMsg: string;
  emailPromptMsg: string;
  portfolioTitle: string;
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
  const [settings, setSettings] = useState<Settings>({
    siteName: "KMG Investment",
    siteTagline: "Investment Excellence",
    siteSubtagline: "Building Tomorrow's Leaders",
    emailPlaceholder: "Enter your email address",
    emailButtonText: "Notify Me",
    emailSuccessMsg: "Thank you! We'll notify you when we launch.",
    emailPromptMsg: "Be the first to experience the extraordinary",
    portfolioTitle: "Our Portfolio",
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
        {/* Card container with refined glass effect */}
        <div className="relative mx-auto max-w-3xl">
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

        {/* Portfolio Companies Section */}
        <div className="mt-20 animate-[fadeInUp_1s_ease-out_1.1s_both]">
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
                    className="group relative aspect-square flex items-center justify-center"
                    style={{ animationDelay: `${1.2 + idx * 0.05}s` }}
                  >
                    {/* Hover effect border */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#c4a052]/0 to-[#c4a052]/0 group-hover:from-[#c4a052]/10 group-hover:to-transparent transition-all duration-500" />
                    
                    {/* Logo container */}
                    <div className="relative w-full h-full rounded-xl border border-white/[0.04] bg-white/[0.02] backdrop-blur-sm p-8 flex items-center justify-center group-hover:border-[#c4a052]/20 group-hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                      {/* Company logo */}
                      <div className="relative w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        <Image
                          src={company.logo}
                          alt={company.name}
                          fill
                          className="object-contain transition-all duration-500"
                          onError={(e) => {
                            // Fallback if image doesn't exist
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
                      
                      {/* Coming Soon Overlay */}
                      {company.comingSoon && (
                        <div className="absolute inset-0 bg-[#030303]/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="text-center">
                            <p className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl font-light tracking-[0.3em] bg-gradient-to-r from-[#8b7235] via-[#e8d5a3] to-[#8b7235] bg-clip-text text-transparent">
                              COMING SOON
                            </p>
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
