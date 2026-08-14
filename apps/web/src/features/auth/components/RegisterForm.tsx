"use client";

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
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { useRegisterForm } from "../hooks/useRegisterForm";

export function RegisterForm() {
  const { onSubmit, formError, isSubmitting, errors, register } =
    useRegisterForm();

  return (
    <section className="w-full max-w-lg space-y-6">
      <header className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Daftar Merchant Baru
        </h1>
        <p className="text-sm text-slate-400">
          Buat tenant toko Anda dan akun admin owner dalam 1 langkah mudah
        </p>
      </header>

      <Card className="border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm">
        <CardContent className="p-0">
          <form onSubmit={onSubmit} className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Section 1: Toko / Merchant Info */}
            <fieldset className="space-y-3 border-0 p-0 m-0">
              <legend className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Informasi Toko / Tenant
              </legend>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-slate-300 block"
                    htmlFor="tenantName"
                  >
                    Nama Toko / Merchant *
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      id="tenantName"
                      type="text"
                      placeholder="Contoh: Barber Premium"
                      {...register("tenantName")}
                      className={`flex h-10 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.tenantName
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.tenantName && (
                    <p className="text-[11px] text-red-400 font-medium mt-1">
                      {errors.tenantName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-slate-300 block"
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
                      {...register("phone")}
                      className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold text-slate-300 block"
                  htmlFor="address"
                >
                  Alamat Toko
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <textarea
                    id="address"
                    placeholder="Masukkan alamat toko lengkap..."
                    {...register("address")}
                    className="flex min-h-[70px] w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </fieldset>

            <hr className="border-slate-800 my-4" />

            {/* Section 2: Owner Account Info */}
            <fieldset className="space-y-3 border-0 p-0 m-0">
              <legend className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Kredensial Akun Owner
              </legend>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold text-slate-300 block"
                  htmlFor="ownerName"
                >
                  Nama Lengkap Owner *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    id="ownerName"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    {...register("ownerName")}
                    className={`flex h-10 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.ownerName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.ownerName && (
                  <p className="text-[11px] text-red-400 font-medium mt-1">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-slate-300 block"
                    htmlFor="email"
                  >
                    Email Owner *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      {...register("email")}
                      className={`flex h-10 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-400 font-medium mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-slate-300 block"
                    htmlFor="password"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      id="password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      {...register("password")}
                      className={`flex h-10 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-400 font-medium mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-600/10 transition mt-4 justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mendaftarkan...
                </span>
              ) : (
                "Daftar & Masuk Kasir"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="mt-6 border-slate-800/80 pt-4 justify-center text-xs text-slate-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition ml-1"
          >
            Masuk ke Toko Anda
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
