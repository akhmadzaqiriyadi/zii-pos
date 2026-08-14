"use client";

import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../hooks/useAuth";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [tenantName, setTenantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [formError, setFormError] = useState("");

  const registerMutation = useMutation({
    mutationFn: async () => {
      setFormError("");

      // Basic validations
      if (!tenantName || !ownerName || !email || !password) {
        throw new Error(
          "Kolom Nama Toko, Nama Lengkap, Email, dan Password wajib diisi.",
        );
      }
      if (password.length < 6) {
        throw new Error("Password minimal 6 karakter.");
      }

      await register({
        tenantName,
        ownerName,
        email,
        password,
        phone: phone || undefined,
        address: address || undefined,
      });
    },
    onSuccess: () => {
      // Force reload layout and apply middleware redirect
      window.location.href = "/pos";
    },
    onError: (err: Error) => {
      setFormError(err.message || "Gagal melakukan registrasi merchant.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Daftar Merchant Baru
        </h1>
        <p className="text-sm text-slate-400">
          Buat tenant toko Anda dan akun admin owner dalam 1 langkah mudah
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Toko / Merchant Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Informasi Toko / Tenant
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold text-slate-300"
                  htmlFor="tenantName"
                >
                  Nama Toko / Merchant *
                </label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="tenantName"
                    type="text"
                    required
                    placeholder="Contoh: Barber Premium"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold text-slate-300"
                  htmlFor="phone"
                >
                  Nomor Telepon Toko
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="phone"
                    type="text"
                    placeholder="Contoh: 0812XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold text-slate-300"
                htmlFor="address"
              >
                Alamat Toko
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <textarea
                  id="address"
                  placeholder="Masukkan alamat toko lengkap..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex min-h-[70px] w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  disabled={registerMutation.isPending}
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-800 my-4" />

          {/* Section 2: Owner Account Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Kredensial Akun Owner
            </h3>

            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold text-slate-300"
                htmlFor="ownerName"
              >
                Nama Lengkap Owner *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="ownerName"
                  type="text"
                  required
                  placeholder="Nama lengkap Anda"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={registerMutation.isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold text-slate-300"
                  htmlFor="email"
                >
                  Email Owner *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold text-slate-300"
                  htmlFor="password"
                >
                  Password *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={registerMutation.isPending}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-600/10 transition mt-4 justify-center"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Mendaftarkan...
              </span>
            ) : (
              "Daftar & Masuk Kasir"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
          >
            Masuk ke Toko Anda
          </Link>
        </div>
      </div>
    </div>
  );
}
