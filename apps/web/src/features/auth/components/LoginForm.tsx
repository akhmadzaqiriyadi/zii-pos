"use client";

import { AlertCircle, KeyRound, Loader2, Mail, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { FormError, FormGroup, FormLabel } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { useSubdomainTenant } from "../../tenant/hooks/useSubdomainTenant";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginForm() {
  const { onSubmit, formError, isSubmitting, errors, register } =
    useLoginForm();
  const { tenant, subdomain } = useSubdomainTenant();

  const logoSrc = tenant?.logoUrl || "/logo-zii-pos.png";
  const title = tenant?.name || "Masuk ke ZII POS";
  const subtitle = tenant
    ? `Masuk ke akun Kasir / Owner ${tenant.name}`
    : "Masukkan email dan password akun Kasir/Owner Anda";

  return (
    <section className="w-full max-w-md space-y-6">
      <header className="flex flex-col items-center space-y-3 text-center">
        <img
          src={logoSrc}
          alt={title}
          className="h-28 w-auto object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/logo-zii-pos.png";
          }}
        />
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {title}
            </h1>
          </div>
          {subdomain && (
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                <Store className="h-3 w-3" />
                {subdomain}.ziipos.id
              </span>
            </div>
          )}
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
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

            <FormGroup>
              <FormLabel htmlFor="email" required>
                Email
              </FormLabel>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  {...register("email")}
                  className={`bg-slate-50 pl-10 pr-3.5 ${errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                  disabled={isSubmitting}
                />
              </div>
              <FormError message={errors.email?.message} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="password" required>
                Password
              </FormLabel>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`bg-slate-50 pl-10 pr-3.5 ${errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                  disabled={isSubmitting}
                />
              </div>
              <FormError message={errors.password?.message} />
            </FormGroup>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20 transition mt-2 justify-center cursor-pointer"
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
