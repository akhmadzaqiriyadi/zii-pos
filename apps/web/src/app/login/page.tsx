import type { Metadata } from "next";
import React from "react";
import { LoginForm } from "../../features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Masuk — ZII POS",
  description: "Masuk ke sistem kasir toko Anda",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12 text-white">
      <LoginForm />
    </main>
  );
}
