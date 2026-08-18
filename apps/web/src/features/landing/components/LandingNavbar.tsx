"use client";

import { ArrowRight, LogIn, Menu, Store, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo-zii-pos.png"
            alt="ZII POS Logo"
            className="h-11 w-11 object-contain"
          />
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">
              ZII <span className="text-emerald-600">POS</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Smart Cloud POS SaaS
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#fitur" className="hover:text-emerald-600 transition-colors">
            Fitur Unggulan
          </a>
          <a
            href="#keunggulan"
            className="hover:text-emerald-600 transition-colors"
          >
            Solusi Toko
          </a>
          <a href="#harga" className="hover:text-emerald-600 transition-colors">
            Paket & Harga
          </a>
          <a href="#faq" className="hover:text-emerald-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 gap-2 h-11 px-5"
            >
              <LogIn className="h-4 w-4 text-slate-500" />
              <span>Masuk</span>
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm shadow-emerald-600/20 gap-2 h-11 px-5">
              <span>Coba Gratis 14 Hari</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex sm:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Nav Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 pt-2 text-sm font-bold text-slate-700">
            <Link
              href="#fitur"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Fitur Unggulan
            </Link>
            <Link
              href="#keunggulan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Solusi Toko
            </Link>
            <Link
              href="#harga"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Paket & Harga
            </Link>
            <Link
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
            <Link href="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full rounded-xl border-slate-200 text-slate-700 font-bold"
              >
                Masuk ke Toko
              </Button>
            </Link>
            <Link href="/onboarding" className="w-full">
              <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold">
                Coba Gratis 14 Hari
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
