"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-100">NEXUS</h1>
          <p className="text-zinc-500 font-medium">The Next Generation AI Orchestration Platform</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4f46e5',
                    brandAccent: '#4338ca',
                    inputBackground: '#18181b',
                    inputText: '#fafafa',
                    inputBorder: '#27272a',
                    inputPlaceholder: '#52525b',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    inputBorderRadius: '12px',
                  }
                }
              }
            }}
            theme="dark"
            providers={["google", "github"]}
          />
        </div>

        <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  );
}
