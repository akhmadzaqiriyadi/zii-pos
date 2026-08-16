"use client";

import { AlertCircle, KeyRound, Loader2, Mail, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginForm() {
  const { onSubmit, formError, isSubmitting, errors, register } =
    useLoginForm();

  return (
    <section className="w-full max-w-md space-y-6">
      <header className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Masuk ke ZII POS
        </h1>
        <p className="text-sm text-slate-500">
          Masukkan email dan password akun Kasir/Owner Anda
        </p>
      </header>

      <Card className="border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
        <CardContent className="p-0">
          <form onSubmit={onSubmit} className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold text-slate-700 block"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  {...register("email")}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  className="text-xs font-semibold text-slate-700 block"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 z-10" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20 transition mt-2 justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="mt-6 border-t border-slate-100 pt-4 justify-center text-xs text-slate-500">
          Belum terdaftar?{" "}
          <Link
            href="/register"
            className="text-emerald-600 hover:text-emerald-700 font-semibold transition ml-1"
          >
            Daftar Merchant Baru
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
