"use client";

import { useState, useEffect } from "react";
import { RadialDotBackground } from "@/components/ui/radial-dot-background";
import { Target, X, LayoutDashboard, Compass, Bookmark, Menu, Briefcase, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetch('/api/portfolio').then(r => r.json()).then(d => setBalance(d.walletBalance || 0)).catch(() => {});
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Portfolio", href: "/dashboard/portfolio", icon: Briefcase },
    { name: "Watchlist", href: "/dashboard/watchlist", icon: Bookmark },
  ];

  return (
    <div className="flex h-screen bg-dotted-dark text-gray-900 font-sans overflow-hidden">
      <RadialDotBackground />
      
      {/* Mobile Nav Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileNavOpen(false)}></div>
      )}

      {/* Sidebar (Responsive) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:flex shrink-0 ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileNavOpen(false)}>
              <Image src="/icon.svg" alt="InvestAI" width={24} height={24} />
              <span className="font-bold text-lg tracking-tight">InvestAI</span>
            </Link>
            <button className="lg:hidden text-gray-400 hover:text-black" onClick={() => setIsMobileNavOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Wallet Balance</div>
            <div className="text-3xl font-bold mb-8 tracking-tight">${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Main</div>
            <nav className="space-y-1 mb-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                      isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <link.icon className="w-4 h-4" /> {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100">
          <Link href="/dashboard/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors -m-2 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-md">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-black">{session?.user?.name || "Loading..."}</div>
              <div className="text-xs text-gray-500">View Profile</div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileNavOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center text-sm font-medium text-gray-500 whitespace-nowrap">
              <span className="text-black font-bold">InvestAI</span> <span className="mx-2 text-gray-300">›</span> 
              <span className="text-gray-900 capitalize font-medium">{pathname.split('/').pop() || 'Dashboard'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}