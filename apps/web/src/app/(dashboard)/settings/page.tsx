"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Save, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useTenant } from "../../../features/tenant/hooks/useTenant";

const settingsSchema = z.object({
  storeName: z.string().min(2, { message: "Nama toko minimal 2 karakter." }),
  phone: z.string().min(5, { message: "Nomor telepon minimal 5 karakter." }),
  address: z.string().min(5, { message: "Alamat minimal 5 karakter." }),
  receiptFooter: z
    .string()
    .min(2, { message: "Pesan footer minimal 2 karakter." }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { tenant, updateTenant, isUpdating } = useTenant();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      storeName: "",
      phone: "",
      address: "",
      receiptFooter: "",
    },
  });

  useEffect(() => {
    if (tenant) {
      reset({
        storeName: tenant.name || "",
        phone: tenant.phone || "",
        address: tenant.address || "",
        receiptFooter: tenant.receiptFooter || "Terima kasih telah berbelanja!",
      });
    }
  }, [tenant, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await updateTenant({
        name: data.storeName,
        phone: data.phone,
        address: data.address,
        receiptFooter: data.receiptFooter,
      });
      setSuccessMsg(
        "Pengaturan White-Label Merchant berhasil disimpan secara permanen!",
      );
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan pengaturan merchant.",
      );
    }
  };

  return (
    <DashboardLayout requiredRole="owner">
      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Pengaturan White-Label Merchant
          </h1>
          <p className="text-sm text-slate-500">
            Atur nama toko, alamat, nomor telepon, dan pesan footer struk cetak
            / WhatsApp merchant kamu secara real-time.
          </p>
        </div>

        <Card className="rounded-2xl border border-slate-200 p-6">
          <CardHeader className="px-0 pt-0 mb-4 border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
              <Store className="h-5 w-5 text-emerald-600" />
              <span>Profil Merchant & Struk Cetak / WA</span>
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-600 font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label
                htmlFor="storeName"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Nama Toko Merchant
              </label>
              <Input
                id="storeName"
                placeholder="Contoh: ZII Distro & Laundry Studio"
                {...register("storeName")}
              />
              {errors.storeName && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Nomor WhatsApp Toko
              </label>
              <Input
                id="phone"
                placeholder="Contoh: 0812-9988-7766"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Alamat Toko
              </label>
              <Input
                id="address"
                placeholder="Contoh: Jl. Merdeka Raya No. 45, Jakarta"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="receiptFooter"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Pesan Footer Struk Belanja
              </label>
              <textarea
                id="receiptFooter"
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none transition"
                placeholder="Terima kasih telah berbelanja di ZII Store! Simpan nota ini sebagai bukti garansi."
                {...register("receiptFooter")}
              />
              {errors.receiptFooter && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {errors.receiptFooter.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isUpdating}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-6 rounded-xl"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan Pengaturan Permanen</span>
                </>
              )}
            </Button>
          </form>
        </Card>
      </main>
    </DashboardLayout>
  );
}
