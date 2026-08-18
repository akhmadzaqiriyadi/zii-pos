import React from "react";
import { LandingHero } from "../features/landing/components/LandingHero";
import { LandingNavbar } from "../features/landing/components/LandingNavbar";

export default function RootHomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {/* 1. Header Navigation Bar */}
      <LandingNavbar />

      {/* 2. Hero Section Draft */}
      <main className="flex-1">
        <LandingHero />
      </main>

      {/* 3. Simple Draft Footer */}
      <footer className="border-t border-slate-200/80 bg-slate-50 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-slate-600">
            &copy; {new Date().getFullYear()} ZII POS Platform. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6 font-semibold">
            <a
              href="https://wa.me/6285292677431"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Support WA 24/7
            </a>
            <span className="text-slate-300">•</span>
            <span>Multi-Tenant White-Label SaaS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
