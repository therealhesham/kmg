"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Generate floating particles with varied sizes
const particles = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 31 + 7) % 100}%`,
  top: `${(i * 47 + 23) % 100}%`,
  animationDelay: `${(i % 10) * 0.5}s`,
  animationDuration: `${8 + (i % 6)}s`,
  size: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1,
}));

// Target date for countdown (30 days from now)
const getTargetDate = () => {
  const target = new Date();
  target.setDate(target.getDate() + 30);
  return target;
};

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const targetDate = getTargetDate();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1500);
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

            {/* Coming Soon - Elegant serif typography */}
            <div className="mb-4 overflow-hidden">
              <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.3em] animate-[fadeInUp_1s_ease-out_0.2s_both]">
                <span 
                  className="inline-block bg-gradient-to-r from-[#8b7235] via-[#e8d5a3] via-50% to-[#8b7235] bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_8s_linear_infinite]"
                >
                  COMING SOON
                </span>
              </h1>
            </div>

            {/* Elegant divider */}
            <div className="relative flex items-center justify-center gap-4 my-8 animate-[fadeIn_1s_ease-out_0.4s_both]">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#c4a052]/50 animate-[line-extend_1s_ease-out_0.6s_both] origin-right" />
              <div className="w-2 h-2 rotate-45 border border-[#c4a052]/60" />
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#c4a052]/50 animate-[line-extend_1s_ease-out_0.6s_both] origin-left" />
            </div>

            {/* Tagline */}
            <p className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl lg:text-3xl text-[#f8f6f0]/90 mb-3 tracking-wide font-light italic animate-[fadeInUp_1s_ease-out_0.5s_both]">
              An elevated experience, crafted with precision
            </p>
            <p className="text-sm md:text-base text-[#c4a052]/70 mb-14 tracking-[0.25em] uppercase font-light animate-[fadeInUp_1s_ease-out_0.6s_both]">
              Elegance in Motion · Excellence in Detail
            </p>

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="animate-[fadeInUp_1s_ease-out_0.7s_both]">
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto mb-6">
                <div className="relative flex-1 group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
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
                    {isSubmitting ? "Sending..." : isSubmitted ? "Subscribed ✓" : "Notify Me"}
                  </span>
                </button>
              </div>
              <p className="text-xs text-white/30 tracking-wide">
                {isSubmitted 
                  ? "Thank you! We'll notify you when we launch." 
                  : "Be the first to experience the extraordinary"
                }
              </p>
            </form>

            {/* Countdown Timer */}
            <div className="mt-14 animate-[fadeInUp_1s_ease-out_0.9s_both]">
              <p className="text-xs text-white/40 uppercase tracking-[0.3em] mb-6">Launching In</p>
              <div className="flex justify-center gap-3 md:gap-5">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative"
                    style={{ animationDelay: `${1 + idx * 0.1}s` }}
                  >
                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-[#c4a052]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative min-w-[70px] md:min-w-[90px] px-4 py-5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                      <div className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl lg:text-5xl font-light text-[#e8d5a3] mb-1 tabular-nums">
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em]">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-xs text-white/20 tracking-[0.15em] animate-[fadeIn_1s_ease-out_1.2s_both]">
        <p>© 2024 · All Rights Reserved</p>
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
