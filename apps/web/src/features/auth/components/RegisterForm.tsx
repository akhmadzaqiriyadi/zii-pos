"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../hooks/useAuth";

const registerSchema = z.object({
  tenantName: z.string().min(2, { message: "Nama toko minimal 2 karakter." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  ownerName: z.string().min(2, { message: "Nama owner minimal 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerAuth } = useAuth();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tenantName: "",
      ownerName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      setFormError("");
      await registerAuth({
        tenantName: data.tenantName,
        ownerName: data.ownerName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        address: data.address || undefined,
      });
    },
    onSuccess: () => {
      window.location.href = "/pos";
    },
    onError: (err: Error) => {
      setFormError(err.message || "Gagal melakukan registrasi merchant.");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md">
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="Contoh: Barber Premium"
                    {...register("tenantName")}
                    className={`flex h-10 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.tenantName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                    disabled={registerMutation.isPending}
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
                    {...register("phone")}
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
                  {...register("address")}
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
                  placeholder="Nama lengkap Anda"
                  {...register("ownerName")}
                  className={`flex h-10 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.ownerName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                  disabled={registerMutation.isPending}
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
                    placeholder="nama@email.com"
                    {...register("email")}
                    className={`flex h-10 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                    disabled={registerMutation.isPending}
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
                    placeholder="Minimal 6 karakter"
                    {...register("password")}
                    className={`flex h-10 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                    disabled={registerMutation.isPending}
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-400 font-medium mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
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
