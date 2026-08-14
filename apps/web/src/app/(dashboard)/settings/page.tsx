"use client";

import { CheckCircle2, Loader2, Save, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useTenant } from "../../../features/tenant/hooks/useTenant";

export default function SettingsPage() {
  const { tenant, updateTenant, isUpdating } = useTenant();

  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [footerText, setFooterText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (tenant) {
      setStoreName(tenant.name || "");
      setPhone(tenant.phone || "");
      setAddress(tenant.address || "");
      setFooterText(tenant.receiptFooter || "Terima kasih telah berbelanja!");
    }
  }, [tenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await updateTenant({
        name: storeName,
        phone,
        address,
        receiptFooter: footerText,
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

          <form onSubmit={handleSave} className="space-y-4">
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
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                placeholder="Contoh: ZII Distro & Laundry Studio"
              />
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Contoh: 0812-9988-7766"
              />
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Contoh: Jl. Merdeka Raya No. 45, Jakarta"
              />
            </div>

            <div>
              <label
                htmlFor="footerText"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Pesan Footer Struk Belanja
              </label>
              <textarea
                id="footerText"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none transition"
                placeholder="Terima kasih telah berbelanja di ZII Store! Simpan nota ini sebagai bukti garansi."
              />
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
