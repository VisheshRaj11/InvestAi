"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { RadialDotBackground } from "@/components/ui/radial-dot-background";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In our test environment, next-auth credentials handles auto-signup
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      toast.error("Sign up failed");
      setLoading(false);
    } else {
      toast.success("Account created successfully!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dotted-dark p-4 relative overflow-hidden font-sans">
      <RadialDotBackground />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-[#4A3B72] rounded-xl flex items-center justify-center shadow-inner">
            <Image src="/icon.svg" alt="InvestAI" width={24} height={24} className="brightness-0 invert" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2 text-[#2D235C]">Create an Account</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">Sign up to access your AI investment dashboard.</p>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
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
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#7B61FF] to-[#5B41CF] hover:opacity-90 text-white border-none shadow-md h-11 mt-2 rounded-xl font-medium cursor-pointer transition-all">
            {loading ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</span> : <span className="flex items-center gap-2">Sign Up <ArrowRight className="w-4 h-4" /></span>}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-[#5B41CF] hover:underline font-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
