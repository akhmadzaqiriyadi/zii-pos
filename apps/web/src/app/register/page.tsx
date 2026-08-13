import type { Metadata } from "next";
import React from "react";
import { RegisterForm } from "../../features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar Merchant — ZII POS",
  description: "Daftarkan toko dan akun owner Anda di ZII POS",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12 text-white">
      <RegisterForm />
    </main>
  );
}
