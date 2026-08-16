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
import { FormError, FormGroup, FormLabel } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useRegisterForm } from "../hooks/useRegisterForm";

export function RegisterForm() {
  const { onSubmit, formError, isSubmitting, errors, register } =
    useRegisterForm();

  return (
    <section className="w-full max-w-lg space-y-6">
      <header className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Daftar Merchant Baru
        </h1>
        <p className="text-sm text-slate-500">
          Buat tenant toko Anda dan akun admin owner dalam 1 langkah mudah
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

            {/* Section 1: Toko / Merchant Info */}
            <fieldset className="space-y-3 border-0 p-0 m-0">
              <legend className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                Informasi Toko / Tenant
              </legend>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormGroup>
                  <FormLabel htmlFor="tenantName" required>
                    Nama Toko / Merchant
                  </FormLabel>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="tenantName"
                      type="text"
                      placeholder="Contoh: Barber Premium"
                      {...register("tenantName")}
                      className={`bg-slate-50 pl-10 pr-3.5 ${
                        errors.tenantName
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  <FormError message={errors.tenantName?.message} />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="phone">Nomor Telepon Toko</FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="text"
                      placeholder="Contoh: 0812XXXXXXXX"
                      {...register("phone")}
                      className="bg-slate-50 pl-10 pr-3.5"
                      disabled={isSubmitting}
                    />
                  </div>
                </FormGroup>
              </div>

              <FormGroup>
                <FormLabel htmlFor="address">Alamat Toko</FormLabel>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat toko lengkap..."
                    {...register("address")}
                    className="min-h-[70px] bg-slate-50 pl-10 pr-3.5 text-sm resize-none"
                    disabled={isSubmitting}
                  />
                </div>
              </FormGroup>
            </fieldset>

            <hr className="border-slate-100 my-4" />

            {/* Section 2: Owner Account Info */}
            <fieldset className="space-y-3 border-0 p-0 m-0">
              <legend className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                Kredensial Akun Owner
              </legend>

              <FormGroup>
                <FormLabel htmlFor="ownerName" required>
                  Nama Lengkap Owner
                </FormLabel>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="ownerName"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    {...register("ownerName")}
                    className={`bg-slate-50 pl-10 pr-3.5 ${
                      errors.ownerName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                <FormError message={errors.ownerName?.message} />
              </FormGroup>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormGroup>
                  <FormLabel htmlFor="email" required>
                    Email Owner
                  </FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      {...register("email")}
                      className={`bg-slate-50 pl-10 pr-3.5 ${
                        errors.email
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
                      placeholder="Minimal 6 karakter"
                      {...register("password")}
                      className={`bg-slate-50 pl-10 pr-3.5 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  <FormError message={errors.password?.message} />
                </FormGroup>
              </div>
            </fieldset>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20 transition mt-4 justify-center cursor-pointer"
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

        <CardFooter className="mt-6 border-t border-slate-100 pt-4 justify-center text-xs text-slate-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-emerald-600 hover:text-emerald-700 font-semibold transition ml-1"
          >
            Masuk ke Toko Anda
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
