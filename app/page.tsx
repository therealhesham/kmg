import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Animated gold orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#c9a961]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-[#c9a961]/5 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#c9a961]/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#c9a961]/30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#c9a961]/30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#c9a961]/30"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Logo */}
        <div className="mb-12 relative mx-auto w-96 h-48 md:w-[500px] md:h-60 drop-shadow-[0_0_40px_rgba(201,169,97,0.3)]">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Coming Soon Text with animation */}
        <div className="mb-6 overflow-hidden">
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.2em] animate-[fadeInUp_1s_ease-out]">
            <span className="inline-block bg-gradient-to-r from-[#a08750] via-[#d4bc8e] to-[#c9a961] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(201,169,97,0.4)]">
              COMING SOON
            </span>
          </h1>
        </div>

        {/* Animated divider */}
        <div className="relative w-32 h-[2px] mx-auto my-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4bc8e] to-transparent animate-pulse"></div>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-400 mb-4 tracking-wide font-light animate-[fadeInUp_1s_ease-out_0.3s_both]">
          Something extraordinary is on its way
        </p>
        <p className="text-sm md:text-base text-gray-600 mb-16 tracking-wider uppercase animate-[fadeInUp_1s_ease-out_0.5s_both]">
          Elevate Your Experience
        </p>

        {/* Email Signup Form */}
        <div className="animate-[fadeInUp_1s_ease-out_0.7s_both]">
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-5 bg-black/50 backdrop-blur-sm border border-[#c9a961]/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a961] focus:shadow-[0_0_20px_rgba(201,169,97,0.3)] transition-all duration-300"
            />
            <button className="px-10 py-5 bg-gradient-to-r from-[#c9a961] to-[#a08750] text-black font-bold rounded-lg hover:shadow-[0_0_40px_rgba(201,169,97,0.5)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 uppercase tracking-wider">
              Notify Me
            </button>
          </div>
          <p className="text-xs text-gray-600">
            Be the first to know when we launch
          </p>
        </div>

        {/* Countdown or Progress indicator */}
        <div className="mt-16 flex justify-center gap-8 animate-[fadeInUp_1s_ease-out_0.9s_both]">
          {[
            { value: "30", label: "Days" },
            { value: "12", label: "Hours" },
            { value: "45", label: "Minutes" },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#c9a961] mb-2">
                {item.value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Social Links
        <div className="flex justify-center gap-8 mt-16 animate-[fadeInUp_1s_ease-out_1.1s_both]">
          {[
            { name: "Instagram", icon: "IG" },
            { name: "Twitter", icon: "TW" },
            { name: "LinkedIn", icon: "IN" },
          ].map((social) => (
            <a
              key={social.name}
              href="#"
              className="group relative"
            >
              <div className="w-12 h-12 rounded-full border border-[#c9a961]/30 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-[#c9a961] group-hover:border-[#c9a961] group-hover:shadow-[0_0_20px_rgba(201,169,97,0.3)] transition-all duration-300">
                {social.icon}
              </div>
            </a>
          ))}
        </div> */}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-center text-xs text-gray-700 tracking-wider">
        <p>&copy; 2024 All Rights Reserved</p>
      </footer>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#c9a961]/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>
    </main>
  );
}
