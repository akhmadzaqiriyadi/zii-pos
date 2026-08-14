"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, KeyRound, Loader2, Mail, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      setFormError("");
      await login(data.email, data.password);
    },
    onSuccess: () => {
      window.location.href = "/pos";
    },
    onError: (err: Error) => {
      setFormError(err.message || "Email atau password salah.");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Masuk ke ZII POS
        </h1>
        <p className="text-sm text-slate-400">
          Masukkan email dan password akun Kasir/Owner Anda
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

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-slate-300"
              htmlFor="email"
            >
              Email
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
                disabled={loginMutation.isPending}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-400 font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                className="text-xs font-semibold text-slate-300"
                htmlFor="password"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={`flex h-10 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3.5 py-2 text-sm text-white transition placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                }`}
                disabled={loginMutation.isPending}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-400 font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-600/10 transition mt-2 justify-center"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </span>
            ) : (
              "Masuk Sekarang"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Belum terdaftar?{" "}
          <Link
            href="/register"
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
          >
            Daftar Merchant Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
