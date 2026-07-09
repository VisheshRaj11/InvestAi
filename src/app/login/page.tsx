"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@investai.com");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      alert("Login failed");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Image src="/icon.svg" alt="InvestAI" width={24} height={24} className="brightness-0 invert" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Welcome to InvestAI</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Sign in to access your investment dashboard.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="analyst@investai.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-black text-white hover:bg-gray-800 h-11 mt-2 rounded-lg font-medium">
            {loading ? "Signing in..." : <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          For testing: any email/password creates a new account automatically.
        </div>
      </div>
    </div>
  );
}