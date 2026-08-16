"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, KeyRound, Mail, User } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {
  type StepOwnerAccountData,
  stepOwnerAccountSchema,
} from "../schemas/onboarding.schema";

interface StepOwnerAccountProps {
  initialData: StepOwnerAccountData;
  onSubmit: (data: StepOwnerAccountData) => void;
  onBack: () => void;
}

export function StepOwnerAccount({
  initialData,
  onSubmit,
  onBack,
}: StepOwnerAccountProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepOwnerAccountData>({
    resolver: zodResolver(stepOwnerAccountSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900">
          Langkah 2: Kredensial Akun Pemilik Toko (Owner)
        </h2>
        <p className="text-xs text-slate-500">
          Buat akun administrator utama untuk mengelola kasir, stok produk, dan
          laporan keuangan toko Anda.
        </p>
      </header>

      <div className="space-y-4">
        {/* Nama Owner */}
        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold text-slate-700 block"
            htmlFor="ownerName"
          >
            Nama Lengkap Pemilik Toko *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              id="ownerName"
              type="text"
              placeholder="Contoh: Ahmad Zaqi"
              {...register("ownerName")}
              className={`flex h-10 w-full rounded-xl border bg-slate-50 pl-10 pr-3.5 py-2 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.ownerName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
          </div>
          {errors.ownerName && (
            <p className="text-[11px] text-red-500 font-medium mt-1">
              {errors.ownerName.message}
            </p>
          )}
        </div>

        {/* Email Owner */}
        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold text-slate-700 block"
            htmlFor="email"
          >
            Email Login Owner *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              {...register("email")}
              className={`flex h-10 w-full rounded-xl border bg-slate-50 pl-10 pr-3.5 py-2 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-500 font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-slate-700 block"
              htmlFor="password"
            >
              Password *
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                {...register("password")}
                className={`flex h-10 w-full rounded-xl border bg-slate-50 pl-10 pr-3.5 py-2 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-slate-700 block"
              htmlFor="confirmPassword"
            >
              Ulangi Password *
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                {...register("confirmPassword")}
                className={`flex h-10 w-full rounded-xl border bg-slate-50 pl-10 pr-3.5 py-2 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-500 font-medium mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="h-11 px-5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 gap-2 cursor-pointer transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Button>

        <Button
          type="submit"
          className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20 gap-2 cursor-pointer transition"
        >
          <span>Lanjut ke Pilihan Paket</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
