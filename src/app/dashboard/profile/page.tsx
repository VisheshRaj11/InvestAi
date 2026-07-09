"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="w-full h-full p-4 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold mb-8">Your Profile</h2>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{session.user.name}</h3>
              <p className="text-gray-500">{session.user.email}</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                Analyst Tier
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Display Name</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-900 font-medium" defaultValue={session.user.name || ""} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-900 font-medium" defaultValue={session.user.email || ""} disabled />
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}