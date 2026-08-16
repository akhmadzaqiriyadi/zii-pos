"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, KeyRound, Mail, User } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { FormError, FormGroup, FormLabel } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
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
        <FormGroup>
          <FormLabel htmlFor="ownerName" required>
            Nama Lengkap Pemilik Toko
          </FormLabel>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="ownerName"
              type="text"
              placeholder="Contoh: Ahmad Zaqi"
              {...register("ownerName")}
              className={`bg-slate-50 pl-10 pr-3.5 ${
                errors.ownerName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
          </div>
          <FormError message={errors.ownerName?.message} />
        </FormGroup>

        {/* Email Owner */}
        <FormGroup>
          <FormLabel htmlFor="email" required>
            Email Login Owner
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
            />
          </div>
          <FormError message={errors.email?.message} />
        </FormGroup>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              />
            </div>
            <FormError message={errors.password?.message} />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="confirmPassword" required>
              Ulangi Password
            </FormLabel>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                {...register("confirmPassword")}
                className={`bg-slate-50 pl-10 pr-3.5 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                }`}
              />
            </div>
            <FormError message={errors.confirmPassword?.message} />
          </FormGroup>
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
