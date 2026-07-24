"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  description: string | null;
  logo: string;
  website: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Settings {
  id?: string;
  siteName?: string;
  siteTagline?: string;
  siteSubtagline?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  emailPlaceholder?: string;
  emailButtonText?: string;
  emailSuccessMsg?: string;
  emailPromptMsg?: string;
  portfolioTitle?: string;
  contactTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  footerText?: string;
}

interface ClientHomeProps {
  companies: Company[];
  settings?: Settings | null;
}

function getIconForCategory(category: string) {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes("urban") || lowerCategory.includes("development")) return "apartment";
  if (lowerCategory.includes("sport") || lowerCategory.includes("leisure")) return "sports_tennis";
  if (lowerCategory.includes("holding")) return "star_border";
  if (lowerCategory.includes("commercial") || lowerCategory.includes("estate")) return "business";
  if (lowerCategory.includes("future") || lowerCategory.includes("plan")) return "domain";
  if (lowerCategory.includes("headquarter")) return "grid_view";
  if (lowerCategory.includes("education") || lowerCategory.includes("entertainment") || lowerCategory.includes("toy")) return "toys";
  if (lowerCategory.includes("tech")) return "terminal";
  return "apartment"; // Default
}

export default function ClientHome({ companies, settings }: ClientHomeProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");

  useEffect(() => {
    // Scroll Progress
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progressEl = document.getElementById("scroll-progress");
      if (progressEl) progressEl.style.width = scrolled + "%";
    };

    window.addEventListener("scroll", handleScroll);

    // Reveal Animations & Chapter Spy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Check if it's a chapter section
            if (entry.target.hasAttribute("data-chapter")) {
              const chapterIndex = parseInt(entry.target.getAttribute("data-chapter") || "0", 10);
              setActiveChapter(chapterIndex);
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
    );

    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, section[data-chapter]");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setSubscribeError("");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        const data = await res.json();
        setSubscribeError(data.error || "Failed to subscribe");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setSubscribeError("Failed to subscribe");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToChapter = (index: number) => {
    const section = document.querySelector(`section[data-chapter="${index}"]`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const chapters = ["Vision", "Architecture", "Portfolio", "Legacy"];

  const siteName = settings?.siteName || "KMG Group";
  const siteTagline = settings?.siteTagline || "Architecting Tomorrow";
  const siteSubtagline = settings?.siteSubtagline || "Cultivating Legacy Through Strategic Excellence";
  const aboutTitle = settings?.aboutTitle || "About KMG Group";
  const aboutDescription = settings?.aboutDescription || "KMG Group stands at the vanguard of sovereign and institutional investment. We don't merely allocate capital; we architect entire ecosystems of value, fusing visionary foresight with exacting operational mastery.";
  const portfolioTitle = settings?.portfolioTitle || "Our Portfolio";
  const contactTitle = settings?.contactTitle || "Begin a Dialogue";
  const emailPromptMsg = settings?.emailPromptMsg || "Exclusive access is reserved for visionary partners and sovereign entities seeking unparalleled value creation.";
  const emailPlaceholder = settings?.emailPlaceholder || "Enter Private Access Key or Email";
  const emailButtonText = settings?.emailButtonText || "Request Entry";
  const emailSuccessMsg = settings?.emailSuccessMsg || "Thank you! We'll notify you when we launch.";
  const contactAddress = settings?.contactAddress || "Riyadh Headquarters, Kingdom of Saudi Arabia";
  const contactEmail = settings?.contactEmail || "info@kmggroup.com";
  const contactPhone = settings?.contactPhone || "+966 55 555 5555";
  const footerText = settings?.footerText || "© 2026 KMG Group. All Rights Reserved.";

  return (
    <div className="relative min-h-screen">
      <div id="scroll-progress"></div>

      {/* Chapter Spine */}
      <div className="chapter-spine hidden md:flex">
        {chapters.map((chap, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`spine-dot ${activeChapter === idx ? "active" : ""}`}
              onClick={() => scrollToChapter(idx)}
            >
              <span className="spine-dot-label">{chap}</span>
            </div>
            {idx < chapters.length - 1 && <div className="spine-line"></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-image-grain opacity-20"></div>
        <div className="absolute inset-0 bg-image-subtle-grid opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-[800px] bg-image-glow-radial opacity-80"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* CHAPTER 0: THE VISION */}
        <section data-chapter="0" className="min-h-screen flex flex-col justify-center items-center text-center py-24 story-section reveal">
          <div className="chapter-label mb-12 reveal reveal-delay-1">01. The Vision</div>
          
          <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center mb-10 reveal reveal-delay-2">
            <div className="absolute inset-0 bg-primary opacity-[0.03] rounded-full blur-3xl scale-150 animate-[pulseGold_4s_infinite]"></div>
            <div className="flex flex-col items-center group cursor-default">
              <div className="w-20 h-20 mb-3 text-primary transition-transform duration-[1.5s] ease-out group-hover:rotate-180">
                <svg className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" strokeOpacity="0.8"></circle>
                  <path d="M50 5 A 45 45 0 0 1 50 95" strokeOpacity="0.5"></path>
                  <path d="M50 5 A 45 45 0 0 0 50 95" strokeOpacity="0.5"></path>
                  <ellipse cx="50" cy="50" rx="45" ry="15" strokeOpacity="0.6" className="origin-center animate-[rotateOrb_20s_linear_infinite]"></ellipse>
                  <ellipse cx="50" cy="50" rx="45" ry="30" strokeOpacity="0.4" className="origin-center animate-[rotateOrb_30s_linear_infinite_reverse]"></ellipse>
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-[0.25em] font-display text-primary drop-shadow-md">
                {siteName.replace(/Group|Investment/gi, "").trim() || siteName}
              </h1>
              <span className="text-[10px] uppercase tracking-[0.6em] text-gray-500 mt-3">
                {siteName.toLowerCase().includes("group") ? "Group" : "Investment"}
              </span>
            </div>
          </div>
          
          <div className="space-y-8 max-w-4xl reveal reveal-delay-3">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display text-white leading-[1.1]">
              {siteTagline}
            </h2>
            <p className="text-sm md:text-base uppercase tracking-[0.3em] text-primary/80 font-light border-y border-primary/10 py-5 inline-block px-12 lg:px-20 bg-primary/5 backdrop-blur-sm">
              {siteSubtagline}
            </p>
          </div>
          
          <div className="mt-16 reveal reveal-delay-4">
            <span className="material-symbols-outlined text-primary/40 text-4xl animate-bounce font-thin">
              keyboard_arrow_down
            </span>
          </div>
        </section>

        {/* CHAPTER 1: THE ARCHITECTURE */}
        <section data-chapter="1" className="min-h-screen flex flex-col justify-center py-24 story-section">
          <div className="chapter-label mb-16 reveal-left">02. The Architecture</div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 reveal-left reveal-delay-1">
              <h3 className="text-3xl md:text-5xl font-display text-white leading-tight">
                {aboutTitle}
              </h3>
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed whitespace-pre-line">
                {aboutDescription}
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                <div className="stat-card">
                  <div className="text-3xl font-display text-primary mb-2">Bespoke</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">Asset Curation</div>
                </div>
                <div className="stat-card">
                  <div className="text-3xl font-display text-primary mb-2">Global</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">Market Presence</div>
                </div>
              </div>
            </div>
            
            <div className="relative h-[600px] w-full reveal-right reveal-delay-2 hidden lg:block">
               <div className="absolute inset-0 glass-card rounded-sm border-primary/20 flex flex-col justify-between p-12 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-1000"></div>
                  
                  <div className="space-y-8 relative z-10">
                    <div className="timeline-item">
                      <h4 className="text-primary tracking-widest uppercase text-xs mb-2">Phase I</h4>
                      <p className="text-white font-display text-xl">Strategic Acquisition</p>
                    </div>
                    <div className="timeline-item">
                      <h4 className="text-primary tracking-widest uppercase text-xs mb-2">Phase II</h4>
                      <p className="text-white font-display text-xl">Operational Synergy</p>
                    </div>
                    <div className="timeline-item">
                      <h4 className="text-primary tracking-widest uppercase text-xs mb-2">Phase III</h4>
                      <p className="text-white font-display text-xl">Legacy Realization</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 text-right mt-auto">
                    <span className="font-script text-5xl gold-shimmer opacity-50">{siteName}</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 2: THE PORTFOLIO */}
        <section data-chapter="2" className="min-h-screen py-24 story-section">
          <div className="chapter-label mb-16 reveal">03. The Portfolio</div>
          
          <div className="text-center mb-20 reveal reveal-delay-1">
            <h3 className="text-4xl md:text-6xl font-display text-white">
              {portfolioTitle}
            </h3>
            <p className="mt-6 text-gray-500 tracking-widest uppercase text-xs max-w-2xl mx-auto">
              A symphony of diversified assets spanning real estate, technology, and visionary development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company, index) => {
              const delayClass = `reveal-delay-${(index % 3) + 1}`;
              const isLarge = index === companies.length - 1 && companies.length % 3 === 1;
              return (
                <div
                  key={company.id}
                  className={`portfolio-card group h-[400px] bg-surface-dark rounded-sm reveal ${delayClass} ${
                    isLarge ? "md:col-span-2 lg:col-span-3 h-[500px]" : ""
                  }`}
                >
                  <img
                    alt={company.name}
                    className="card-img absolute inset-0 w-full h-full object-cover opacity-50"
                    src={company.logo}
                  />
                  <div className="absolute inset-0 image-overlay"></div>
                  
                  {/* Decorative Borders */}
                  <div className="absolute inset-4 border border-primary/0 group-hover:border-primary/30 transition-colors duration-700 pointer-events-none"></div>
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="absolute inset-0 p-10 flex flex-col justify-end z-10 card-content">
                    <div className="mb-auto self-end opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="material-symbols-outlined text-3xl text-primary font-thin drop-shadow-md">
                        {getIconForCategory(company.description || company.name || "")}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display text-2xl font-bold tracking-widest text-white mb-3 uppercase drop-shadow-lg">
                        {company.name}
                      </h4>
                      <div className="h-[1px] w-12 bg-primary mb-4 card-reveal"></div>
                      <p className="text-xs uppercase tracking-widest text-gray-300 card-reveal mb-6 line-clamp-3 leading-loose">
                        {company.description}
                      </p>
                      
                      <Link
                        className="card-reveal inline-flex items-center gap-3 text-primary text-xs tracking-widest uppercase hover:text-white transition-colors"
                        href={company.website || "#"}
                      >
                        Explore Venture
                        <span className="material-symbols-outlined text-[14px]">
                          arrow_right_alt
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CHAPTER 3: THE LEGACY */}
        <section data-chapter="3" className="min-h-screen flex flex-col justify-center py-24 story-section">
          <div className="chapter-label mb-16 reveal">04. The Legacy</div>
          
          <div className="glass-card rounded-sm p-12 md:p-24 relative overflow-hidden reveal reveal-delay-1 border border-primary/20">
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 text-center space-y-12 max-w-3xl mx-auto">
              <span className="material-symbols-outlined text-primary text-5xl font-thin opacity-80">
                diamond
              </span>
              
              <h3 className="text-4xl md:text-6xl font-display text-white">
                {contactTitle}
              </h3>
              
              <p className="text-gray-400 tracking-widest uppercase text-xs leading-loose">
                {emailPromptMsg}
              </p>
              
              <form onSubmit={handleSubscribe} className="w-full max-w-md mx-auto relative group mt-12">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 blur transition-opacity duration-1000"></div>
                <div className="relative bg-black/50 backdrop-blur-md p-1 flex flex-col sm:flex-row items-center border border-white/10 group-hover:border-primary/40 transition-colors duration-500">
                  <input
                    className="flex-1 w-full bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 px-6 py-4 text-sm font-light tracking-wide outline-none"
                    placeholder={emailPlaceholder}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || isSubmitted}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className="w-full sm:w-auto px-8 py-4 bg-primary/10 hover:bg-primary text-primary hover:text-black font-medium text-xs tracking-widest uppercase transition-all duration-500 ease-out cursor-pointer border-l border-white/5 disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : emailButtonText}
                  </button>
                </div>
                {isSubmitted && (
                  <p className="mt-4 text-xs text-primary tracking-widest uppercase">
                    {emailSuccessMsg}
                  </p>
                )}
                {subscribeError && (
                  <p className="mt-4 text-xs text-red-400 tracking-widest uppercase">
                    {subscribeError}
                  </p>
                )}
              </form>
            </div>
            
            <div className="mt-32 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-center md:text-left">
              <div>
                <h5 className="text-white font-display text-xl tracking-wide mb-4">
                  {siteName}
                </h5>
                <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-widest whitespace-pre-line">
                  {contactAddress}
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-4">
                <a href={`mailto:${contactEmail}`} className="text-xs uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">mail</span>
                  {contactEmail}
                </a>
                <a href={`tel:${contactPhone}`} className="text-xs uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">call</span>
                  {contactPhone}
                </a>
              </div>
              
              <div className="flex flex-col md:items-end justify-center gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
                <p>{footerText}</p>
                <div className="flex gap-4">
                  <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                  <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
