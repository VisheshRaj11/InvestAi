import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowLeft, Hexagon, Square, Cloud, Star, Circle, Settings, LayoutDashboard, Sparkles, Cpu, Target, ShieldAlert, ArrowUpRight, ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-radial overflow-hidden font-sans text-[#1A1A2E]">
      {/* Glassmorphism Header */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass rounded-full px-4 py-2 flex items-center gap-8 shadow-sm border border-white/60">
          <div className="flex items-center gap-2 bg-[#4A3B72] text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-4 w-4">
              <path d="M48 208V80L112 144L160 96L208 144" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="208" cy="144" r="24" fill="currentColor"/>
            </svg>
          </div>
          <div className="hidden md:flex items-center gap-2 font-bold text-lg text-[#2D235C]">
            InvestAI
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium text-gray-700 hover:text-black">
              Sign In
            </Link>
            <Link href="/signup">
              <Button className="rounded-full bg-gradient-to-r from-[#7B61FF] to-[#5B41CF] hover:opacity-90 text-white border-none shadow-md px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="pt-32 pb-12 px-4 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-left flex flex-col items-start z-30">
          <div className="glass rounded-full px-6 py-2 text-sm font-medium text-gray-600 mb-8 border border-white/60 shadow-sm">
            The Most Adaptable Web3 Stock Market Dashboard
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-[#2D235C]">
            Bring The Future Of Blockchain Investing To Your Device.
          </h1>
          
          <p className="mt-6 text-lg text-gray-600 max-w-xl font-medium">
            Manage your portfolio with real-time updates and AI automation — mobile and web, whenever you need.
          </p>
          
          <div className="mt-8">
            <Link href="/dashboard">
              <Button className="rounded-full bg-[#5B41CF] hover:bg-[#4A3B72] text-white px-8 py-6 text-lg shadow-xl shadow-purple-500/20">
                Download Now <ArrowDown className="ml-2 h-5 w-5 inline-block" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 3D Mockup Area */}
        <div className="relative w-full h-[650px] flex justify-center lg:justify-end perspective-1000 mt-12 lg:mt-0 z-20" style={{ perspective: '1200px' }}>
          
          {/* 3D Rotated Container */}
          <div 
            className="relative w-[320px] h-[650px] z-10 transition-transform duration-1000"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'rotateY(25deg) rotateX(15deg) rotateZ(20deg)',
            }}
          >
            {/* Phone Body with Screen (Overflow Hidden) */}
            <div 
              className="absolute inset-0 bg-white rounded-[40px] overflow-hidden"
              style={{
                boxShadow: '1px 1px 0 #333, 2px 2px 0 #333, 3px 3px 0 #333, 4px 4px 0 #333, 5px 5px 0 #333, 6px 6px 0 #333, 7px 7px 0 #333, 8px 8px 0 #333, 9px 9px 0 #333, 10px 10px 0 #333, 30px 30px 60px rgba(0,0,0,0.5)',
                border: '4px solid #111'
              }}
            >
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-gray-900 rounded-b-xl z-20"></div>
              
              {/* Phone Content Header */}
              <div className="pt-12 px-6 pb-4 flex justify-between items-center">
                <ArrowLeft className="h-5 w-5 font-bold" />
                <span className="font-semibold text-lg">Task</span>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><LayoutDashboard className="h-4 w-4 text-blue-500" /></div>
              </div>
              
              {/* Stock UI Mock */}
              <div className="px-6 mt-6 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">A</div>
                    <div>
                      <div className="font-bold text-sm">Apple Inc.</div>
                      <div className="text-xs text-gray-500">AAPL</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">$173.50</div>
                    <div className="text-xs text-green-500">+1.2%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">M</div>
                    <div>
                      <div className="font-bold text-sm">Microsoft</div>
                      <div className="text-xs text-gray-500">MSFT</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">$338.11</div>
                    <div className="text-xs text-green-500">+0.8%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">N</div>
                    <div>
                      <div className="font-bold text-sm">NVIDIA</div>
                      <div className="text-xs text-gray-500">NVDA</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">$462.41</div>
                    <div className="text-xs text-red-500">-0.4%</div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Graph UI Mock */}
              <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-t from-gray-50 to-white pt-8 px-6 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <div><span className="block text-lg text-black font-bold">Buy</span>Signal</div>
                  <div><span className="block text-lg text-green-500 font-bold">High</span>Trust</div>
                  <div><span className="block text-lg text-black font-bold">Hold</span>Action</div>
                </div>
              </div>
            </div>

            {/* Floating Card: AI Analysis (Translated in 3D Space) */}
            <div 
              className="absolute -left-12 md:-left-24 top-[220px] w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-5 z-30 border border-white/60"
              style={{ transform: 'translateZ(100px)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#1A1A2E]">AI Analysis: AAPL</h3>
                <Sparkles className="text-indigo-500 w-4 h-4" />
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Strong Q4 earnings reported. Expanding margins in services segment.
              </div>
              <div className="bg-green-50 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <div className="text-xs text-green-600 font-medium">Verdict</div>
                  <div className="text-sm font-bold text-green-700 mt-1">Invest</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
            </div>

            {/* Floating Card: Portfolio (Translated in 3D Space) */}
            <div 
              className="absolute -right-8 md:-right-16 top-[150px] w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-5 z-30 border border-white/60" 
              style={{ transform: 'translateZ(120px)', animationDelay: '1s' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[#1A1A2E]">Portfolio Value</h3>
              </div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm text-gray-500 font-medium">Total</span>
                <span className="text-xl font-bold text-[#1A1A2E]">$124,592 <span className="text-sm text-green-500 ml-1">+14.2%</span></span>
              </div>
              {/* Animated SVG Graph */}
              <div className="w-full h-16 mt-2 relative">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 0 35 C 10 35, 15 20, 25 25 C 35 30, 45 10, 55 15 C 65 20, 80 5, 100 0 L 100 40 L 0 40 Z" 
                    fill="url(#chartGradient)" 
                    className="animate-fade-in"
                  />
                  <path 
                    d="M 0 35 C 10 35, 15 20, 25 25 C 35 30, 45 10, 55 15 C 65 20, 80 5, 100 0" 
                    fill="none" 
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-draw-line"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                  />
                  {/* Pulsing dot at the end */}
                  <circle cx="100" cy="0" r="4" fill="#10B981" className="animate-fade-in" />
                  <circle cx="100" cy="0" r="4" fill="#10B981" className="animate-ping" style={{ animationDelay: '1s', opacity: 0 }} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

           {/* Stock Ticker Footer */}
      <div className="relative w-full py-4 bg-white border-t border-gray-200 z-10 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-12 px-8 text-sm font-bold text-gray-800">
            <span>APPLE <span className="text-green-500 font-medium ml-2">+1.24%</span></span>
            <span>MICROSOFT <span className="text-green-500 font-medium ml-2">+0.82%</span></span>
            <span>NVIDIA <span className="text-red-500 font-medium ml-2">-0.41%</span></span>
            <span>TESLA <span className="text-green-500 font-medium ml-2">+2.15%</span></span>
            <span>META <span className="text-green-500 font-medium ml-2">+1.05%</span></span>
            <span>AMAZON <span className="text-red-500 font-medium ml-2">-0.22%</span></span>
            <span>ALPHABET <span className="text-green-500 font-medium ml-2">+0.95%</span></span>
            <span>NETFLIX <span className="text-green-500 font-medium ml-2">+1.40%</span></span>
            
            {/* Duplicate for seamless looping */}
            <span>APPLE <span className="text-green-500 font-medium ml-2">+1.24%</span></span>
            <span>MICROSOFT <span className="text-green-500 font-medium ml-2">+0.82%</span></span>
            <span>NVIDIA <span className="text-red-500 font-medium ml-2">-0.41%</span></span>
            <span>TESLA <span className="text-green-500 font-medium ml-2">+2.15%</span></span>
          </div>
        </div>
      </div>

      {/* Features Carousel Section */}
      <section id="features" className="relative z-20 py-24 bg-white/40 backdrop-blur-md border-t border-white/60 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-4">Everything you need to invest smarter</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover the powerful features that make InvestAI the ultimate research tool.</p>
          </div>
          
          {/* CSS Snap Carousel */}
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="snap-center shrink-0 w-80 md:w-96 glass p-8 rounded-3xl border border-white/60 shadow-xl shadow-purple-500/5">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6"><Sparkles className="w-6 h-6"/></div>
              <h3 className="text-xl font-bold mb-3">AI Analyst</h3>
              <p className="text-gray-600 leading-relaxed">Our autonomous agent analyzes millions of data points to give you a clear Invest, Pass, or Watch verdict.</p>
            </div>
            
            <div className="snap-center shrink-0 w-80 md:w-96 glass p-8 rounded-3xl border border-white/60 shadow-xl shadow-blue-500/5">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Cpu className="w-6 h-6"/></div>
              <h3 className="text-xl font-bold mb-3">Real-time Data</h3>
              <p className="text-gray-600 leading-relaxed">Direct integration with Yahoo Finance provides millisecond-accurate pricing, news, and historical trends.</p>
            </div>
            
            <div className="snap-center shrink-0 w-80 md:w-96 glass p-8 rounded-3xl border border-white/60 shadow-xl shadow-green-500/5">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6"><Target className="w-6 h-6"/></div>
              <h3 className="text-xl font-bold mb-3">Competitor Comparison</h3>
              <p className="text-gray-600 leading-relaxed">Instantly see how your target stock stacks up against its biggest rivals in the same sector.</p>
            </div>
            
            <div className="snap-center shrink-0 w-80 md:w-96 glass p-8 rounded-3xl border border-white/60 shadow-xl shadow-pink-500/5">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6"><ShieldAlert className="w-6 h-6"/></div>
              <h3 className="text-xl font-bold mb-3">Risk Assessment</h3>
              <p className="text-gray-600 leading-relaxed">Automatically extract critical red flags and green flags from earnings calls and press releases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="relative z-20 py-24 bg-white/20 backdrop-blur-sm border-t border-white/60">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about the InvestAI platform.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is the AI analyst completely autonomous?", a: "Yes, our LangGraph-based AI agent autonomously researches SEC filings, news, and financial data to construct its verdicts without human intervention." },
              { q: "Is the stock market data real-time?", a: "Yes, we integrate directly with Yahoo Finance to pull millisecond-accurate pricing and historical data whenever you run a query." },
              { q: "Can I do my own manual research?", a: "Absolutely! The dashboard gives you the flexibility to instantly pull stock data for manual analysis, or you can trigger the AI for an in-depth report." },
              { q: "Which brokerages do you link to?", a: "Currently, we provide seamless one-click redirects to Upstox and Groww for users based in regions where those platforms operate." }
            ].map((faq, i) => (
              <details key={i} className="group glass rounded-2xl border border-white/60 shadow-sm overflow-hidden cursor-pointer">
                <summary className="flex justify-between items-center p-6 font-bold text-lg text-[#1A1A2E] list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-white/30 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
